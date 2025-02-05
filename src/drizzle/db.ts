import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from './schema'

export const client = new Client({
    connectionString: process.env.Database_URL as string,  // get database url from the dotenv
})

const main = async()=>{
    await client.connect() // connect to database
 
}  
  
main();

const db = drizzle(client,{schema, logger:true})

export default db;