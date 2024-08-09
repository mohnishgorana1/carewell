"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
} from "@/components/ui/form"

import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { getAppointmentSchema } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { Appointment, Patient } from "@/types/appwrite.types"
import { SelectItem } from "../ui/select"
import { Doctors } from "@/constants"
import Image from "next/image"
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions"



export enum FormFieldTypes {
    INPUT = 'input',
    CHECKBOX = 'checkbox',
    TEXTAREA = 'textarea',
    PHONE_INPUT = 'phoneInput',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton'
}



export default function AppointmentForm({ userId, patientId, type, appointment, setOpen }: {
    userId: string,
    patientId: string,
    type: "create" | "cancel" | "schedule",
    appointment?: Appointment,
    setOpen?: (open: boolean) => void
}) {
    console.log("PROPS", { userId, patientId, type, appointment });

    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)


    const AppointmentFormValidation = getAppointmentSchema(type)

    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
        resolver: zodResolver(AppointmentFormValidation),
        defaultValues: {
            primaryPhysician: appointment ? appointment.primaryPhysician : "",
            schedule: appointment ? new Date(appointment?.schedule) : new Date(Date.now()),
            reason: appointment ? appointment.reason : "",
            note: appointment?.note || "",
            cancellationReason: appointment?.cancellationReason || "",
        },
    })


    async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
        setIsLoading(true)

        console.log("Submitted values", values, { type })

        let status;
        switch (type) {
            case 'schedule':
                status = 'scheduled'
                break;
            case 'cancel':
                status = 'cancelled'
                break;
            default:
                status = 'pending'
                break;
        }

        try {
            if (type === "create" && patientId) {
                console.log("Creating new appointment");

                const appointment = {
                    userId,
                    patient: patientId,
                    primaryPhysician: values.primaryPhysician,
                    schedule: new Date(values.schedule),
                    reason: values.reason!,
                    status: status as Status,
                    note: values.note,
                };

                const newAppointment = await createAppointment(appointment);

                if (newAppointment) {
                    console.log("new Appointment created");

                    form.reset();
                    router.push(
                        `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`
                    );
                }
            } else {
                console.log("Updating Appointment", appointment);

                const appointmentToUpdate = {
                    userId,
                    patientId,
                    appointmentId: appointment?.$id!,
                    appointment: {
                        primaryPhysician: values.primaryPhysician,
                        schedule: new Date(values?.schedule),
                        status: status as Status,
                        cancellationReason: values?.cancellationReason
                    },
                    type
                }

                console.log("appointmentToUpdate", appointmentToUpdate);
                const updatedAppointment = await updateAppointment(appointmentToUpdate)

                if (updatedAppointment) {
                    console.log("updatedAppointment", updatedAppointment);
                    setOpen && setOpen(false)
                    form.reset()
                }
            }

        } catch (error) {
            console.log(error)
        }

        setIsLoading(false)

    }


    let buttonLabel;
    switch (type) {
        case "cancel":
            buttonLabel = "Cancel Appointment"
            break;
        case "create":
            buttonLabel = "Create Appointment"
            break;
        case 'schedule':
            buttonLabel = "Schedule Appointment"
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">

                {/* heading */}
                {type === "create" &&
                    <section className="space-y-4">
                        <h1 className="header">Hey There 👋</h1>
                        <p className="text-dark-700">Request a new Appointment in 10 seconds.</p>
                    </section>
                }

                {
                    type !== "cancel" && (
                        <>
                            <CustomFormField
                                control={form.control}
                                fieldType={FormFieldTypes.SELECT}
                                name="primaryPhysician"
                                label="Doctor"
                                placeholder="Select a Doctor"
                            >
                                {Doctors.map((doctor) => (
                                    <SelectItem
                                        key={doctor.name}
                                        value={doctor.name}
                                        className="hover:bg-dark-500"
                                    >
                                        <div className="flex cursor-pointer items-center gap-2">
                                            <Image
                                                src={doctor.image}
                                                width={32}
                                                height={32}
                                                alt={doctor.name}
                                                className='rounded-full border border-dark-500'
                                            />
                                            <p>{doctor.name}</p>
                                        </div>
                                    </SelectItem>
                                ))}
                            </CustomFormField>
                            <CustomFormField
                                control={form.control}
                                fieldType={FormFieldTypes.DATE_PICKER}
                                name="schedule"
                                label="Expected Appointment Date"
                                placeholder="Select your Appointment Date"
                                showTimeSelect
                                dateFormat="dd/MM/yyyy -h:mm aa"
                            />
                            <div className={`flex flex-col gap-6  ${type === "create" && "xl:flex-row"}`}>
                                <CustomFormField
                                    control={form.control}
                                    fieldType={FormFieldTypes.TEXTAREA}
                                    name="reason"
                                    label="Reason for Appointment"
                                    placeholder="ex: Annual Monthly Checkup"
                                />
                                <CustomFormField
                                    control={form.control}
                                    fieldType={FormFieldTypes.TEXTAREA}
                                    name="note"
                                    label="Additional comments/notes"
                                    placeholder="ex: After Appointments if possible!"

                                />
                            </div>

                        </>
                    )
                }

                {
                    type === "cancel" && (
                        <CustomFormField
                            control={form.control}
                            fieldType={FormFieldTypes.TEXTAREA}
                            name="cancellationReason"
                            label="Reason for Cancellation"
                            placeholder="Enter reason for cancellation"
                        />
                    )
                }

                <SubmitButton
                    isLoading={isLoading}
                    classNames={`w-full ${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"}`}
                >
                    {buttonLabel}
                </SubmitButton>
            </form>
        </Form>
    )
}

