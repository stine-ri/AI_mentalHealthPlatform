import { Hono } from "hono";
import { listUsers, getUser, createUser, updateUser, deleteUser, } from "./users.controller"
import { zValidator } from "@hono/zod-validator";
import { usersSchema } from "./validator"; 
import { adminRoleAuth } from '../middleware/bearAuth'
export const userRouter = new Hono();
//get all users
userRouter.get("/users",adminRoleAuth ,listUsers) 

//get a single user   api/users/1
userRouter.get("/users/:id",adminRoleAuth, getUser)

// create a user 
userRouter.post("/users", zValidator('json', usersSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), createUser)

//update a user
userRouter.put("/users/:id", updateUser) 

userRouter.delete("/users/:id",adminRoleAuth, deleteUser)

