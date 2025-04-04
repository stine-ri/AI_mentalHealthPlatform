import {
    pgTable,
    serial,
    text,
    varchar,
    integer,
    primaryKey,
    decimal,
    boolean,
    timestamp,
    date,
    time,
    pgEnum,
  } from "drizzle-orm/pg-core";
  import { relations } from "drizzle-orm";
  
  // Enums
  export const roleEnum = pgEnum("role", ["admin", "therapist", "user"]);
  
  // Users Table
  export const users = pgTable("users", {
    id: serial("user_id").primaryKey(),
    full_name: text("full_name").notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    contact_phone: varchar("contact_phone", { length: 20 }),
    address: text("address"),
    role: roleEnum("role").default("user").notNull(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
  });
  
 // Update Users-Therapists Relationship
export const usersRelations = relations(users, ({ many, one }) => ({
  therapists: one(therapists, { fields: [users.id], references: [therapists.user_id] }), // One user can be a therapist
  sessions: many(sessions),
  feedback: many(feedback),
  diagnostics: many(diagnostics),
  payments: many(payments),
  bookings: many(bookings),
  authentication: one(Authentication, { fields: [users.id], references: [Authentication.user_id] }),
}));
  
// Therapists Table (Updated)
export const therapists = pgTable("therapists", {
  id: serial("therapist_id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }), // Link to users
  full_name: text("full_name").notNull(),
  specialization: varchar("specialization", { length: 255 }),
  experience_years: integer("experience_years").default(0),
  contact_phone: varchar("contact_phone", { length: 20 }),
  availability: boolean("availability").default(true), 
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});


export const therapistsRelations = relations(therapists, ({ one, many }) => ({
  user: one(users, { fields: [therapists.user_id], references: [users.id] }), // A therapist is also a user
  sessions: many(sessions),
  bookings: many(bookings),
}));

  
  // Sessions Table
  export const sessions = pgTable("sessions", {
    id: serial("session_id").primaryKey(),
    user_id: integer("user_id").notNull().references(() => users.id),
    therapist_id: integer("therapist_id").notNull().references(() => therapists.id),
    session_date: date("session_date").notNull(),
    session_notes: text("session_notes"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
  });
  
  export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, { fields: [sessions.user_id], references: [users.id] }),
    therapist: one(therapists, {
      fields: [sessions.therapist_id],
      references: [therapists.id],
    }),
  }));
  
  // Diagnostics Table
  export const diagnostics = pgTable("diagnostics", {
    id: serial("diagnostic_id").primaryKey(),
    user_id: integer("user_id").notNull().references(() => users.id),
    diagnosis: varchar("diagnosis", { length: 255 }).notNull(),
    recommendations: text("recommendations"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
  });
  
  export const diagnosticsRelations = relations(diagnostics, ({ one }) => ({
    user: one(users, { fields: [diagnostics.user_id], references: [users.id] }),
  }));
  
  // Feedback Table
  export const feedback = pgTable("feedback", {
    id: serial("feedback_id").primaryKey(),
    user_id: integer("user_id").notNull().references(() => users.id),
    session_id: integer("session_id").notNull().references(() => sessions.id),
    rating: integer("rating").notNull(),
    comments: text("comments"),
    created_at: timestamp("created_at").defaultNow(),
  });
  
  export const feedbackRelations = relations(feedback, ({ one }) => ({
    user: one(users, { fields: [feedback.user_id], references: [users.id] }),
    session: one(sessions, { fields: [feedback.session_id], references: [sessions.id] }),
  }));
  
    // Payments Table
    export const payments = pgTable("payments", {
      id: serial("payment_id").primaryKey(),  // Primary Key for the payment
      user_id: integer("user_id")
        .notNull()
        .references(() => users.id), // Foreign key to users
      session_id: integer("session_id")
        .notNull()
        .references(() => sessions.id), // Foreign key to sessions
      amount: decimal("amount", { precision: 10, scale: 2 })
        .notNull(), // Store payment amounts up to two decimal places
      payment_status: varchar("payment_status", { length: 50 })
        .default("Pending"), // Track payment status
      payment_date: date("payment_date")
        .defaultNow(), // Track payment date
      stripe_payment_id: text("stripe_payment_id")
        .notNull(), // Store Stripe payment intent ID
      created_at: timestamp("created_at")
        .defaultNow(), // Creation timestamp
      updated_at: timestamp("updated_at")
        .defaultNow(), // Updated timestamp
    });
  
  export const paymentsRelations = relations(payments, ({ one }) => ({
    user: one(users, { fields: [payments.user_id], references: [users.id] }),
    session: one(sessions, { fields: [payments.session_id], references: [sessions.id] }),
  }));
  
  // Self-Help Resources Table
  export const resources = pgTable("resources", {
    id: serial("resource_id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content").notNull(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
  });
  
// Bookings Table
export const bookings = pgTable("bookings", {
  id: serial("booking_id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  therapist_id: integer("therapist_id").notNull().references(() => therapists.id),
  session_date: date("session_date").notNull(),
  session_time: time("session_time").notNull(), // Added session time column
  booking_status: varchar("booking_status", { length: 50 }).default("Pending"), // Could be "Confirmed", "Cancelled", etc.
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Define relationships for bookings table
export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, { fields: [bookings.user_id], references: [users.id] }),
  therapist: one(therapists, { fields: [bookings.therapist_id], references: [therapists.id] }),
}));

// Authentication Table
export const Authentication = pgTable("authentication", {
    auth_id: serial("auth_id").primaryKey(),
    user_id: integer("user_id").notNull().references(() => users.id,{onDelete:"cascade"}),
    password: varchar("password"),
    email: varchar("email", { length: 255 }).unique(),
    role: roleEnum("role").default("user"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
});
 
export const authenticationRelations = relations(Authentication, ({ one }) => ({
    user: one(users, {
        fields: [Authentication.user_id],
        references: [users.id],
    }),
}));

 // M-Pesa Transaction Schema
 export const mpesaTransactions = pgTable('mpesa_transactions', {
  id: serial('id').primaryKey(),
  merchantRequestId: varchar('merchant_request_id', { length: 100 }).notNull(),
  checkoutRequestId: varchar('checkout_request_id', { length: 100 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 15 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  referenceCode: varchar('reference_code', { length: 50 }).notNull(),
  description: varchar('description', { length: 255 }).notNull(),
  transactionDate: timestamp('transaction_date').defaultNow().notNull(),
  mpesaReceiptNumber: varchar('mpesa_receipt_number', { length: 50 }),
  resultCode: integer('result_code'),
  resultDescription: varchar('result_description', { length: 255 }),
  isComplete: boolean('is_complete').default(false),
  isSuccessful: boolean('is_successful').default(true),
  callbackMetadata: varchar('callback_metadata', { length: 1000 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Export types for TypeScript support
export type MpesaTransaction = typeof mpesaTransactions.$inferSelect;
export type NewMpesaTransaction = typeof mpesaTransactions.$inferInsert;
  
export type TIUsers = typeof users.$inferInsert;
export type TSUsers = typeof users.$inferSelect;

export type TIAuthentication = typeof Authentication.$inferInsert;
export type TSAuthentication = typeof Authentication.$inferSelect;

export type TITherapists = typeof therapists.$inferInsert;
export type TSTherapists = typeof  therapists.$inferSelect

export type TISession = typeof sessions.$inferInsert;
export type TSSession = typeof sessions.$inferSelect;

export type TIDiagnostics = typeof diagnostics .$inferInsert;
export type TSDiagnostics  = typeof diagnostics .$inferSelect;

export type TIFeedback = typeof feedback .$inferInsert;
export type TSFeedback = typeof feedback .$inferSelect;

export type TIPayment = typeof payments .$inferInsert;
export type TSPayment = typeof payments .$inferSelect;

export type TIBookings = typeof bookings .$inferInsert;
export type TSBookings = typeof bookings .$inferSelect;

export type TIResources = typeof resources .$inferInsert;
export type TSResources = typeof resources .$inferSelect;