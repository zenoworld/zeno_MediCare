import React from 'react'
import { Control } from 'react-hook-form'

import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from 'next/image'
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { Checkbox } from './ui/checkbox'
import { Label } from './ui/label'

export enum FormFieldType {
    INPUT = "input",
    TEXTAREA = "textArea",
    PHONE_INPUT = "phoneInput",
    CHECKBOX = "checkbox",
    DATE_PICKER = "datePicker",
    SELECT = "select",
    SKELETON = "skeleton",
}
interface CustomProps {
    control: Control<any>,
    fieldType: FormFieldType,
    name: string,
    placeholder?: string;
    label?: string,
    iconSrc?: string,
    iconAlt?: string,
    disabled?: boolean;
    dateFormat?: string;
    showTimeSelect?: boolean;
    children?: React.ReactNode;
    renderSkeleton?: (field: any) => React.ReactNode;
}

const RenderElement = ({ field, props }: { field: any; props: CustomProps }) => {

    switch (props.fieldType) {

        case FormFieldType.INPUT:
            return (
                <div className='flex rounded-md border border-dark-500 bg-dark-400'>
                    {
                        props.iconSrc && (
                            <Image
                                src={props.iconSrc}
                                alt={props.iconAlt || 'icon'}
                                height={24}
                                width={24}
                                className='ml-2'
                            />
                        )
                    }
                    <FormControl>
                        <Input
                            placeholder={props.placeholder}
                            {...field}
                            className='shad-input border-0'
                        />
                    </FormControl>
                </div>
            );

        case FormFieldType.PHONE_INPUT:
            return (
                <FormControl>
                    <PhoneInput
                        defaultCountry="IN"
                        placeholder={props.placeholder}
                        international
                        withCountryCallingCode
                        value={field.value || undefined}
                        onChange={field.onChange}
                        className="input-phone"
                    />
                </FormControl>
            );

        case FormFieldType.DATE_PICKER:
            return (
                <div className='flex rounded-md border border-dark-500 bg-dark-400'>
                    <Image
                        src="/assets/icons/calendar.svg"
                        alt='calender'
                        height={24}
                        width={24}
                        className='ml-2'
                    />
                    <FormControl>
                        <DatePicker
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            dateFormat={props.dateFormat ?? 'MM/dd/yyyy'}
                            showTimeSelect={props.showTimeSelect ?? false}
                            timeInputLabel='Time : '
                            wrapperClassName='date-picker'
                        />
                    </FormControl>
                </div>
            );

        case FormFieldType.SELECT:
            return (
                <FormControl>
                    <Select
                        onValueChange={field.change}
                        defaultValue={field.value}
                    >
                        <FormControl>
                            <SelectTrigger className='shad-select-trigger'>
                                <SelectValue
                                    placeholder={props.placeholder}
                                />
                                <SelectContent
                                    className='shad-select-content'
                                >
                                    {props.children}
                                </SelectContent>
                            </SelectTrigger>
                        </FormControl>
                    </Select>
                </FormControl>
            )
        case FormFieldType.TEXTAREA:
            return (
                <FormControl>
                    <Textarea
                        placeholder={props.placeholder}
                        {...field}
                        className='shad-textArea'
                        disabled={props.disabled}
                    />
                </FormControl>
            )
        case FormFieldType.CHECKBOX:
            return (
                <FormControl>
                    <div className='flex items-center gap-4'>
                        <Checkbox
                            id={props.name}
                            checked={field.value}
                            onChange={field.onChange}
                        />
                        <Label htmlFor={props.name} className='checkbox-label'>
                            {props.label}
                        </Label>
                    </div>
                </FormControl>
            )
        case FormFieldType.SKELETON:
            return props.renderSkeleton ? props.renderSkeleton(field) : null

        default:
            break;
    }
}

const CustomFormField = (props: CustomProps) => {
    const { control, name, label } = props
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className='flex-1'>
                    {
                        props.fieldType !== FormFieldType.CHECKBOX
                        &&
                        label
                        &&
                        (
                            <FormLabel>{label}</FormLabel>
                        )
                    }
                    <RenderElement field={field} props={props} />
                    <FormMessage className='shad-error' />
                </FormItem>
            )}
        />
    )


}

export default CustomFormField