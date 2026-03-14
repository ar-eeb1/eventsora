import NextAuth from "next-auth"
import GoogleProvider from 'next-auth/providers/google'
import { connectDB } from "@/lib/databaseConnection"
import UserModel from "@/models/user.Model"
import { SignJWT } from "jose"
import { cookies } from "next/headers"

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        })
    ],
    secret: process.env.NEXTAUTH_SECRET || process.env.SECRET_KEY,
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account.provider === 'google') {
                try {
                    await connectDB()

                    let dbUser = await UserModel.findOne({ email: user.email })

                    if (!dbUser) {
                        // Create a new user if one doesn't exist
                        dbUser = new UserModel({
                            name: user.name,
                            email: user.email,
                            role: 'user',
                            isEmailVerified: true, // Google emails are already verified
                            avatar: {
                                url: user.image,
                                public_id: ''
                            },
                            // Use random string for password since they log in via Google
                            password: Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10)
                        })
                        await dbUser.save()
                    }

                    // For the custom Auth flow, we generate a normal JWT
                    const secret = new TextEncoder().encode(process.env.SECRET_KEY)
                    const token = await new SignJWT({ userId: dbUser._id.toString(), role: dbUser.role })
                        .setIssuedAt()
                        .setExpirationTime('3d')
                        .setProtectedHeader({ alg: 'HS256' })
                        .sign(secret)

                    // We set it manually in the cookies so the rest of the app's custom auth works seamlessly
                    const cookieStore = await cookies()
                    cookieStore.set('access_token', token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        maxAge: 3 * 24 * 60 * 60, // 3 days
                        path: '/',
                        sameSite: 'strict',
                    })

                    // Attach role to user object so it's available in session/jwt callback if needed
                    user.role = dbUser.role
                    user.id = dbUser._id.toString()

                    return true
                } catch (error) {
                    console.error("Error during Google sign in:", error)
                    return false
                }
            }
            return true
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role
                session.user.id = token.id
            }
            return session
        }
    },
    pages: {
        signIn: '/auth/login',
    }
})

export { handler as GET, handler as POST }