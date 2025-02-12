import { Hono } from "hono";
import { listPayments,getPayments , createPayments, updatePayments, deletePayments } from "./payments.controller"
import { zValidator } from "@hono/zod-validator";
import { paymentsSchema} from "./validator"; 
import { adminRoleAuth } from '../middleware/bearAuth'
import { createPaymentIntent, handleWebhook } from './payments.controller';
export const paymentRouter = new Hono();
//get all payments
paymentRouter.get("/payments",adminRoleAuth ,listPayments) 

//get a single therapist   api/therapist/1
paymentRouter.get("/payments/:id",adminRoleAuth, getPayments)

// create a therapist 
paymentRouter.post("/payments", zValidator('json', paymentsSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), createPayments)

//update a therapist
paymentRouter.put("/payments/:id", updatePayments) 

paymentRouter.delete("/payments/:id", deletePayments)

//stripe
paymentRouter.post('/payments/create-payment-intent', createPaymentIntent);
paymentRouter.post('/payments/webhook', handleWebhook);
