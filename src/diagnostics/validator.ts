    import { integer } from 'drizzle-orm/pg-core'
    import { z } from 'zod'
    
    
    export const diagnosticSchema = z.object({
        user_id:z.number(),
        diagnosis: z.string(),
        recommendations: z.string(),
    })
    
    