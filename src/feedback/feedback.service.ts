import {eq} from "drizzle-orm";
import db from "../drizzle/db";
 import { TIFeedback, TSFeedback, feedback } from "../drizzle/schema";
  export const feedbackService = async (limit?: number): Promise<TSFeedback[] | null> => {
    if (limit) {
      return await db.query.feedback.findMany({
        limit: limit
      });
    }
    return await db.query.feedback.findMany();
  };

  
export const getfeedbackService = async (id: number): Promise<TIFeedback | undefined> => {
    return await db.query.feedback.findFirst({
        where: eq(feedback.id, id)
    });

}
export const createfeedbackService = async (user: TIFeedback) => {
    await db.insert(feedback).values(user)
    return "feedback created successfully";

}

export const updatefeedbackService = async (id: number, user: TIFeedback) => {
    await db.update(feedback).set(user).where(eq(feedback.id, id))
    return "feedback updated successfully";
}

export const deletefeedbackService = async (id: number) => {
    await db.delete(feedback).where(eq(feedback.id, id))
    return "feedback deleted successfully";
}
