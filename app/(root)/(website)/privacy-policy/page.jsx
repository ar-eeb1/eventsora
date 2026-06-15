import React from 'react';
import Head from 'next/head';

const PrivacyPolicy = () => (
  <>
    <Head>
      <title>Privacy Policy - Eventsora</title>
      <meta
        name="description"
        content="Read the privacy policy for Eventsora, how we handle your data and protect your privacy."
      />
    </Head>

    <div className="prose mx-auto py-8 px-4">
      <h1>Privacy Policy</h1>

      <p>
        At Eventsora, we value your privacy and are committed to protecting your
        personal information. This Privacy Policy explains how we collect, use,
        and safeguard your information when you use our platform.
      </p>

      <h2>1. Information We Collect</h2>
      <p>We may collect the following information when you use Eventsora:</p>
      <ul>
        <li>Name</li>
        <li>Email address</li>
        <li>Phone number</li>
        <li>Location or address</li>
        <li>Booking details</li>
        <li>Communication between users and vendors</li>
        <li>Payment-related information</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>Your information is used to:</p>
      <ul>
        <li>Create and manage user accounts</li>
        <li>Process bookings and transactions</li>
        <li>Connect customers with vendors</li>
        <li>Send booking confirmations and updates</li>
        <li>Improve the functionality of our platform</li>
        <li>Provide customer support</li>
      </ul>

      <h2>3. Payment Information</h2>
      <p>
        Eventsora may process advance payments to confirm bookings. Payments
        made through the platform may be temporarily held and later released to
        the vendor after successful completion of the service.
      </p>
      <p>
        We do not store sensitive financial information such as complete card
        details. Payments are processed through secure payment gateways.
      </p>

      <h2>4. Sharing of Information</h2>
      <p>
        We may share limited information with vendors and service providers to
        complete bookings and provide services.
      </p>
      <p>We may also share information with:</p>
      <ul>
        <li>Payment processors</li>
        <li>Service providers assisting our platform</li>
        <li>Legal authorities when required by law</li>
      </ul>

      <h2>5. Data Protection</h2>
      <p>
        We take reasonable technical and organizational measures to protect
        your data from unauthorized access, misuse, or disclosure.
      </p>

      <h2>6. Cookies and Tracking</h2>
      <p>
        Eventsora may use cookies and similar technologies to improve user
        experience, remember preferences, and analyze website performance.
      </p>

      <h2>7. User Communication</h2>
      <p>
        We may send users important notifications such as booking confirmations,
        service updates, or platform announcements.
      </p>

      <h2>8. Third-Party Links</h2>
      <p>
        Our platform may contain links to third-party websites or services.
        Eventsora is not responsible for the privacy practices of those
        external websites.
      </p>

      <h2>9. Changes to This Privacy Policy</h2>
      <p>
        Eventsora may update this Privacy Policy from time to time. Any changes
        will be posted on this page.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        If you have any questions regarding this Privacy Policy, please contact
        us at:
      </p>

      <p>Email: support@eventsora.com</p>

      <p>Last Updated: 2026</p>
    </div>
  </>
);

export default PrivacyPolicy;