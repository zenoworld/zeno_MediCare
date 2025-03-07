import PatientForm from "@/components/forms/PatientForm";
import PassKeyModal from "@/components/PassKeyModal";
import Image from "next/image";
import Link from "next/link";

export default function  Home ({searchParams}:SearchParamProps) {
  const isAdmin =  searchParams?.admin === 'true'

  return (
    <div className="h-screen max-h-screen flex">
      {isAdmin && <PassKeyModal/>}

      <section className="remove-scrollbar container my-auto ">

        <div className="sub-container max-w-[490px]">
          <Image
            src='/assets/icons/logo.png'
            width={1000}
            height={1000}
            alt="icon"
            className="h-14 w-fit mb-10"
          />


          <PatientForm />

          <div className="flex justify-between mt-20 text-14-regular">
            <p className="justify-items-end text-dark-600 xl:text-left">© 2025 | MediCare</p>

            <Link href='/?admin=true' className="text-green-500">
              Admin
            </Link>
          </div>
        </div>

      </section>

      <Image
      src='/assets/images/onboarding-img.png'
      width={1000}
      height={1000}
      alt="patient"
      className="max-w-[50%] side-img"
      />
    </div>
  );
}

