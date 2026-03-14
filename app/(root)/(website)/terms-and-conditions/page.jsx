import React from 'react';
import Head from 'next/head';

const TermsAndConditions = () => (
    <>
        <Head>
            <title>Terms & Conditions - Eventsora</title>
            <meta
                name="description"
                content="Read the terms and conditions for using Eventsora services."
            />
        </Head>

        <div className="prose mx-auto py-8 px-4">
            <h1 className='font-bold text-2xl'>Terms & Conditions</h1>
            <p>
                Welcome to Eventsora. By accessing or using our platform, you agree to
                comply with and be bound by the following Terms and Conditions. Please
                read them carefully before using our services.
            </p>

            <h2 className='font-bold underline underline-offset-1'>1. Platform Overview</h2>
            <p>
                Eventsora is an online marketplace that connects customers with event
                service providers such as venues, photographers, decorators, and other event-related services.
            </p>
            <p>
                Eventsora does not directly provide these services. We only facilitate
                communication and booking between users and service providers.
            </p>

            <h2 className='font-bold underline underline-offset-1'>2. User Accounts</h2>
            <p>
                To access certain features of the platform, users may be required to
                create an account. You agree to provide accurate and complete
                information during registration.
            </p>
            <p>
                Eventsora reserves the right to suspend or terminate accounts that
                provide false information or violate our policies.
            </p>

            <h2 className='font-bold underline underline-offset-1'>3. Vendor Responsibilities</h2>
            <p>
                Vendors listed on Eventsora are responsible for the services they
                provide, including service quality, pricing accuracy, availability, and
                timely delivery.
            </p>
            <p>
                Eventsora is not responsible for any service failure, delays, or
                disputes caused by vendors, but we may assist in resolving disputes
                where possible.
            </p>

            <h2 className='font-bold underline underline-offset-1'>4. Bookings and Payments</h2>
            <p>
                Some services may require advance payment to confirm a booking.
                Payments made through the platform may be held temporarily and released
                to the vendor after successful completion of the service.
            </p>
            <p>
                Users agree to make payments only through the platform when booking a
                service listed on Eventsora.
            </p>

            <h2 className='font-bold underline underline-offset-1'>5. Cancellation and Refunds</h2>
            <p>
                Cancellation and refund policies may vary depending on the service
                provider. Users are encouraged to review vendor policies before making
                a booking.
            </p>
            <p>
                Eventsora may assist in refund processing where applicable but does not
                guarantee refunds in all situations.
            </p>

            <h2 className='font-bold underline underline-offset-1'>6. Prohibited Activities</h2>
            <p>Users and vendors must not:</p>
            <ul>
                <li>Provide false or misleading information</li>
                <li>Attempt fraudulent bookings or payments</li>
                <li>Harass or abuse other users</li>
                <li>Attempt to bypass platform payment systems</li>
            </ul>

            <h2 className='font-bold underline underline-offset-1'>7. Limitation of Liability</h2>
            <p>
                Eventsora is not liable for damages, losses, or disputes resulting from
                services provided by third-party vendors listed on the platform.
            </p>

            <h2 className='font-bold underline underline-offset-1'>8. Intellectual Property</h2>
            <p>
                All content on the Eventsora platform, including logos, branding,
                design, and website content, is the property of Eventsora and may not
                be copied, reproduced, or distributed without permission.
            </p>

            <h2 className='font-bold underline underline-offset-1'>9. Changes to Terms</h2>
            <p>
                Eventsora reserves the right to update or modify these Terms and
                Conditions at any time. Continued use of the platform after changes are
                posted means you accept the updated terms.
            </p>

            <h2 className='font-bold underline underline-offset-1'>10. Governing Law</h2>
            <p>
                These Terms and Conditions are governed by the laws of Pakistan. Any
                disputes arising from the use of the platform will be subject to the
                jurisdiction of Pakistani courts.
            </p>

            <h2 className='font-bold underline underline-offset-1'>11. Contact Us</h2>
            <p>
                If you have any questions regarding these Terms and Conditions, please
                contact us at:
            </p>

            <p>
                Email: support@eventsora.com
            </p>

            <p>Last Updated: 2026</p>
        </div>
    </>
);

export default TermsAndConditions;