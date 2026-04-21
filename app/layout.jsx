import { Poppins } from '@next/font/google';
import { Geist, Geist_Mono } from "next/font/google";
import { Kapakana } from '@next/font/google';
import "./globals.css";
import Script from 'next/script';
import { Toaster } from 'sonner';
import GlobalProvider from '@/components/application/GlobalProvider';
import ThemeProvider from '@/components/application/Website/ThemeProvider'


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap'
});

export const metadata = {
  metadataBase: new URL('https://www.eventsora.com'),
  title: {
    template: '%s | Eventsora',
    default: 'Eventsora'
  },
  description: "One roof for all Events",
  openGraph: {
    title: 'Eventsora',
    description: 'One roof for all Events',
    url: 'https://www.eventsora.com',
    siteName: 'Eventsora',
    images: [
      {
        url: 'https://res.cloudinary.com/dliahmplq/image/upload/v1776787244/Untitled_design_1_qfvqha.png',
        width: 1200,
        height: 630,
        alt: 'Eventsora',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eventsora',
    description: 'One roof for all Events',
    images: ['https://res.cloudinary.com/dliahmplq/image/upload/v1776787244/Untitled_design_1_qfvqha.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script src="https://cdn.lordicon.com/lordicon.js"></Script>

      <body className={`${geistSans.variable} ${geistMono.variable} ${poppins.className} antialiased`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange
        >

          <GlobalProvider>
            {children}
            <Toaster closeButton position="top-center" />
          </GlobalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
