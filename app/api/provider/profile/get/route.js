import { isAuthenticated } from '@/lib/authentication'
import { connectDB } from '@/lib/databaseConnection'
import { catchError, response } from '@/lib/helperFunction'
import BusinessProfileModel from '@/models/BusinessProfile.model'
import UserModel from '@/models/user.Model'

export async function GET() {
  try {
    await connectDB()

    const auth = await isAuthenticated(['provider'])
    if (!auth.isAuth) {
      return response(false, 401, 'unauthorized')
    }

    const userId = auth.userId

    const user = await UserModel.findById(userId).lean()
    const business = await BusinessProfileModel.findOne({ user: userId }).lean()

    if (!user && !business) {
      return response(false, 404, 'profile not found')
    }

    const data = {
      // prefer business profile values when available
      name: business?.businessName || user?.name || '',
      phone: business?.phone || user?.phone || '',
      bankName: business?.bankDetails?.bankName || '',
      accountHolderName: business?.bankDetails?.accountHolderName || '',
      accountNumber: business?.bankDetails?.accountNumber || '',
      iban: business?.bankDetails?.iban || '',
      avatar: user?.avatar || null,
      _id: user?._id?.toString(),
      role: user?.role || 'provider',
    }

    return response(true, 200, 'Business profile data', data)
  } catch (error) {
    return catchError(error)
  }
}
