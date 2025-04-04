import { integer } from 'drizzle-orm/pg-core'
import { z } from 'zod'


export const therapistSchema = z.object({
      user_id: z.number(),
      full_name: z.string(),
      specialization: z.string(),
      experience_years: z.number(),
      contact_phone: z.string(),
      availability: z.boolean(),
})

