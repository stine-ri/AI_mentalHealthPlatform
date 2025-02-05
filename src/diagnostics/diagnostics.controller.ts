
import { Context } from "hono";
import {diagnosticService, getDiagnosticService, createDiagnosticService, updateDiagnosticService, deleteDiagnosticService} from "./diagnostics.service";
import*as bcrypt from "bcrypt";
export const listdiagnostics = async (c: Context) => {
    try {
        //limit the number of diagnosticss to be returned

        const limit = Number(c.req.query('limit'))

        const data = await diagnosticService(limit);
        if (data == null || data.length == 0) {
            return c.text("diagnostics not found", 404)
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const getdiagnostics = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const diagnostics = await getDiagnosticService(id);
    if (diagnostics == undefined) {
        return c.text("diagnostics not found", 404);
    }
    return c.json(diagnostics, 200);
}
export const creatediagnostics = async (c: Context) => {
    try {
        const diagnostics = await c.req.json();
        // const password=diagnostics.password;
        // const hashedPassword=await bcrypt.hash(password,10);
        // diagnostics.password=hashedPassword;
        const createddiagnostics = await createDiagnosticService(diagnostics);


        if (!createddiagnostics) return c.text("diagnostics not created", 404);
        return c.json({ msg: createddiagnostics }, 201);

    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const updatediagnostics = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const diagnostics = await c.req.json();
    try {
        // search for the diagnostics
        const searcheddiagnostics= await getDiagnosticService(id);
        if (searcheddiagnostics == undefined) return c.text("diagnostics not found", 404);
        // get the data and update it
        const res = await updateDiagnosticService(id, diagnostics);
        // return a success message
        if (!res) return c.text("diagnostics not updated", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const deletediagnostics = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
        //search for the diagnostics
        const diagnostics = await getDiagnosticService(id);
        if (diagnostics== undefined) return c.text("diagnostics not found", 404);
        //deleting the diagnostics
        const res = await deleteDiagnosticService(id);
        if (!res) return c.text("diagnostics not deleted", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}
 
 