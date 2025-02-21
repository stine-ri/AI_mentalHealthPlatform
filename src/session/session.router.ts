import { Hono } from "hono";
import { listsession,getsession , createsession, updatesession, deletesession } from "./session.controller"
import { zValidator } from "@hono/zod-validator";
import { sessionSchema } from "./validator"; 
import { adminRoleAuth } from '../middleware/bearAuth'
import {therapistRoleAuth } from '../middleware/bearAuth'
export const sessionRouter = new Hono();
//get all session
sessionRouter.get("/session" ,listsession) 
// ,adminRoleAuth
//get a single therapist   api/therapist/1
sessionRouter.get("/session/:id", getsession)
// ,adminRoleAuth
// create a therapist 
sessionRouter.post("/session", zValidator('json', sessionSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), createsession)

//update a therapist
sessionRouter.put("/session/:id", updatesession) 

sessionRouter.delete("/session/:id",therapistRoleAuth,adminRoleAuth, deletesession)

