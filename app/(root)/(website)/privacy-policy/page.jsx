import React from "react";
import Head from "next/head";
import {
  ShieldCheck,
  User,
  CreditCard,
  Lock,
  Cookie,
  MessageSquare,
  Link,
  RefreshCw,
  Mail,
} from "lucide-react";

const sections = [
  {
    icon: User,
    title: "Information We Collect",
    content: [
      "Name",
      "Email address",
      "Phone number",
      "Location or address",
      "Booking details",
      "Communication between users and vendors",
      "Payment-related information",
    ],
  },
  {
    icon: ShieldCheck,
    title: "How We Use Your Information",
    content: [
      "Create and manage user accounts",
      "Process bookings and transactions",
      "Connect customers with vendors",
      "Send booking confirmations and updates",
      "Improve platform functionality",
      "Provide customer support",
    ],
  },
  {
    icon: CreditCard,
    title: "Payment Information",
    description:
      "Eventsora may process advance payments to confirm bookings. Payments may be temporarily held and released to vendors after successful service completion. We never store sensitive card information and use secure payment gateways.",
  },
  {
    icon: Lock,
    title: "Data Protection",
    description:
      "We implement reasonable technical and organizational security measures to protect your data against unauthorized access, misuse, or disclosure.",
  },
  {
    icon: Cookie,
    title: "Cookies & Tracking",
    description:
      "Eventsora may use cookies and similar technologies to improve user experience, remember preferences, and analyze platform performance.",
  },
  {
    icon: MessageSquare,
    title: "User Communication",
    description:
      "We may send booking confirmations, service updates, important notifications, and platform announcements.",
  },
  {
    icon: Link,
    title: "Third-Party Links",
    description:
      "Our platform may contain links to external websites. We are not responsible for the privacy practices of those third-party services.",
  },
  {
    icon: RefreshCw,
    title: "Changes to This Policy",
    description:
      "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.",
  },
];

const PrivacyPolicy = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy | Eventsora</title>
        <meta
          name="description"
          content="Learn how Eventsora collects, uses, and protects your personal information."
        />
      </Head>

      <div className="min-h-screen py-4 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-pink-100 mb-6">
              <ShieldCheck className="w-10 h-10 text-pink-600" />
            </div>

            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your privacy matters to us. Learn how Eventsora collects,
              uses, and safeguards your personal information.
            </p>

            <div className="mt-6 inline-block px-4 py-2 rounded-full bg-pink-100 text-pink-700 text-sm font-medium">
              Last Updated: June 2026
            </div>
          </div>

          {/* Introduction */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 mb-10">
            <p className="text-gray-700 leading-relaxed text-lg">
              At <span className="font-semibold text-pink-600">Eventsora</span>,
              we value your privacy and are committed to protecting your
              personal information. This Privacy Policy explains how we collect,
              use, store, and safeguard your data when you use our platform.
            </p>
          </div>

          {/* Policy Cards */}
          <div className="grid gap-6">
            {sections.map((section, index) => {
              const Icon = section.icon;

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 hover:shadow-xl transition duration-300"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-pink-600" />
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-900">
                      {index + 1}. {section.title}
                    </h2>
                  </div>

                  {section.content ? (
                    <ul className="grid sm:grid-cols-2 gap-3">
                      {section.content.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-3 text-gray-700"
                        >
                          <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700 leading-relaxed">
                      {section.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sharing Information */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mt-6">
            <h2 className="text-2xl font-semibold mb-4">
              Sharing of Information
            </h2>

            <p className="text-gray-700 mb-4">
              We may share limited information with vendors and service
              providers to complete bookings and provide services.
            </p>

            <ul className="space-y-2 text-gray-700">
              <li>• Payment processors</li>
              <li>• Platform service providers</li>
              <li>• Legal authorities when required by law</li>
            </ul>
          </div>

          {/* Contact Card */}
          <div className="mt-10 bg-pink-300  rounded-3xl text-white p-10 text-center shadow-xl">
            <Mail className="w-12 h-12 mx-auto mb-4" />

            <h2 className="text-3xl font-bold mb-3">
              Questions About Privacy?
            </h2>

            <p className="text-pink-100 mb-6">
              If you have any questions regarding this Privacy Policy,
              feel free to contact us.
            </p>

            <a
              href="mailto:support@eventsora.com"
              className="inline-flex items-center gap-2 bg-white text-pink-700 font-semibold px-6 py-3 rounded-xl hover:scale-105 transition"
            >
              <Mail size={18} />
              admin@eventsora.com
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;