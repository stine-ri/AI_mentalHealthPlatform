
import { Context } from "hono";
import {resourcesService, getResourcesService, createResourcesService, updateResourcesService, deleteResourcesService} from "./resources.service";
import*as bcrypt from "bcrypt";
export const listresourcess = async (c: Context) => {
    try {
        //limit the number of resourcesss to be returned

        const limit = Number(c.req.query('limit'))

        const data = await resourcesService(limit);
        if (data == null || data.length == 0) {
            return c.text("resourcess not found", 404)
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const getresourcess = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const resourcess = await getResourcesService(id);
    if (resourcess == undefined) {
        return c.text("resourcess not found", 404);
    }
    return c.json(resourcess, 200);
}
export const createresourcess = async (c: Context) => {
    try {
        const resourcess = await c.req.json();
        // const password=resourcess.password;
        // const hashedPassword=await bcrypt.hash(password,10);
        // resourcess.password=hashedPassword;
        const createdresourcess = await createResourcesService(resourcess);


        if (!createdresourcess) return c.text("resourcess not created", 404);
        return c.json({ msg: createdresourcess }, 201);

    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const updateresourcess = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const resourcess = await c.req.json();
    try {
        // search for the resourcess
        const searchedresourcess= await getResourcesService(id);
        if (searchedresourcess == undefined) return c.text("resourcess not found", 404);
        // get the data and update it
        const res = await updateResourcesService(id, resourcess);
        // return a success message
        if (!res) return c.text("resourcess not updated", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const deleteresourcess = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
        //search for the resourcess
        const resourcess = await getResourcesService(id);
        if (resourcess== undefined) return c.text("resourcess not found", 404);
        //deleting the resourcess
        const res = await deleteResourcesService(id);
        if (!res) return c.text("resourcess not deleted", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}
 
 