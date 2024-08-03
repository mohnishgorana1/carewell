"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { PatientFormValidation, UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser, registerPatient } from "@/lib/actions/patient.actions"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import { Label } from "../ui/label"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import FileUploader from "../FileUploader"


export enum FormFieldTypes {
    INPUT = 'input',
    CHECKBOX = 'checkbox',
    TEXTAREA = 'textarea',
    PHONE_INPUT = 'phoneInput',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton'
}



export default function RegisterForm({ user }: { user: User }) {
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation),
        defaultValues: {
            ...PatientFormDefaultValues,
            name: "",
            email: "",
            phone: ""
        },
    })


    async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
        console.log("Submitted values", values)

        setIsLoading(true)
        
        let formData;

        // first read file : BLOB (special version of file which browser can read)
        if(values.identificationDocument && values.identificationDocument.length > 0){
          
            const blobFile = new Blob([values.identificationDocument[0]], {
                type: values.identificationDocument[0].type
            })

            formData = new FormData()
            formData.append('blobFile', blobFile)
            formData.append('fileName', values.identificationDocument[0].name)
        }

        try {
            const patientData = {
                ...values,
                userId: user.$id,
                birthDate: new Date(values.birthDate),
                identificationDocument: formData,

            }

            console.log("patientData", patientData);
            
            // @ts-ignore
            const patient = await registerPatient(patientData)
            if(patient){
                router.push(`/patients/${user.$id}/new-appointment`)
            }
            
        } catch (error) {
            console.log(error)
        }
        setIsLoading(false)


    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">

                {/* heading */}
                <section className="space-y-4">
                    <h1 className="header">Welcome 👋</h1>
                    <p className="text-dark-700">Let us know more about yourself.</p>
                </section>


                {/* Personal Information. */}
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Personal Information.</h2>
                    </div>
                </section>
                <CustomFormField
                    control={form.control}
                    fieldType={FormFieldTypes.INPUT}
                    name="name"
                    label="Full Name"
                    placeholder="Mohnish"
                    iconSrc='/assets/icons/user.svg'
                    iconAlt="user"
                />
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldTypes.INPUT}
                        name="email"
                        label="Email"
                        placeholder="mohnish@gmail.com"
                        iconSrc='/assets/icons/email.svg'
                        iconAlt="email"
                    />
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldTypes.PHONE_INPUT}
                        name="phone"
                        label="Phone Number"
                        placeholder="9198xxxxxx"
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row xl:items-center">
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldTypes.DATE_PICKER}
                        name="birthDate"
                        label="Date of Birth"
                    />
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldTypes.SKELETON}
                        name="gender"
                        label="Gender"
                        renderSkeleton={(field) => (
                            <FormControl>
                                <RadioGroup
                                    className="flex h-11 xl:h-14 gap-6 xl:justify-between"
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    {GenderOptions.map((gender, i) => (
                                        <div key={i} className="radio-group">
                                            <RadioGroupItem value={gender} id={gender} />
                                            <Label htmlFor={gender} className="cursor-pointer">{gender}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        )}
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldTypes.INPUT}
                        name="address"
                        label="Address"
                        placeholder="Enter your Address"
                    />
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldTypes.INPUT}
                        name="occupation"
                        label="Occupation"
                        placeholder="Enter your Occupation"
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldTypes.INPUT}
                        name="emergencyContactName"
                        label="Emergency Contact Name"
                        placeholder="Guardian's Name"
                    />
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldTypes.PHONE_INPUT}
                        name="emergencyContactNumber"
                        label="Emergency Contact Number"
                    />
                </div>



                {/* Medical Information */}
                <section className="space-y-4 pt-12">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Medical Information.</h2>
                    </div>
                </section>
                <div className="flex flex-col gap-5 xl:flex-row">
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldTypes.SELECT}
                        name="primaryPhysician"
                        label="Primary Physician"
                        placeholder="Select a Physician"
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
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldTypes.INPUT}
                        name="insuranceProvider"
                        label="Insurance Provider"
                        placeholder="SBI Life Insurance"
                    />
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldTypes.INPUT}
                        name="insurancePolicyNumber"
                        label="Insurance Policy Number"
                        placeholder="SBI9458xx223"

                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldTypes.TEXTAREA}
                        name="allergies"
                        label="Allergies"
                        placeholder="Peanuts, Milk, etc"
                    />
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldTypes.TEXTAREA}
                        name="currentMedication"
                        label="Current medication (if any)"
                        placeholder="Ibuprofen 200mg, Paracetamol 500mg, ..."

                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldTypes.TEXTAREA}
                        name="familyMedicalHistory"
                        label="Family Medical History"
                        placeholder="GrandFather had Heart-Attack,"
                    />
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldTypes.TEXTAREA}
                        name="pastMedicalHistory"
                        label="Past Medical History"
                        placeholder="Appendectomy, Tonsillectomy"
                    />
                </div>



                {/* Identification and Verification */}
                <section className="space-y-6 pt-8">
                    <div className="space-y-1">
                        <h2 className="sub-header">Identification and Verification</h2>
                    </div>
                </section>
                <CustomFormField
                    fieldType={FormFieldTypes.SELECT}
                    control={form.control}
                    name="identificationType"
                    label="Identification Type"
                    placeholder="Select identification type"
                >
                    {IdentificationTypes.map((type, i) => (
                        <SelectItem 
                            key={type + i} 
                            value={type}
                            className="hover:bg-dark-500"
                        >
                            {type}
                        </SelectItem>
                    ))}
                </CustomFormField>
                <CustomFormField
                    control={form.control}
                    fieldType={FormFieldTypes.INPUT}
                    name="identificationNumber"
                    label="Identification Number"
                    placeholder="ex 14756674"
                />
                <CustomFormField
                    control={form.control}
                    fieldType={FormFieldTypes.SKELETON}
                    name="identificationDocument"
                    label="Scanned Copy of Identification Document"
                    renderSkeleton={(field) => (
                        <FormControl>
                            <FileUploader
                                files={field.value}
                                onChange={field.onChange}
                            />
                        </FormControl>
                    )}
                />

                {/* Consent and Privacy */}
                <section className="space-y-6 pt-8">
                    <div className="space-y-1">
                        <h2 className="sub-header">Consent and Privacy</h2>
                    </div>
                </section>
                <CustomFormField
                    fieldType={FormFieldTypes.CHECKBOX}
                    control={form.control}
                    name="treatmentConsent"
                    label="I consent to treatment"
                />

                <CustomFormField
                    fieldType={FormFieldTypes.CHECKBOX}
                    control={form.control}
                    name="disclosureConsent"
                    label="I consent to Disclosure of information"
                />

                <CustomFormField
                    fieldType={FormFieldTypes.CHECKBOX}
                    control={form.control}
                    name="privacyConsent"
                    label="I consent to privacy policy"
                />


                <SubmitButton isLoading={isLoading}>Submit</SubmitButton>
            </form>
        </Form>
    )
}
