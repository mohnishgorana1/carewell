'use server'

import { ID, Query } from "node-appwrite"
import { InputFile } from "node-appwrite/file"

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

export const createUser = async (user: CreateUserParams) => {
    try {
        // Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
        console.log("creating new USER: ", user);

        const newUser = await users.create(
            ID.unique(),
            user.email,
            user.phone,
            undefined,  //password (optional)_
            user.name    // name optional
        );
        console.log("new USer created", newUser);

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

export const getUser = async (userId: string) => {
    try {
        console.log("Finding user", userId);

        const user = await users.get(userId)
        console.log("returning user", user);

        return parseStringify(user)
    } catch (error) {
        console.log(error);

    }
}


export const registerPatient = async ({ identificationDocument, ...patient }: RegisterUserParams) => {
    try {
        console.log("Registering patient");
        
        let file;
        if (identificationDocument) {
            const inputFile = InputFile.fromBuffer(
                identificationDocument?.get('blobFile') as Blob,
                identificationDocument?.get('fileName') as string
            )
            // upload/create file using appwrite fn
            file = await storage.createFile(
                NEXT_PUBLIC_BUCKET_ID!, // bucketId
                ID.unique(), // fileId
                inputFile
            );
        }
        console.log("File Uploaded");

        const newPatient = await databases.createDocument(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            ID.unique(),
            {
                identificationDocumentId: file?.$id || null,
                identificationDocumentUrl: `${NEXT_PUBLIC_ENDPOINT}/storage/buckets/${NEXT_PUBLIC_BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}}`,
                ...patient
            }  // this is data
        )
        console.log("NEW PATIENT CREATED", newPatient);

        return parseStringify(newPatient)
    } catch (error) {
        console.log("Error Registering Patient", error)
    }
}


export const getPatient = async (userId: string) => {
    try {
        console.log("Finding patient for userID = ", userId);

        const patient = await databases.listDocuments(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            [Query.equal("userId", [userId])]
        )
        console.log("patient", patient.documents[0]);

        return parseStringify(patient.documents[0])
    } catch (error) {
        console.log(error);

    }
}