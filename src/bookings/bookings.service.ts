import {eq} from "drizzle-orm";
import db from "../drizzle/db";
 import { TIBookings, TSBookings, bookings } from "../drizzle/schema";
  export const BookingsService = async (limit?: number): Promise<TSBookings[] | null> => {
    if (limit) {
      return await db.query.bookings.findMany({
        limit: limit
      });
    }
    return await db.query.bookings.findMany();
  };

  
export const getBookingsService = async (id: number): Promise<TIBookings | undefined> => {
    return await db.query.bookings.findFirst({
        where: eq(bookings.id, id)
    });

}
export const createBookingsService = async (user: TIBookings) => {
    await db.insert(bookings).values(user)
    return "therapist created successfully";

}

export const updateBookingsService = async (id: number, user: TIBookings) => {
    await db.update(bookings).set(user).where(eq(bookings.id, id))
    return "therapist updated successfully";
}

export const deleteBookingsService = async (id: number) => {
    await db.delete(bookings).where(eq(bookings.id, id))
    return "therapist deleted successfully";
}
