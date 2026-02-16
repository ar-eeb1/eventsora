import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import crypto from 'crypto';


export async function POST(request) {
    try {
        await connectDB()
        const payload = await request.json()
        const schema = zSchema.pick({
            amount: true,
        })

        const validate = schema.safeParse(payload)

        if (!validate.success) {
            return response(false, 400, 'Invalid or Missing Fields', validate.error)
        }
        const { amount } = validate.data

        const option = {
            amount: Number(amount),
            currency: 'PKR'
        }

        const booking_id = 'ORD-' + crypto.randomBytes(4).toString('hex').toUpperCase()
        if (!booking_id.success) {
            throw new Error(error.message)
        }
        return response(true, 200, 'Booking ID Created', booking_id)

    } catch (error) {
        return catchError(error.message)
    }
}