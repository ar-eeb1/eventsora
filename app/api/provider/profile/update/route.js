import { isAuthenticated } from '@/lib/authentication'
import cloudinary from '@/lib/cloudinary'
import { connectDB } from '@/lib/databaseConnection'
import { catchError, response } from '@/lib/helperFunction'
import BusinessProfileModel from '@/models/BusinessProfile.model'
import UserModel from '@/models/user.Model'

export async function PUT(request) {
  try {
    await connectDB()

    const auth = await isAuthenticated(['provider'])
    if (!auth.isAuth) {
      return response(false, 401, 'unauthorized')
    }

    const userId = auth.userId
    const user = await UserModel.findById(userId)
    if (!user) {
      return response(false, 404, 'user not found')
    }

    const formData = await request.formData()
    const file = formData.get('file')

    // update user avatar if provided
    if (file && file.size) {
      const fileBuffer = await file.arrayBuffer()
      const base64Image = `data:${file.type};base64,${Buffer.from(fileBuffer).toString('base64')}`

      const uploadFile = await cloudinary.uploader.upload(base64Image, { upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET })

      // remove old avatar
      if (user?.avatar?.public_id) {
        try {
          await cloudinary.api.delete_resources([user.avatar.public_id])
        } catch (e) {
          // ignore deletion errors
        }
      }

      user.avatar = {
        url: uploadFile.secure_url,
        public_id: uploadFile.public_id,
      }

      await user.save()
    }

    // upsert business profile
    let business = await BusinessProfileModel.findOne({ user: userId })
    if (!business) {
      business = new BusinessProfileModel({ user: userId })
    }

    const bankName = formData.get('bankName') || business.bankDetails?.bankName || ''
    const accountHolderName = formData.get('accountHolderName') || business.bankDetails?.accountHolderName || ''
    const accountNumber = formData.get('accountNumber') || business.bankDetails?.accountNumber || ''
    const iban = formData.get('iban') || business.bankDetails?.iban || ''

    const bankDetailsChanged =
      bankName !== (business.bankDetails?.bankName || '') ||
      accountHolderName !== (business.bankDetails?.accountHolderName || '') ||
      accountNumber !== (business.bankDetails?.accountNumber || '') ||
      iban !== (business.bankDetails?.iban || '')

    if (bankDetailsChanged) {
      const lastUpdate = business.bankDetails?.lastUpdate
      if (lastUpdate) {
        const daysSinceLastUpdate = Math.floor((new Date() - new Date(lastUpdate)) / (1000 * 60 * 60 * 24))
        if (daysSinceLastUpdate < 30) {
          return response(false, 400, `Bank details can only be updated once every 30 days. You can update again in ${30 - daysSinceLastUpdate} days.`)
        }
      }

      business.bankDetails = {
        bankName,
        accountHolderName,
        accountNumber,
        iban,
        lastUpdate: new Date()
      }
    }

    business.businessName = formData.get('name') || business.businessName
    business.phone = formData.get('phone') || business.phone

    await business.save()

    return response(true, 200, 'Business profile updated', {
      _id: user._id.toString(),
      role: user.role,
      name: user.name,
      avatar: user.avatar,
    })
  } catch (error) {
    return catchError(error)
  }
}
