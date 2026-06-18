import React from "react";
import Head from "next/head";
import {
  RefreshCw,
  XCircle,
  ShieldCheck,
  AlertTriangle,
  CreditCard,
  Scale,
  Mail,
} from "lucide-react";

const RefundPolicy = () => {
  const sections = [
    {
      icon: XCircle,
      title: "Customer-Initiated Cancellations",
      description:
        "If a customer cancels a confirmed booking, the advance payment is generally non-refundable. Eventsora may attempt to find a replacement booking for the vendor. If a replacement booking is successfully secured and accepted, a refund may be issued subject to applicable processing fees.",
    },
    {
      icon: AlertTriangle,
      title: "Vendor-Initiated Cancellations",
      description:
        "If a vendor cancels a confirmed booking without a valid reason, the customer may be eligible for a full refund of any advance payment made through Eventsora.",
    },
    {
      icon: ShieldCheck,
      title: "Failure to Provide Service",
      description:
        "If a vendor fails to provide the booked service as agreed, Eventsora may investigate the matter and determine whether the customer qualifies for a refund.",
    },
    {
      icon: CreditCard,
      title: "Refund Processing",
      description:
        "Approved refunds will be processed through the original payment method whenever possible. Processing times may vary depending on banks and payment providers.",
    },
    {
      icon: Scale,
      title: "Dispute Resolution",
      description:
        "In case of disputes between customers and vendors, Eventsora reserves the right to review all available evidence and make a final decision regarding refund eligibility.",
    },
  ];

  return (
    <>
      <Head>
        <title>Refund & Cancellation Policy | Eventsora</title>
        <meta
          name="description"
          content="Eventsora Refund & Cancellation Policy. Learn how refunds, cancellations, and disputes are handled on our platform."
        />
      </Head>

      <div className="min-h-screen py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-pink-100 mb-6">
              <RefreshCw className="w-10 h-10 text-pink-600" />
            </div>

            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Refund & Cancellation Policy
            </h1>

            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              This policy explains how cancellations, refunds, and payment
              disputes are handled on Eventsora to ensure fairness for both
              customers and vendors.
            </p>

            <div className="mt-6 inline-block px-4 py-2 rounded-full bg-pink-100 text-pink-700 text-sm font-medium">
              Last Updated: June 2026
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-pink-50 border border-pink-200 rounded-3xl p-8 mb-10">
            <h2 className="text-2xl font-bold text-pink-700 mb-4">
              Important Notice
            </h2>

            <p className="text-gray-700 leading-relaxed">
              If a customer voluntarily cancels a confirmed booking, the advance
              payment is generally <strong>non-refundable</strong>. However,
              Eventsora may attempt to find a replacement booking for the vendor.
              If a replacement booking is successfully secured and accepted,
              Eventsora may process a refund subject to any applicable fees.
              Eventsora does not guarantee that a replacement booking will be
              found.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="grid gap-6">
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

          {/* Non Refundable Charges */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mt-6">
            <h2 className="text-2xl font-semibold mb-4">
              Non-Refundable Charges
            </h2>

            <p className="text-gray-700 leading-relaxed">
              Payment gateway fees, transaction fees, taxes, and other platform
              service charges may be deducted from any refundable amount where
              applicable.
            </p>
          </div>

          {/* Contact Section */}
          <div className="mt-10 bg-pink-300 rounded-3xl text-white p-10 text-center shadow-xl">
            <Mail className="w-12 h-12 mx-auto mb-4" />

            <h2 className="text-3xl font-bold mb-3">
              Need Help With a Refund?
            </h2>

            <p className="text-pink-100 mb-6">
              Contact our support team for refund requests, disputes, or policy
              questions.
            </p>

            <a
              href="mailto:support@eventsora.com"
              className="inline-flex items-center gap-2 bg-white text-pink-600 font-semibold px-6 py-3 rounded-xl hover:scale-105 transition"
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

export default RefundPolicy;