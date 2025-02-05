    import { integer } from 'drizzle-orm/pg-core'
    import { z } from 'zod'
    
    
    export const feedbackSchema = z.object({
        user_id:z.number(),
        session_id: z.number(),
        rating: z.number(),
        comments: z.string(),
    })
    
    