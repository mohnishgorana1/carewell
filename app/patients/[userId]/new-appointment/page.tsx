'use client'
import AppointmentForm from '@/components/forms/AppointmentForm'
import { getPatient, getUser } from '@/lib/actions/patient.actions'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'


function NewAppointmentPage({ params: { userId } }: SearchParamProps) {
    console.log("userId", userId);
    const [patient, setPatient] = useState(null);



    const getPatientDetails = async (userId: string) => {
        const patientData = await getPatient(userId);
        console.log("patient", patient);

        setPatient(patientData)

    }

    useEffect(() => {
        getPatientDetails(String(userId))
    }, [userId])


    return (
        <div className="flex h-screen max-h-screen">
            {
                patient && (
                    <>
                        <section className="remove-scrollbar container ">
                            <div className="max-w-[860px] size-full mx-auto flex flex-1 flex-col py-10">
                                <Image
                                    src='/assets/icons/logo-full.svg'
                                    height={1000}
                                    width={1000}
                                    alt="patient"
                                    className="mb-12 h-10 w-fit"
                                />
                                <AppointmentForm
                                    type='create'
                                    userId={userId}
                                    patientId={String(patient?.$id)}
                                />
                                {/* <p>{userId}</p>
                        <p>{patient?.$id}</p> */}

                                <p className="justify-items-end text-dark-600 xl:text-left mt-12 pb-12 self-center">
                                    &copy; 2024 CareWell
                                </p>

                            </div>
                        </section>
                        <Image src={'/assets/images/appointment-img.png'}
                            height={1000}
                            width={1000}
                            alt="patient"
                            className="side-img max-w-[390px]"
                        />
                    </>
                )
            }
        </div >
    )

}

export default NewAppointmentPage