"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Form } from "@/components/ui/form"
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { useRouter } from "next/navigation";
import SubmitButton from "../SubmitButton"

import { Doctors } from "@/constants"
import Image from "next/image"
import { SelectItem } from "../ui/select"
import { getAppointmentSchema } from "@/lib/validation"
import { createAppointment } from "@/lib/actions/appointment.actions"
import { Appointment } from "@/types/appwrite.types"
import { updateAppointment } from "@/lib/actions/appointment.actions"

const AppointmentForm = (
    {
        userId,
        patientId,
        type,
        appointment,
        setOpen
    }
        :
        {
            userId: string;
            patientId: string;
            type: "create" | "cancel" | "schedule";
            appointment: Appointment;
            setOpen: (open: boolean) => void
        }
) => {

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const AppointmentFormValidation = getAppointmentSchema(type);

    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
        resolver: zodResolver(AppointmentFormValidation),
        defaultValues: {
            primaryPhysician: appointment ? appointment.primaryPhysician : 'DR. SMITH',
            reason: appointment?.reason || '',
            schedule: appointment ? new Date(appointment?.schedule!) : new Date(Date.now()),
            note: appointment?.note || '',
            cancellationReason: appointment?.cancellationReason! || ""
        },
    })

    const onSubmit = async (values: z.infer<typeof AppointmentFormValidation>) => {
        setIsLoading(true);

        let status;
        switch (type) {
            case "schedule":
                status = "scheduled"
                break;
            case "cancel":
                status = "cancelled"
                break;
            default:
                status = "pending";
        }

        try {
            if (type === 'create' && patientId) {
                console.log("inside appointment create");

                const appointmentData = {
                    userId,
                    patient: patientId,
                    primaryPhysician: values.primaryPhysician,
                    schedule: new Date(values.schedule),
                    reason: values.reason!,
                    note: values.note,
                    status: status as Status
                }
                console.log(appointmentData);

                const newAppointment = await createAppointment(appointmentData)

                if (newAppointment) {
                    form.reset()
                    router.push(`/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`)
                }
            }
            else {
                const appointmentToUpdate = {
                    userId,
                    appointmentId: appointment?.$id!,
                    appointment: {
                        primaryPhysician: values?.primaryPhysician,
                        schedule: new Date(values?.schedule),
                        status: status as Status,
                        cancellationReason: values?.cancellationReason
                    },
                    type
                }

                const updatedAppointment = await updateAppointment(appointmentToUpdate)

                if (updatedAppointment) {
                    setOpen && setOpen(false);
                    form.reset();
                }
            }

        } catch (error: any) {
            console.error("Error in patient registration:", error);

        } finally {
            setIsLoading(false);
        }
    };

    let buttonLabel;
    switch (type) {
        case "cancel":
            buttonLabel = "Cancel Appointment"
            break;
        case "create":
            buttonLabel = "Create Appointment"
            break;
        case "schedule":
            buttonLabel = "Schedule Appointment"
            break;

        default:
            break;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {
                    type === 'create' &&
                    <section className="mb-12 space-y-3">
                        <h1 className="header">New Appointment</h1>
                        <p className="text-dark-700">Request a new Appointment in 10 seconds. </p>
                    </section>
                }


                {
                    type !== "cancel" && (
                        <>
                            <CustomFormField
                                fieldType={FormFieldType.SELECT}
                                control={form.control}
                                name="primaryPhysician"
                                label="Doctor"
                                placeholder="Select a doctor"
                            >
                                {Doctors.map((doctor, i) => (
                                    <SelectItem key={doctor.name + i} value={doctor.name}>
                                        <div className="flex cursor-pointer items-center gap-2">
                                            <Image
                                                src={doctor.image}
                                                width={32}
                                                height={32}
                                                alt="doctor"
                                                className="rounded-full border border-dark-500"
                                            />
                                            <p>{doctor.name}</p>
                                        </div>
                                    </SelectItem>
                                ))}
                            </CustomFormField>

                            <div className="flex flex-col xl:flex-row justify-between gap-4">
                                <CustomFormField
                                    fieldType={FormFieldType.TEXTAREA}
                                    control={form.control}
                                    name="reason"
                                    placeholder="ex : Annual or monthly check up"
                                    label="Reason for Appointment"
                                />
                                <CustomFormField
                                    fieldType={FormFieldType.TEXTAREA}
                                    control={form.control}
                                    name="note"
                                    placeholder="ex: Prefer afternoon appointment"
                                    label="Additional comments/notes"
                                />
                            </div>

                            <CustomFormField
                                fieldType={FormFieldType.DATE_PICKER}
                                control={form.control}
                                name="schedule"
                                label="Select your Appointment Date"
                                placeholder="select the Date"
                                showTimeSelect
                                dateFormat="MM/dd/yyyy - h:mm aa"
                            />
                        </>
                    )
                }

                {
                    type === 'cancel' && (
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="cancellationReason"
                            placeholder="give reason for cancellation"
                            label="Reason for Cancellation"
                        />
                    )
                }

                <SubmitButton isLoading={isLoading} className={`${type === "cancel" ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`} >{buttonLabel}</SubmitButton>
            </form>
        </Form>
    )
}

export default AppointmentForm