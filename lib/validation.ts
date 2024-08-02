import { z } from 'zod'

export const UserFormValidation = z.object({
    name: z.string()
        .min(4, "Username must be at least 4 characters.")
        .max(50, "Username must be at most 50 characters."),
    email: z.string().email("Invalid Email Address"),
    phone: z.string().refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid Phone Number")


}
)