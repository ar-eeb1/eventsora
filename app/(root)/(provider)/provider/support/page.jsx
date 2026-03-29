import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Mail, Phone, MessageCircle } from 'lucide-react'
import React from 'react'

const Support = () => {
  return (
    <div className="flex justify-center items-center min-h-[60vh] min-w-full p-6 ">
      <Card className="w-full rounded-2xl shadow-xl border">
        
        <CardHeader className="border-b px-6 py-4">
          <h2 className="text-2xl font-semibold text-center">
            Support Center
          </h2>
          <p className="text-sm text-muted-foreground text-center">
            We're here to help you
          </p>
        </CardHeader>

        <CardContent className="space-y-6 p-6">

          {/* Email */}
          <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted transition">
            <Mail className="text-primary" size={22} />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <a 
                href="mailto:support@eventsora.com"
                className="font-medium hover:underline"
              >
                support@eventsora.com
              </a>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted transition">
            <Phone className="text-primary" size={22} />
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <a 
                href="tel:+923700182844"
                className="font-medium hover:underline"
              >
                +92 370 0182844
              </a>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-green-50 transition">
            <MessageCircle className="text-green-600" size={22} />
            <div>
              <p className="text-sm text-muted-foreground">WhatsApp</p>
              <a 
                href="https://wa.me/923700182844"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-green-600 hover:underline"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}

export default Support