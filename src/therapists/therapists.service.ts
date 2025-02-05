import {eq} from "drizzle-orm";

import db from "../drizzle/db";
 import { TITherapists, TSTherapists, therapists } from "../drizzle/schema";
  export const therapistsService = async (limit?: number): Promise<TSTherapists[] | null> => {
    if (limit) {
      return await db.query.therapists.findMany({
        limit: limit
      });
    }
    return await db.query.therapists.findMany();
  };

  
export const getTherapistservice = async (id: number): Promise<TITherapists | undefined> => {
    return await db.query.therapists.findFirst({
        where: eq(therapists.id, id)
    });

}
export const createTherapistservice = async (user: TITherapists) => {
    await db.insert(therapists).values(user)
    return "therapist created successfully";

}

export const updateTherapistservice = async (id: number, user: TITherapists) => {
    await db.update(therapists).set(user).where(eq(therapists.id, id))
    return "therapist updated successfully";
}

export const deleteTherapistservice = async (id: number) => {
    await db.delete(therapists).where(eq(therapists.id, id))
    return "therapist deleted successfully";
}
