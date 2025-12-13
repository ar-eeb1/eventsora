'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { WEBSITE_HOME } from '@/routes/AdminPanelRoute'
import axios from 'axios'
import Link from 'next/link'
import React, { use, useEffect, useState } from 'react'

const EmailVerification = ({ params }) => {
  const [isVerified, setIsVerified] = useState(false)

  const { token } = use(params)
  useEffect(() => {
    const verify = async () => {
      const { data: verificationResponse } = await axios.post('/api/auth/verify-email', { token })
      // /api/auth/register
      if (verificationResponse.success) {
        setIsVerified(true)
      }
    }

    verify()
  }, [token])

  return (
    <Card className='w-[450px] text-center'>
      <CardContent>
        {isVerified ?
          <div>
            <lord-icon
              src="https://cdn.lordicon.com/qgehayhe.json"
              triger="loop"
              delay='1000'
              colors="primary:#17171c,secondary:#fad3d1,tertiary:#e8308c"
              style={{ width: 150, height: 150 }}
            >
            </lord-icon>
            <h1 className='text-2xl font-bold my-5 '>Email verification success!</h1>
            <Button>
              <Link href={WEBSITE_HOME}>
                Plan Your Event
              </Link>
            </Button>
          </div>
          :
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
          </div>
        }
      </CardContent>
    </Card>
  )
}

export default EmailVerification
