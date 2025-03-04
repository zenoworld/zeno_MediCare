import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getAppointment } from '@/lib/actions/appointment.actions'
import { Doctors } from '@/constants'
import { formatDateTime } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const Success = async ({ params: { userId }, searchParams }: SearchParamProps) => {

    const appointmentId = (searchParams?.appointmentId as string) || ''
    const appointment = await getAppointment(appointmentId)
    const doctor = Doctors.find(
        (doc) => doc.name === appointment.primaryPhysician
    )

    return (
        <div className='flex h-screen max-h-screen px-[5%]'>
            <div className='success-img'>
                <Link href="/">
                    <Image
                        src="/assets/icons/logo-full.svg"
                        alt='logo'
                        height={1000}
                        width={1000}
                        className='h-10 w-fit'
                    />
                </Link>

                <section className='flex flex-col items-center'>
                    <Image
                        src="/assets/gifs/success.gif"
                        alt='success'
                        height={300}
                        width={300}
                    />

                    <h2 className='header text-xl max-w-[600px] mb-6 text-center'>
                        Your <span className='text-green-500'>appointment request</span> has been successfully submitted!
                    </h2>
                    <p>we will contact with you shortly for confirmation.</p>
                </section>

                <section className='request-details'>
                    <p>Requested Appointment Details : </p>
                    <div className='flex items-center gap-3'>
                        <Image
                            src={doctor?.image || '/assets/images/dr-green.png'}
                            alt='doctor'
                            width={100}
                            height={100}
                            className="size-6"
                        />
                        <p className='whitespace-nowrap'>Dr.{appointment.primaryPhysician}</p>
                    </div>
                    <div className='flex gap-2'>
                        <Image
                            src="/assets/icons/calendar.svg"
                            height={24}
                            width={24}
                            alt='calendar'
                        />
                        <p>{formatDateTime(appointment.schedule).dateTime}</p>
                    </div>
                </section>

                <Button variant="outline" className='shad-primary-btn' asChild>
                    <Link href={`/patients/${userId}/new-appointment`}>
                        New Appointment
                    </Link>
                </Button>

                <p className="copyright">© 2025 | MediCare</p>
            </div>
        </div>
    )
}

export default Success