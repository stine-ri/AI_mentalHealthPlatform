import { Hono } from "hono";
import { listBookings,getBookings , createBookings, updateBookings, deleteBookings } from "./bookings.controller"
import { zValidator } from "@hono/zod-validator";
import { bookingsSchema} from "./validator"; 
import { adminRoleAuth } from '../middleware/bearAuth'
export const bookingRouter = new Hono();
//get all Bookings
bookingRouter.get("/bookings",adminRoleAuth ,listBookings) 

//get a single therapist   api/therapist/1
bookingRouter.get("/bookings/:id",adminRoleAuth, getBookings)

// create a therapist 
bookingRouter.post("/bookings", zValidator('json', bookingsSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), createBookings)

//update a therapist
bookingRouter.put("/bookings/:id", updateBookings) 

bookingRouter.delete("/bookings/:id", deleteBookings)

