import { integer } from 'drizzle-orm/pg-core'
import { z } from 'zod'
import { date } from 'drizzle-orm/pg-core'

export const sessionSchema = z.object({
        user_id: z.number(),
        therapist_id:z.number(),
        session_date: z.coerce.date(), 
        session_notes: z.string(),
})

