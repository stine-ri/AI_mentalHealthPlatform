
import { Context } from "hono";
import {stripe} from '../stripe/stripe'
import type Stripe from 'stripe';
import  db  from '../drizzle/db';
import { payments } from '../drizzle/schema';
import {eq, SQL} from "drizzle-orm"
import {paymentService, getPaymentService, createPaymentService, updatePaymentService, deletePaymentService} from "./payments.service";
import*as bcrypt from "bcrypt";
export const listPayments = async (c: Context) => {
    try {
        //limit the number of paymentss to be returned

        const limit = Number(c.req.query('limit'))

        const data = await paymentService(limit);
        if (data == null || data.length == 0) {
            return c.text("payments not found", 404)
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const getPayments = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const payments = await getPaymentService(id);
    if (payments == undefined) {
        return c.text("payments not found", 404);
    }
    return c.json(payments, 200);
}
export const createPayments = async (c: Context) => {
    try {
        const payments = await c.req.json();
        // const password=payments.password;
        // const hashedPassword=await bcrypt.hash(password,10);
        // payments.password=hashedPassword;
        const createdpayments = await createPaymentService(payments);


        if (!createdpayments) return c.text("payments not created", 404);
        return c.json({ msg: createdpayments }, 201);

    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const updatePayments = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const payments = await c.req.json();
    try {
        // search for the payments
        const searchedpayments= await getPaymentService(id);
        if (searchedpayments == undefined) return c.text("payments not found", 404);
        // get the data and update it
        const res = await updatePaymentService(id, payments);
        // return a success message
        if (!res) return c.text("payments not updated", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const deletePayments = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
        //search for the payments
        const payments = await getPaymentService(id);
        if (payments== undefined) return c.text("payments not found", 404);
        //deleting the payments
        const res = await deletePaymentService(id);
        if (!res) return c.text("payments not deleted", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}


// stripe
export const createPaymentIntent = async (c: Context) => {
  try {
    const { amount, currency, userId, sessionId } = await c.req.json();

    if (!amount || !currency || !userId || !sessionId) {
      return c.json(
        { error: "Amount, currency, userId, and sessionId are required" },
        400
      );
    }

    // Convert amount to cents (Stripe requires smallest currency unit)
    const amountInCents = Math.round(amount * 100);

    // ✅ Create PaymentIntent in Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
      metadata: { userId: String(userId), sessionId: String(sessionId) },
    });

    console.log("🔥 Created PaymentIntent:", paymentIntent);

    if (!paymentIntent || !paymentIntent.id) {
      throw new Error("Stripe PaymentIntent ID is missing!");
    }

    // ✅ Insert Payment Record into DB (Including Missing Fields)
    await db.insert(payments).values({
      user_id: userId,
      session_id: sessionId,
      amount,
      stripe_payment_id: paymentIntent.id, // ✅ Ensure Stripe ID is included
      payment_status: "Pending", // ✅ Fix missing field
      payment_date: new Date().toISOString(), // ✅ Fix missing field
    });

    return c.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return c.json({ error: "Failed to create payment intent" }, 500);
  }
};
export const handleWebhook = async (c: Context) => {
  const rawBody = await c.req.text();
  const sig = c.req.header("Stripe-Signature") || "";

  console.log("📩 Incoming Webhook!");
  console.log("🔹 Signature:", sig);
  console.log("🔹 Raw Body:", rawBody);

  try {
    const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!stripeWebhookSecret) {
        throw new Error("Stripe webhook secret is not defined");
    }
    const event = stripe.webhooks.constructEvent(rawBody, sig, stripeWebhookSecret);
    
    console.log("✅ Event Received:", event.type);

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const stripePaymentId = paymentIntent.id;
      const amount = paymentIntent.amount / 100; // Convert cents to dollars
      const currency = paymentIntent.currency;
      const userId = paymentIntent.metadata?.userId;
      const sessionId = paymentIntent.metadata?.sessionId;

      console.log("🎉 Payment Intent Succeeded!", {
        stripePaymentId,
        amount,
        currency,
        userId,
        sessionId,
      });

      if (!userId || !sessionId) {
        console.error("❌ Missing userId or sessionId in metadata");
        return c.json({ error: "Missing metadata" }, 400);
      }

      console.log("🔹 Checking if payment exists before update...");
      const existingPayment = await db.query.payments.findFirst({
        where: and(
          eq(payments.user_id, Number(userId)),
          eq(payments.session_id, Number(sessionId))
        ),
      });

      if (!existingPayment) {
        console.error("❌ No matching payment found in the database!");
        return c.json({ error: "Payment record not found" }, 400);
      }

      console.log("🔹 Updating payment status in DB...");

      const result = await db
        .update(payments)
        .set({
          payment_status: "Completed",
          stripe_payment_id: stripePaymentId, // Make sure this column exists
        })
        .where(
          and(
            eq(payments.user_id, Number(userId)), 
            eq(payments.session_id, Number(sessionId))
          )
        )
        .execute();

      console.log("✅ Update result:", result);
      console.log("✅ Payment status updated successfully!");
    }

    return c.json({ received: true });
  } catch (err) {
    console.error("❌ Webhook Error:", err);
    return c.json({ error: "Webhook processing failed" }, 400);
  }
};
function and(arg0: SQL<unknown>, arg1: SQL<unknown>): SQL<unknown> | undefined {
  throw new Error("Function not implemented.");
}

