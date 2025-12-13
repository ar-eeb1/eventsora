import { emailVerificationLink } from "@/email/emailVerificationLink";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/user.Model";
import { SignJWT } from "jose";

export async function POST(request) {
    try {
        await connectDB()
        const validationSchema = zSchema.pick({
            name: true,
            email: true,
            password: true,
            phone: true
        })

        const payload = await request.json()
        const validatedData = validationSchema.safeParse(payload)

        if (!validatedData.success) {
            return response(false, 401, 'Invalid or Missing input fields', validatedData.error)
        }

        const { name, email, password, phone } = validatedData.data
        const checkUser = await UserModel.exists({ email })

        if (checkUser) {
            return response(true, 409, 'User already registered')
        }

        const newRegistration = new UserModel({
            name, email, password, phone
        })

        await newRegistration.save()

        const secret = new TextEncoder().encode(process.env.SECRET_KEY)
        const token = await new SignJWT({ userId: newRegistration._id.toString() })
            .setIssuedAt()
            .setExpirationTime('1h')
            .setProtectedHeader({ alg: 'HS256' })
            .sign(secret)

        await sendMail('Email Verification ', email, emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`))
        return response(true, 200, 'Registration Success, Please verify your email')

    } catch (error) {
        catchError(error)
    }
}