import { Hono } from "hono";
import { listtherapists,gettherapists , createtherapists, updatetherapists, deletetherapists } from "./therapists.controller"
import { zValidator } from "@hono/zod-validator";
import { therapistSchema } from "./validator"; 
import { adminRoleAuth } from '../middleware/bearAuth'
export const therapistRouter = new Hono();
//get all therapists
therapistRouter.get("/therapists",adminRoleAuth ,listtherapists) 

//get a single therapist   api/therapist/1
therapistRouter.get("/therapists/:id",adminRoleAuth, gettherapists)

// create a therapist 
therapistRouter.post("/therapists", zValidator('json', therapistSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), createtherapists)

//update a therapist
therapistRouter.put("/therapists/:id", updatetherapists) 

therapistRouter.delete("/therapists/:id",adminRoleAuth, deletetherapists)

