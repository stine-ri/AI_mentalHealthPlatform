    import { integer } from 'drizzle-orm/pg-core'
    import { z } from 'zod'
    
    
    export const resourcesSchema = z.object({
        title:z.string(),
        content:z.string(),
    })
    
    