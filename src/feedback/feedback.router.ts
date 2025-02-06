import { Hono } from "hono";
import { listfeedbacks,getfeedbacks , createfeedbacks, updatefeedbacks, deletefeedbacks } from "./feedback.controller"
import { zValidator } from "@hono/zod-validator";
import { feedbackSchema} from "./validator"; 
import { adminRoleAuth } from '../middleware/bearAuth'
export const feedbackRouter = new Hono();
//get all feedbacks
feedbackRouter.get("/feedbacks",adminRoleAuth ,listfeedbacks) 

//get a single therapist   api/therapist/1
feedbackRouter.get("/feedbacks/:id",adminRoleAuth, getfeedbacks)

// create a therapist 
feedbackRouter.post("/feedbacks", zValidator('json', feedbackSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), createfeedbacks)

//update a therapist
feedbackRouter.put("/feedbacks/:id", updatefeedbacks) 

feedbackRouter.delete("/feedbacks/:id", deletefeedbacks)

