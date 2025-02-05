
import { Context } from "hono";
import {feedbackService, getfeedbackService, createfeedbackService, updatefeedbackService, deletefeedbackService} from "./feedback.service";
import*as bcrypt from "bcrypt";
export const listfeedbacks = async (c: Context) => {
    try {
        //limit the number of feedbackss to be returned

        const limit = Number(c.req.query('limit'))

        const data = await feedbackService(limit);
        if (data == null || data.length == 0) {
            return c.text("feedbacks not found", 404)
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const getfeedbacks = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const feedbacks = await getfeedbackService(id);
    if (feedbacks == undefined) {
        return c.text("feedbacks not found", 404);
    }
    return c.json(feedbacks, 200);
}
export const createfeedbacks = async (c: Context) => {
    try {
        const feedbacks = await c.req.json();
        // const password=feedbacks.password;
        // const hashedPassword=await bcrypt.hash(password,10);
        // feedbacks.password=hashedPassword;
        const createdfeedbacks = await createfeedbackService(feedbacks);


        if (!createdfeedbacks) return c.text("feedbacks not created", 404);
        return c.json({ msg: createdfeedbacks }, 201);

    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const updatefeedbacks = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const feedbacks = await c.req.json();
    try {
        // search for the feedbacks
        const searchedfeedbacks= await getfeedbackService(id);
        if (searchedfeedbacks == undefined) return c.text("feedbacks not found", 404);
        // get the data and update it
        const res = await updatefeedbackService(id, feedbacks);
        // return a success message
        if (!res) return c.text("feedbacks not updated", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const deletefeedbacks = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
        //search for the feedbacks
        const feedbacks = await getfeedbackService(id);
        if (feedbacks== undefined) return c.text("feedbacks not found", 404);
        //deleting the feedbacks
        const res = await deletefeedbackService(id);
        if (!res) return c.text("feedbacks not deleted", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}
 
 