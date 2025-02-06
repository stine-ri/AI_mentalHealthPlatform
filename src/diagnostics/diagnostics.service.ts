import {eq} from "drizzle-orm";

import db from "../drizzle/db";
 import { TIDiagnostics, TSDiagnostics, diagnostics } from "../drizzle/schema";
  export const diagnosticService = async (limit?: number): Promise<TSDiagnostics[] | null> => {
    if (limit) {
      return await db.query.diagnostics.findMany({
        limit: limit
      });
    }
    return await db.query.diagnostics.findMany();
  };

  
export const getDiagnosticService = async (id: number): Promise<TIDiagnostics | undefined> => {
    return await db.query.diagnostics.findFirst({
        where: eq(diagnostics.id, id)
    });

}
export const createDiagnosticService = async (user: TIDiagnostics) => {
    await db.insert(diagnostics).values(user)
    return "diagnostic created successfully";

}

export const updateDiagnosticService = async (id: number, user: TIDiagnostics) => {
    await db.update(diagnostics).set(user).where(eq(diagnostics.id, id))
    return "diagnostic updated successfully";
}

export const deleteDiagnosticService = async (id: number) => {
    await db.delete(diagnostics).where(eq(diagnostics.id, id))
    return "diagnostic deleted successfully";
}
