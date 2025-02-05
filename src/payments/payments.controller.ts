
import { Context } from "hono";
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
 
 