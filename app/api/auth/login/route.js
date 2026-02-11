import { emailVerificationLink } from "@/email/emailVerificationLink";
import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, generateOTP, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/user.Model";
import { SignJWT } from "jose";
import z from "zod";

export async function POST(request) {
    try {
        await connectDB()
        const payload = await request.json()
        const validationSchema = zSchema.pick({
            email: true
        }).extend({
            password: z.string()
        })
        const validatedData = validationSchema.safeParse(payload)
        if (!validatedData.success) {
            return response(false, 401, 'Invalid or missing input field', validatedData.error)
        }

        const { email, password } = validatedData.data
        // GET USER
        const getUser = await UserModel.findOne({ deletedAt: null, email }).select("+password")
        if (!getUser) {
            return response(false, 404, 'Invalid login credentials')
        }

        // resend email verification
        if (!getUser.isEmailVerified) {

            const secret = new TextEncoder().encode(process.env.SECRET_KEY)
            const token = await new SignJWT({ userId: getUser._id.toString() })
                .setIssuedAt()
                .setExpirationTime('3h')
                .setProtectedHeader({ alg: 'HS256' })
                .sign(secret)

            await sendMail('Email Verification ', email, emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`))

            return response(false, 403, 'Verify your email by using registered Email.')
        }

        // verify password
        const isPasswordVerified = await getUser.comparePassword(password)

        if (!isPasswordVerified) {
            return response(false, 400, 'Invalid Login credentials.')
        }

        // otp generation
        await OTPModel.deleteMany({ email })
        const otp = generateOTP()
        const newOtpData = new OTPModel({
            email, otp
        })

        await newOtpData.save()
        const otpEmailStatus = await sendMail('Login Verification Code', email, otpEmail(otp))
        if (!otpEmailStatus.success) {
            return response(false, 400, 'Failed to send OTP')
        }
        return response(true, 200, 'Verify OTP to Login')

    } catch (error) {
        return catchError(error)
    }
}