
import { Context } from "hono";
import {therapistsService, getTherapistservice, createTherapistservice, updateTherapistservice, deleteTherapistservice} from "./therapists.service";
import*as bcrypt from "bcrypt";
export const listtherapists = async (c: Context) => {
    try {
        //limit the number of therapistss to be returned

        const limit = Number(c.req.query('limit'))

        const data = await therapistsService(limit);
        if (data == null || data.length == 0) {
            return c.text("therapists not found", 404)
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const gettherapists = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const therapists = await getTherapistservice(id);
    if (therapists == undefined) {
        return c.text("therapists not found", 404);
    }
    return c.json(therapists, 200);
}
export const createtherapists = async (c: Context) => {
    try {
        const therapists = await c.req.json();
        // const password=therapists.password;
        // const hashedPassword=await bcrypt.hash(password,10);
        // therapists.password=hashedPassword;
        const createdtherapists = await createTherapistservice(therapists);


        if (!createdtherapists) return c.text("therapists not created", 404);
        return c.json({ msg: createdtherapists }, 201);

    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const updatetherapists = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const therapists = await c.req.json();
    try {
        // search for the therapists
        const searchedtherapists= await getTherapistservice(id);
        if (searchedtherapists == undefined) return c.text("therapists not found", 404);
        // get the data and update it
        const res = await updateTherapistservice(id, therapists);
        // return a success message
        if (!res) return c.text("therapists not updated", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const deletetherapists = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
        //search for the therapists
        const therapists = await getTherapistservice(id);
        if (therapists== undefined) return c.text("therapists not found", 404);
        //deleting the therapists
        const res = await deleteTherapistservice(id);
        if (!res) return c.text("therapists not deleted", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}
 
 