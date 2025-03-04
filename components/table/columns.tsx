"use client"

import { Button } from "@/components/ui/button"

import { MoreHorizontal } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { Appointment } from "@/types/appwrite.types"
import StatusBadge from "../StatusBadge"
import { formatDateTime } from "@/lib/utils"
import { Doctors } from "@/constants"
import Image from "next/image"
import AppointmentModal from "../AppointmentModal"



export const columns: ColumnDef<Appointment>[] = [
  {
    header: 'ID',
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>
  },
  {
    accessorKey: 'patients',
    header: 'Patient',
    cell: ({ row }) => {
      return <p className="text-14-medium">{row.original.patient.name}</p>
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) =>
      <div className="min-w-[114px]">
        <StatusBadge status={row.original.status} />
      </div>
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) =>
      <p className="text-14-regular min-w-[100px]">
        {formatDateTime(row.original.schedule).dateTime}
      </p>
  },
  {
    accessorKey: "primaryPhysician",
    header: 'Doctor',
    cell: ({ row }) => {
      const doctor = Doctors.find((doc) => doc.name === row.original.primaryPhysician)

      return (
        <div className="flex items-center gap-3">
          <Image
            src={doctor?.image || '/assets/images/dr-green.png'}
            alt={doctor?.name || 'docImg'}
            width={100}
            height={100}
            className="size-8"
          />

          <p className="whitespace-normal">{doctor?.name || row.original.primaryPhysician}</p>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
      const appointment = row.original

      return (
        <div className="flex gap-1">
          <AppointmentModal
            type="schedule"
            patientId = {appointment.patient.$id}
            userId ={appointment.userId}
            appointment={appointment}
            // title="Schedule Appointment"
            // description="Please confirm the following details to schedule."
          />
          <AppointmentModal
            type="cancel"
            patientId = {appointment.patient.$id}
            userId ={appointment.userId}
            appointment={appointment}
            // title="Cancel Appointment"
            // description="Are you sure you want to cancel your appointment?"
          />
          
        </div>
      )
    },
  },
]
