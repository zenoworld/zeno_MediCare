import AppointmentForm from "@/components/forms/AppointmentForm";
import Image from "next/image";
import { getPatient } from "@/lib/actions/patient.actions";

export default async function NewAppointment({ params: { userId } }: SearchParamProps) {

  const patient = getPatient(userId)

  return (
    <div className="h-screen max-h-screen flex">
      <section className="remove-scrollbar container my-auto ">

        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src='/assets/icons/logo.png'
            width={1000}
            height={1000}
            alt="icon"
            className="h-14 w-fit mb-10"
          />

          <AppointmentForm
            type='create'
            userId={userId}
            patientId={userId}
          />

          <p className="copyright mt-10">© 2025 | MediCare</p>

        </div>
      </section>

      <Image
        src='/assets/images/appointment-img.png'
        width={1000}
        height={1000}
        alt="apointment"
        className="max-w-[390px] side-img bg-bottom"
      />
    </div>
  );
}

