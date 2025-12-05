"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function LandingFAQ() {
  const faqs = [
    {
      question: "What is Duwitpedia?",
      answer: "Duwitpedia is a personal financial management platform that helps you track transactions, manage multiple accounts and wallets, and gain insights into your financial health. The platform is built with a focus on ease of use and user data privacy."
    },
    {
      question: "Who is Duwitpedia for?",
      answer: "Duwitpedia is designed for anyone who wants to manage their personal finances better. Suitable for students, workers, freelancers, or anyone who wants to have more control over their spending and savings. No special accounting skills are required to use this platform."
    },
    {
      question: "Is Duwitpedia paid?",
      answer: "Currently no! Duwitpedia is developed as open-source and is available for free. This application is created with the aim of helping friends manage and track their finances more effectively at no additional cost."
    },
    {
      question: "What about my data security?",
      answer: "Data security is our top priority. Duwitpedia does not collect or sell your personal data. All data is stored with encryption and can only be accessed by you. However, we recommend not storing highly sensitive credential information such as ATM PINs or banking passwords."
    },
    {
      question: "What features are available?",
      answer: "Duwitpedia provides complete features for financial management: Multi Account & Multi Wallet to manage various accounts, Financial Tracking & Reports to track transactions and generate detailed reports, and Smart Health Insight that provides financial health analysis with metrics like savings rate and spending stability."
    },
    {
      question: "Can I use Duwitpedia for business?",
      answer: "Duwitpedia is designed for personal and non-commercial use. If you want to use this platform for business or commercial purposes, please contact us for further discussion regarding licensing and commercial use."
    },
    {
      question: "How to get started?",
      answer: "Very easy! Just click the 'Get Started' button on the main page, login using your Google account or email, then start adding your first account, wallet, and transaction. The platform is designed intuitively so you can start tracking your finances in minutes."
    }
  ];

  return (
    <section id="faq" className="container mx-auto px-4 py-16 md:py-20 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 md:mb-16"
      >
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
          Common questions about Duwitpedia
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-3xl mx-auto"
      >
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-gray-900">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base text-gray-600 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center mt-12"
      >
        <p className="text-sm md:text-base text-gray-600 mb-4">Still have questions?</p>
        <a 
          href="mailto:nandaiqbalhanafii@gmail.com"
          className="text-sm md:text-base text-blue-600 hover:text-blue-700 font-medium underline break-all"
        >
          Contact us
        </a>
      </motion.div>
    </section>
  );
}
