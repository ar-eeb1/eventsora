'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { WEBSITE_HOME } from '@/routes/AdminPanelRoute'
import axios from 'axios'
import Link from 'next/link'
import React, { use, useEffect, useState } from 'react'

const getTokenFromPath = () => {
  if (typeof window === 'undefined') return ''

  try {
    const segments = window.location.pathname.split('/').filter(Boolean)
    const verifyIndex = segments.lastIndexOf('verify-email')

    if (verifyIndex >= 0 && segments[verifyIndex + 1]) {
      return decodeURIComponent(segments[verifyIndex + 1])
    }
  } catch {
    return ''
  }

  return ''
}

const EmailVerification = ({ params }) => {
  const [isVerified, setIsVerified] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const resolvedParams = use(params)
  const token = resolvedParams?.token || getTokenFromPath()

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setErrorMessage('Verification token is missing.')
        return
      }
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'
        const { data: verificationResponse } = await axios.post(`${backendUrl}/api/auth/verify-email`, { token })

        if (verificationResponse?.success) {
          setIsVerified(true)
          setErrorMessage('')
        } else {
          setErrorMessage(verificationResponse?.message || 'Email verification failed.')
        }
      } catch (error) {
        setErrorMessage(error?.response?.data?.message || 'Unable to verify your email right now.')
      }
    }

    verify()
  }, [token])

  return (
    <Card className='w-[450px] text-center'>
      <CardContent>
        {isVerified ? (
          <div>
            <lord-icon
              src="https://cdn.lordicon.com/qgehayhe.json"
              trigger="loop"
              delay='1000'
              colors="primary:#17171c,secondary:#fad3d1,tertiary:#e8308c"
              style={{ width: 'clamp(100px, 15vw, 150px)', height: 'clamp(100px, 15vw, 150px)' }}
            >
            </lord-icon>
            <h1 className='text-2xl font-bold my-5 '>Email verification success!</h1>
            <Button>
              <Link href={WEBSITE_HOME}>
                Plan Your Event
              </Link>
            </Button>
          </div>
        ) : (
          <div>
            <lord-icon
              src="https://cdn.lordicon.com/eneckwog.json"
              trigger="loop"
              delay='1000'
              colors="primary:#17171c,secondary:#e8308c,tertiary:#fad3d1"
              style={{ width: 150, height: 150 }}
            >
            </lord-icon>
            <h1 className='text-2xl font-bold my-5 '>Eventsora is Verifying your email...</h1>
            {errorMessage ? <p className='text-sm text-red-600'>{errorMessage}</p> : null}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default EmailVerification
