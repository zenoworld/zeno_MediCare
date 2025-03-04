"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Form } from "@/components/ui/form"
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { useRouter } from "next/navigation";

import { UserFormValidation } from "@/lib/validation"
import { createUser } from "@/lib/actions/patient.actions"
import SubmitButton from "../SubmitButton"

const PatientForm = () => {

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)


  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: ""
    },
  })

  // const onSubmit = async (data: z.infer<typeof UserFormValidation>) => {
  //   console.log("Form submitted with data:", data);
  //   setIsLoading(true);

  //   try {
  //     const userData = {
  //       name: data.name,
  //       email: data.email,
  //       phone: data.phone,
  //     };
  //     const newUser = await createUser(userData);

  //     console.log("Response from createUser:", newUser);

  //     if (newUser?.$id) {
  //       router.push(`/patients/${newUser.$id}/register`);
  //     }
  //   }
  //   catch (error) {
  //     console.error("Error in patient registration:", error);
  //   }
  //   finally {
  //     setIsLoading(false);
  //   }

  // };

  const onSubmit = async (data: z.infer<typeof UserFormValidation>) => {
    console.log("Form submitted with data:", data);
    setIsLoading(true);

    try {
      const response = await fetch("https://cloud.appwrite.io/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Project": "67be0ca4003de07d78d0",
          "X-Appwrite-Key": "standard_679b0c3d69d995074a28dbe1bfd509acd03efb1ee6812a265b0bb354fc6bf5c74d8296634702f461035ccf7bacb78ef3c5c5dc7e3bf1a1db224fd89f88072cafef0b63040c40acfbb4b9dc3dab825b7d378d6c5dcb964d2c2baba4b47c2ea30caeca0b4a36adf6c7e7f38cb03e088f8b6d2e70997655da53291f7e3e3838cd99"
        },
        body: JSON.stringify({
          userId: "unique()",
          name: data.name,
          email: data.email,
          password: "Test@123",
          phone: data.phone
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "User creation failed.");
      }

      console.log("User created:", result);

      router.push(`/patients/${result.$id}/register`);

    } catch (error: any) {
      console.error("Error in patient registration:", error);
     
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        <section className="mb-12 space-y-3">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Get started with appointments.</p>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          placeholder="subhro"
          label="Full name"
          iconSrc='/assets/icons/user.svg'
          iconAlt="user"
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          placeholder="subhromajumder52@gmail.com"
          label="Email"
          iconSrc='/assets/icons/email.svg'
          iconAlt="email"
        />

        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          placeholder="(+91) 00000000"
          label="Phone Number"
        />

        <SubmitButton isLoading={isLoading} >Get Started</SubmitButton>
      </form>
    </Form>
  )
}

export default PatientForm