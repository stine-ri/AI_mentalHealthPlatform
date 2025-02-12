    import { integer } from 'drizzle-orm/pg-core'
    import { z } from 'zod'
    
    
    export const paymentsSchema = z.object({
        user_id: z.number(),
        session_id:z.number(),
        amount: z.number(),
        payment_status:z.string(),
        payment_date: z.coerce.date(),
        stripe_payment_id: z.string(),
    })
    
    