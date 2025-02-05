import {eq} from "drizzle-orm";
import db from "../drizzle/db";
 import { TIResources, TSResources, resources } from "../drizzle/schema";
  export const resourcesService = async (limit?: number): Promise<TSResources[] | null> => {
    if (limit) {
      return await db.query.resources.findMany({
        limit: limit
      });
    }
    return await db.query.resources.findMany();
  };

  
export const getResourcesService = async (id: number): Promise<TIResources | undefined> => {
    return await db.query.resources.findFirst({
        where: eq(resources.id, id)
    });

}
export const createResourcesService = async (user: TIResources) => {
    await db.insert(resources).values(user)
    return "resources created successfully";

}

export const updateResourcesService = async (id: number, user: TIResources) => {
    await db.update(resources).set(user).where(eq(resources.id, id))
    return "resources updated successfully";
}

export const deleteResourcesService = async (id: number) => {
    await db.delete(resources).where(eq(resources.id, id))
    return "resources deleted successfully";
}
