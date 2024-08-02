'use server'

import { ID, Query } from "node-appwrite"
import {
    NEXT_PUBLIC_BUCKET_ID,
    DATABASE_ID,
    NEXT_PUBLIC_ENDPOINT,
    PATIENT_COLLECTION_ID,
    PROJECT_ID,
    databases,
    storage,
    users,
} from "../appwrite.config"
import { parseStringify } from "../utils"


// create appwrite user
// export const createUser = async (user: CreateUserParams) => {
//     try {
//         console.log("Creating new user:: ", user)

//         const newUser = await users.create(
//             ID.unique(),
//             user.email,
//             user.phone,
//             undefined, // password
//             user.name
//         )

//         return parseStringify(newUser)
//     } catch (error: any) {
//         if (error && error?.code === 409) {
//             const documents = await users.list([
//                 Query.equal('email', [user.email])
//             ])

//             return documents?.users[0]
//         }
//         console.error("An error occurred while creating a new user:", error);

//     }
// }


export const createUser = async (user: CreateUserParams) => {
    try {
        // Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
        const newUser = await users.create(
            ID.unique(),
            user.email,
            user.phone,
            undefined,
            user.name
        );

        return parseStringify(newUser);
    } catch (error: any) {
        // Check existing user
        if (error && error?.code === 409) {
            const existingUser = await users.list([
                Query.equal("email", [user.email]),
            ]);

            return existingUser.users[0];
        }
        console.error("An error occurred while creating a new user:", error);
    }
};