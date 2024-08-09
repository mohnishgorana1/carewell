'use server'

import { ID, Query } from "node-appwrite"
import { APPOINTMENTS_COLLECTION_ID, DATABASE_ID, databases } from "../appwrite.config"
import { parseStringify } from "../utils"
import { Appointment } from "@/types/appwrite.types"
import { revalidatePath } from "next/cache"

export const createAppointment = async (appointment: CreateAppointmentParams) => {
    try {
        console.log("creating new Appointment ");

        const newAppointment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENTS_COLLECTION_ID!,
            ID.unique(),
            appointment
        )
        console.log("new Appointment created");

        return parseStringify(newAppointment)

    } catch (error) {
        console.log("Error creating appointment", error);

    }
}

export const getAppointment = async (appointmentId: string) => {
    try {
        const appointment = await databases.getDocument(
            DATABASE_ID!,
            APPOINTMENTS_COLLECTION_ID!,
            appointmentId,
        )

        return parseStringify(appointment)
    } catch (error) {
        console.log(error);

    }
}


export const getRecentAppointmentList = async () => {
    try {
        console.log("We got into this");

        const appointments = await databases.listDocuments(
            DATABASE_ID!,
            APPOINTMENTS_COLLECTION_ID!,
            [
                Query.orderDesc('$createdAt')
            ]
        );

        console.log("appointments list", appointments);


        const initialCounts = {
            scheduledCounts: 0,
            pendingCounts: 0,
            cancelledCounts: 0
        }

        const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
            if (appointment.status === "scheduled") {
                acc.scheduledCounts += 1
            } else if (appointment.status == "pending") {
                acc.pendingCounts += 1
            } else if (appointment.status == "cancelled") {
                acc.cancelledCounts += 1
            }

            return acc;
        }, initialCounts);

        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents
        }
        console.log("DATA", data)
        return parseStringify(data)
    } catch (error) {
        console.log("Error fetching appointments", error);
    }
}


export const updateAppointment = async ({ appointmentId, userId, appointment, type }: UpdateAppointmentParams) => {
    try {
        console.log("updating appointment", { appointment, appointmentId, type })
        const updatedAppointment = await databases.updateDocument(
            DATABASE_ID!,
            APPOINTMENTS_COLLECTION_ID!,
            appointmentId,
            appointment
        )
        if (!updateAppointment) {
            throw new Error("Appointment not found to update in our database")
        }
        else{
            console.log("Appointment updated ", updatedAppointment);
            
        }
        //TODO  SMS Confirmation
        revalidatePath('/admin')
        return parseStringify(updatedAppointment)
    } catch (error) {
        console.log("Error in Update Appointment", error);

    }
}
