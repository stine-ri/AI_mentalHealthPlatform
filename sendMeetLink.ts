import { Hono } from "hono";
import { db } from "./src/drizzle/db"; // Your Drizzle DB connection
import { users, bookings } from "./src/drizzle/schema";
import nodemailer from "nodemailer";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config();

const app = new Hono();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Therapist sends Google Meet link
app.post("/api/send-meet-link", async (c) => {
  const { bookingId, meetLink } = await c.req.json();

  if (!bookingId || !meetLink) {
    return c.json({ error: "Booking ID and Meet link are required" }, 400);
  }

  // Get the user who booked this session
  const booking = await db
    .select({
      userId: bookings.user_id, // Correct field
      email: users.email,
    })
    .from(bookings)
    .innerJoin(users, eq(users.id, bookings.user_id))
    .where(eq(bookings.id, bookingId))
    .limit(1);

  if (!booking.length) {
    return c.json({ error: "Booking not found" }, 404);
  }

  const userEmail = booking[0].email;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Google Meet Link for Your Session",
      text: `Hello, your therapist has scheduled a Google Meet session. Join using this link: ${meetLink}`,
    });

    return c.json({ success: `Meet link sent to ${userEmail}` });
  } catch (error) {
    console.error("Email sending error:", error);
    return c.json({ error: "Failed to send email. Please try again later." }, 500);
  }
});

export default app;
