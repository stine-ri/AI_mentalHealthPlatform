import { integer } from 'drizzle-orm/pg-core'
import { z } from 'zod'


export const sessionSchema = z.object({
        user_id: z.number(),
        therapist_id:z.number(),
        session_date:  z.string(),
        session_notes: z.string(),
})

