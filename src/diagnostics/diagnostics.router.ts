import { Hono } from "hono";
import { listdiagnostics,getdiagnostics , creatediagnostics, updatediagnostics, deletediagnostics } from "./diagnostics.controller"
import { zValidator } from "@hono/zod-validator";
import { diagnosticSchema} from "./validator"; 
import { adminRoleAuth } from '../middleware/bearAuth'
import { therapistRoleAuth } from '../middleware/bearAuth'
export const diagnosticRouter = new Hono();
//get all diagnostics
diagnosticRouter.get("/diagnostics",adminRoleAuth ,listdiagnostics) 

//get a single therapist   api/therapist/1
diagnosticRouter.get("/diagnostics/:id",adminRoleAuth, getdiagnostics)

// create a therapist 
diagnosticRouter.post("/diagnostics", zValidator('json', diagnosticSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), creatediagnostics)

//update a therapist
diagnosticRouter.put("/diagnostics/:id", updatediagnostics) 

diagnosticRouter.delete("/diagnostics/:id",therapistRoleAuth, deletediagnostics)

