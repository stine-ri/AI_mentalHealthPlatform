
import { Context } from "hono";
import {sessionService, getSessionService, createSessionService, updateSessionService, deleteSessionService} from "./session.service";
import*as bcrypt from "bcrypt";
export const listsession = async (c: Context) => {
    try {
        //limit the number of sessions to be returned

        const limit = Number(c.req.query('limit'))

        const data = await sessionService(limit);
        if (data == null || data.length == 0) {
            return c.text("session not found", 404)
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const getsession = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const session = await getSessionService(id);
    if (session == undefined) {
        return c.text("session not found", 404);
    }
    return c.json(session, 200);
}
export const createsession = async (c: Context) => {
    try {
        const session = await c.req.json();
        // const password=session.password;
        // const hashedPassword=await bcrypt.hash(password,10);
        // session.password=hashedPassword;
        const createdsession = await createSessionService(session);


        if (!createdsession) return c.text("session not created", 404);
        return c.json({ msg: createdsession }, 201);

    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const updatesession = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const session = await c.req.json();
    try {
        // search for the session
        const searchedsession= await getSessionService(id);
        if (searchedsession == undefined) return c.text("session not found", 404);
        // get the data and update it
        const res = await updateSessionService(id, session);
        // return a success message
        if (!res) return c.text("session not updated", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const deletesession = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
        //search for the session
        const session = await getSessionService(id);
        if (session== undefined) return c.text("session not found", 404);
        //deleting the session
        const res = await deleteSessionService(id);
        if (!res) return c.text("session not deleted", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}
 
 