import React from "react";
import Head from "next/head";
import {
    FileText,
    ShieldCheck,
    Users,
    CreditCard,
    AlertTriangle,
    Gavel,
    Lock,
    Mail,
} from "lucide-react";
import { EMAIL_ADDRESS } from "@/lib/utils";
import { REFUND_POLICY } from "@/routes/WebsiteRoute";

const sections = [
    {
        icon: FileText,
        title: "Platform Overview",
        description:
            "Eventsora is an online marketplace that connects customers with event service providers such as venues, photographers, decorators, and other event-related services. We do not directly provide those services, but we facilitate communication and booking between users and vendors.",
    },
    {
        icon: Users,
        title: "User Accounts",
        description:
            "To access certain features, users may need to create an account and provide accurate, complete, and up-to-date information. Eventsora reserves the right to suspend or terminate accounts that submit false information or violate platform rules.",
    },
    {
        icon: ShieldCheck,
        title: "Vendor Responsibilities",
        description:
            "Vendors are responsible for the quality, pricing accuracy, availability, and timely delivery of the services they offer on the platform.",
    },
    {
        icon: CreditCard,
        title: "Bookings & Payments",
        description:
            "Some bookings may require advance payment to confirm reservations. Users agree to make payments only through the platform, and Eventsora may charge a 5%-10% service fee on bookings made via the platform.",
    },
    {
        icon: AlertTriangle,
        title: "Cancellation & Refunds",
        description: (
            <>
                Cancellation and refund policies may vary by provider. Eventsora may assist in refund processing where applicable, but does not guarantee refunds in all situations. Check out{" "}
                <a
                    href={REFUND_POLICY}
                    className="text-pink-600 underline hover:text-pink-700"
                >
                    Refund Policy
                </a>
                .
            </>
        ),
    },
    {
        icon: Gavel,
        title: "Prohibited Activities",
        description:
            "Users and vendors must not provide false information, attempt fraudulent bookings or payments, harass other users, or bypass platform payment systems.",
    },
    {
        icon: Lock,
        title: "Limitation of Liability",
        description:
            "Eventsora is not liable for damages, losses, or disputes arising from services provided by third-party vendors listed on the platform.",
    },
    {
        icon: FileText,
        title: "Intellectual Property",
        description:
            "All content, branding, design, and website material on Eventsora are the property of Eventsora and may not be copied or distributed without permission.",
    },
    {
        icon: ShieldCheck,
        title: "Privacy Policy",
        description:
            "Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.",
    },
    {
        icon: FileText,
        title: "Changes to Terms",
        description:
            "Eventsora reserves the right to update or modify these Terms and Conditions at any time. Continued use of the platform after updates are posted means you accept the revised terms.",
    },
];

const TermsAndConditions = () => {
    return (
        <>
            <Head>
                <title>Terms & Conditions | Eventsora</title>
                <meta
                    name="description"
                    content="Read the terms and conditions for using Eventsora services."
                />
            </Head>

            <div className="min-h-screen py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-pink-100 mb-6">
                            <FileText className="w-10 h-10 text-pink-600" />
                        </div>

                        <h1 className="text-5xl font-bold text-gray-900 mb-4">
                            Terms & Conditions
                        </h1>

                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Please read these terms carefully before using Eventsora. By
                            accessing our platform, you agree to follow the rules outlined
                            below.
                        </p>

                        <div className="mt-6 inline-block px-4 py-2 rounded-full bg-pink-100 text-pink-700 text-sm font-medium">
                            Last Updated: June 2026
                        </div>
                    </div>

                    {/* Intro Card */}
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 mb-10">
                        <p className="text-gray-700 leading-relaxed text-lg">
                            Welcome to <span className="font-semibold text-pink-600">Eventsora</span>.
                            These Terms and Conditions explain the rules for using our
                            platform, booking services, and interacting with vendors.
                        </p>
                    </div>

                    {/* Policy Cards */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {sections.map((section, index) => {
                            const Icon = section.icon;

                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 hover:shadow-xl transition duration-300"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                                            <Icon className="w-6 h-6 text-pink-600" />
                                        </div>

                                        <h2 className="text-2xl font-semibold text-gray-900">
                                            {index + 1}. {section.title}
                                        </h2>
                                    </div>

                                    <p className="text-gray-700 leading-relaxed">
                                        {section.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Contact Card */}
                    <div className="mt-10 bg-pink-300 rounded-3xl text-white p-10 text-center shadow-xl">
                        <Mail className="w-12 h-12 mx-auto mb-4" />

                        <h2 className="text-3xl font-bold mb-3">Need Help?</h2>

                        <p className="text-pink-100 mb-6">
                            If you have any questions about these Terms & Conditions,
                            please contact our team.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <a
                                href="https://wa.me/923700182844"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-white text-pink-700 font-semibold px-6 py-3 rounded-xl hover:scale-105 transition"
                            >
                                Chat on WhatsApp
                            </a>

                            <a
                                href={`mailto:${EMAIL_ADDRESS}`}
                                className="inline-flex items-center gap-2 bg-white text-pink-700 font-semibold px-6 py-3 rounded-xl hover:scale-105 transition"
                            >
                                <Mail size={18} />
                                {EMAIL_ADDRESS}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TermsAndConditions;