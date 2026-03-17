'use client';

import React, { useState } from 'react';

const faqs = [
  {
    question: 'What is included in the Premium Membership?',
    answer:
      'Premium membership gives you access to unlimited investment posts, secure messaging, verified investors, advanced filters, and priority support.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Yes, you can cancel your subscription at any time. There are no hidden fees or long-term commitments.',
  },
  {
    question: 'Is my identity protected?',
    answer:
      'Absolutely. We provide anonymous identity protection to ensure your privacy and safety.',
  },
  {
    question: 'Do I need KYC verification?',
    answer:
      'Yes, KYC verification is required to ensure a trusted and secure investor network.',
  },
  {
    question: 'How does the investor network work?',
    answer:
      'You get access to a verified network where you can connect, communicate, and explore investment opportunities.',
  },
  {
    question: 'Will I receive notifications?',
    answer:
      'Yes, you will receive email notifications for important updates and activities.',
  },
];

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 md:pt-36 pb-12 bg-gradient-to-b from-black to-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif text-white mb-6">
            Frequently Asked <span className="text-primary">Questions</span>
          </h1>
          <p className="text-xl text-gray-300">
            Everything you need to know about our platform
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pb-20">
        <div className="max-w-3xl mx-auto px-4 md:px-6 space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-white/10 rounded-xl bg-[#111111]"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-5 text-left"
              >
                <span className="text-white text-lg font-medium">
                  {faq.question}
                </span>
                <span className="text-primary text-xl">
                  {activeIndex === index ? '-' : '+'}
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  activeIndex === index ? 'max-h-40 p-5 pt-0' : 'max-h-0'
                }`}
              >
                <p className="text-gray-400">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FAQPage;