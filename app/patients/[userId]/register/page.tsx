import RegisterForm from '@/components/forms/RegisterForm'
import { getUser } from '@/lib/actions/patient.actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { getPatient } from "@/lib/actions/patient.actions";
import { redirect } from "next/navigation";

async function Register ({ params: { userId } }: SearchParamProps) {
    const user = await getUser(userId)
    
    // const patient = await getPatient(userId);
    return (
        <div className="flex h-screen max-h-screen">
            <section className="remove-scrollbar container ">
                
                <div className="max-w-[860px] size-full mx-auto flex flex-1 flex-col py-10">
                    <Image
                        src='/assets/icons/logo-full.svg'
                        height={1000}
                        width={1000}
                        alt="patient"
                        className="mb-12 h-10 w-fit"
                    />

                    <RegisterForm user={user} />

                    <p className="justify-items-end text-dark-600 xl:text-left mt-12 pb-12 self-center">
                        &copy; 2024 CareWell
                    </p>
                    <p>{userId}</p>
                </div>
            </section>
            <Image src={'/assets/images/register-img.png'}
                height={1000}
                width={1000}
                alt="patient"
                className="side-img max-w-[390px]"
            />
        </div>
    )
}

export default Register