'use server';

import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import { databases, APPOINTMENT_COLLECTION_ID, DATABASE_ID, messaging } from "../appwrite.config";
import { error } from "console";
import { revalidatePath } from "next/cache";
import { formatDateTime } from "../utils";

export const createAppointment = async (appointment: CreateAppointmentParams) => {
    try {
        const newAppointment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointment
        )

        return parseStringify(newAppointment)
    } catch (error) {
        console.log(error);

    }

}

export const getAppointment = async (appointmentId: string) => {
    try {
        const appointment = await databases.getDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId
        );
        return parseStringify(appointment)
    } catch (error) {
        console.log(error);

    }
}

export const getRecentAppointments = async () => {
    try {
        const appointments = await databases.listDocuments(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            [
                Query.orderDesc('$createdAt')
            ]
        );

        const initialCount = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0
        }

        const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
            switch (appointment.status) {
                case "scheduled":
                    acc.scheduledCount++;
                    break;
                case "pending":
                    acc.pendingCount++;
                    break;
                case "cancelled":
                    acc.cancelledCount++;
                    break;
            }
            return acc
        },
            initialCount
        );

        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents
        }

        return parseStringify(data)
    }
    catch (error) {
        console.log(error);

    }
}

export const updateAppointment = async ({
    appointmentId,
    userId,
    appointment,
    type
}: UpdateAppointmentParams) => {

    try {
        const updateAppointment = await databases.updateDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId,
            appointment
        )

        if (!updateAppointment) {
            throw new Error("Appointment not found")
        }
        // SMS PART 
        const smsMessage = `
        Hi, it's MediCare
        ${type === 'schedule' ?
                `Your appointment is confirmed for ${formatDateTime(appointment.schedule!).dateTime} with ${appointment.primaryPhysician}`
                :
                `We regret to inform that your appointment for ${formatDateTime(appointment.schedule!).dateTime} is cancelled. Reason:  ${appointment.cancellationReason}`
            }
        `
        await sendSMSNotification(userId, smsMessage)
        revalidatePath('/admin')

        return parseStringify(updateAppointment)

    } catch (error) {
        console.log(error);

    }

}

export const sendSMSNotification = async (userId: string, content: string) => {
    try {
        const sendMessage = await messaging.createSms(
            ID.unique(),
            content,
            [],
            [userId]
        );

        return parseStringify(sendMessage)
    } catch (error) {
        console.log(error);

    }
}