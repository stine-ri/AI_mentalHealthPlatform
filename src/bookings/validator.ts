    import { integer } from 'drizzle-orm/pg-core'
    import { z } from 'zod'
    
    
    export const bookingsSchema = z.object({
        user_id:z.number(),
        therapist_id:z.number(),
        session_date: z.coerce.date(),
        session_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, "Invalid time format"),
        booking_status: z.string(),
    })
    
    