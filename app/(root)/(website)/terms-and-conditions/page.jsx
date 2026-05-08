import React from 'react';
import Head from 'next/head';
import { Dot } from 'lucide-react';
import { EMAIL_ADDRESS } from '@/lib/utils';

const TermsAndConditions = () => (
    <>
        <Head>
            <title>Terms & Conditions - Eventsora</title>
            <meta
                name="description"
                content="Read the terms and conditions for using Eventsora services."
            />
        </Head>

        <div className="prose mx-auto py-8 px-4 ml-10">
            <h1 className='font-bold text-2xl'>Terms & Conditions</h1>
            <p className='flex items-center gap-2'>
                <Dot /> Welcome to Eventsora. By accessing or using our platform, you agree to
                comply with and be bound by the following Terms and Conditions. Please
                read them carefully before using our services.
            </p>

            <h2 className='font-bold underline underline-offset-1'>1. Platform Overview</h2>
            <p className='flex items-center gap-2'>
                <Dot /> Eventsora is an online marketplace that connects customers with event
                service providers such as venues, photographers, decorators, and other event-related services.
            </p>
            <p className='flex items-center gap-2'>
                <Dot /> Eventsora does not directly provide these services. We only facilitate
                communication and booking between users and service providers.
            </p>


            <h2 className='font-bold underline underline-offset-1'>2. Your Listing will be shared publicly on our website</h2>
            <p className='flex items-center gap-2'>
                <Dot /> Please make sure that you have the rights to share the content.
            </p>


            <h2 className='font-bold underline underline-offset-1'>3. User Accounts</h2>
            <p className='flex items-center gap-2'>
                <Dot /> To access certain features of the platform, users may be required to
                create an account. You agree to provide accurate and complete
                information during registration.
            </p>
            <p className='flex items-center gap-2'>
                <Dot /> Eventsora reserves the right to suspend or terminate accounts that
                provide false information or violate our policies.
            </p>

            <h2 className='font-bold underline underline-offset-1'>4. Vendor Responsibilities</h2>
            <p className='flex items-center gap-2'>
                <Dot /> Vendors listed on Eventsora are responsible for the services they
                provide, including service quality, pricing accuracy, availability, and
                timely delivery.
            </p>

            <h2 className='font-bold underline underline-offset-1'>5. Bookings and Payments</h2>
            <p className='flex items-center gap-2'>
                <Dot /> Some services may require advance payment to confirm a booking.
                Payments made through the platform may be held temporarily and released
                to the vendor after successful completion of the service.
            </p>
            <p className='flex items-center gap-2'>
                <Dot /> Users agree to make payments only through the platform when booking a
                service listed on Eventsora.
            </p>

            <p className='flex items-center gap-2'>
                <Dot /> Platform will charge 5% service fee on each booking made through the platform. This service fee will be added to the vendor's payment.
            </p>

            <h2 className='font-bold underline underline-offset-1'>6. Cancellation and Refunds</h2>
            <p className='flex items-center gap-2'>
                <Dot /> Cancellation and refund policies may vary depending on the service
                provider. Users are encouraged to review vendor policies before making
                a booking.
            </p>
            <p className='flex items-center gap-2'>
                <Dot /> Eventsora may assist in refund processing where applicable but does not
                guarantee refunds in all situations.
            </p>

            <h2 className='font-bold underline underline-offset-1'>7. Prohibited Activities</h2>
            <p>Users and vendors must not:</p>
            <ul >
                <li className='flex items-center gap-2'>
                    <Dot />Provide false or misleading information</li>
                <li className='flex items-center gap-2'>
                    <Dot />Attempt fraudulent bookings or payments</li>
                <li className='flex items-center gap-2'>
                    <Dot />Harass or abuse other users</li>
                <li className='flex items-center gap-2'>
                    <Dot />Attempt to bypass platform payment systems</li>
            </ul>

            <h2 className='font-bold underline underline-offset-1'>8. Limitation of Liability</h2>
            <p className='flex items-center gap-2'>
                <Dot /> Eventsora is not liable for damages, losses, or disputes resulting from
                services provided by third-party vendors listed on the platform.
            </p>

            <h2 className='font-bold underline underline-offset-1'>9. Intellectual Property</h2>
            <p className='flex items-center gap-2'>
                <Dot /> All content on the Eventsora platform, including logos, branding,
                design, and website content, is the property of Eventsora and may not
                be copied, reproduced, or distributed without permission.
            </p>

            <h2 className='font-bold underline underline-offset-1'>10. Changes to Terms</h2>
            <p className='flex items-center gap-2'>
                <Dot /> Eventsora reserves the right to update or modify these Terms and
                Conditions at any time. Continued use of the platform after changes are
                posted means you accept the updated terms.
            </p>

            <h2 className='font-bold underline underline-offset-1'>11. Privacy Policy</h2>
            <p className='flex items-center gap-2'>
                <Dot /> Eventsora is committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your personal information when you use our platform.
            </p>



            <h2 className='font-bold underline underline-offset-1'>12. Contact Us</h2>
            <p className='flex items-center gap-2'>
                <Dot />
                <span>
                    If you have any questions regarding these Terms and Conditions, please
                    contact us on WhatsApp:{' '}
                    <a
                        href='https://wa.me/923700182844'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-green-600 underline'
                    >
                        Chat on WhatsApp
                    </a>
                </span>
            </p>

            <p className='flex items-center gap-2'>
                <Dot /> Email: <a target='blank' className='text-blue-500 underline' href={`mailto:${EMAIL_ADDRESS}`}>{EMAIL_ADDRESS}</a>
            </p>
        </div>
    </>
);

export default TermsAndConditions;