import {eq} from "drizzle-orm";
import db from "../drizzle/db";
 import { TIPayment, TSPayment, payments } from "../drizzle/schema";
  export const paymentService = async (limit?: number): Promise<TSPayment[] | null> => {
    if (limit) {
      return await db.query.payments.findMany({
        limit: limit
      });
    }
    return await db.query.payments.findMany();
  };

  
export const getPaymentService = async (id: number): Promise<TIPayment | undefined> => {
    return await db.query.payments.findFirst({
        where: eq(payments.id, id)
    });

}
export const createPaymentService = async (user: TIPayment) => {
    await db.insert(payments).values(user)
    return "payment created successfully";

}

export const updatePaymentService = async (id: number, user: TIPayment) => {
    await db.update(payments).set(user).where(eq(payments.id, id))
    return "payment updated successfully";
}

export const deletePaymentService = async (id: number) => {
    await db.delete(payments).where(eq(payments.id, id))
    return "payment deleted successfully";
}
