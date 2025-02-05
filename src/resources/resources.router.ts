import { Hono } from "hono";
import { listresourcess,getresourcess , createresourcess, updateresourcess, deleteresourcess } from "./resources.controller"
import { zValidator } from "@hono/zod-validator";
import { resourcesSchema} from "./validator"; 
import { adminRoleAuth } from '../middleware/bearAuth'
export const resourcesRouter = new Hono();
//get all resourcess
resourcesRouter.get("/resources",adminRoleAuth ,listresourcess) 

//get a single therapist   api/therapist/1
resourcesRouter.get("/resources/:id",adminRoleAuth, getresourcess)

// create a therapist 
resourcesRouter.post("/resources", zValidator('json', resourcesSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), createresourcess)

//update a therapist
resourcesRouter.put("/resources/:id", updateresourcess) 

resourcesRouter.delete("/resources/:id",adminRoleAuth, deleteresourcess)

