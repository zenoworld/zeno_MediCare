import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import RegisterForm from '@/components/forms/RegisterForm'
import { getUser } from '@/lib/actions/patient.actions'



const Register = async ({ params: { userId } }: SearchParamProps) => {

    const user = await getUser(userId)

    if (!user) {
        return <div className="flex justify-center items-center h-screen">User not found</div>;
    }


    return (
        <div className="h-screen max-h-screen flex">
            <section className="remove-scrollbar container ">

                <div className="sub-container max-w-[800px] flex-1 flex-col py-10">
                    <Image
                        src='/assets/icons/logo.png'
                        width={1000}
                        height={1000}
                        alt="icon"
                        className="h-14 w-fit mb-10"
                    />


                    <RegisterForm user={user} />

                    <p
                        className="copyright py-12"
                    >
                        © 2025 | MediCare
                    </p>

                </div>

            </section>

            <Image
                src='/assets/images/register-img.png'
                width={1000}
                height={1000}
                alt="patient"
                className="max-w-[390px] side-img"
            />
        </div>
    )
}

export default Register