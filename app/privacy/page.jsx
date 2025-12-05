"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, Lock, AlertTriangle, Eye, FileText, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  const sections = [
    {
      icon: Shield,
      title: "Data Security Commitment",
      content: "Duwitpedia upholds strong principles of data security and user privacy. We understand that financial information is highly sensitive and personal data. Therefore, we are committed to protecting your data with industry-standard security measures."
    },
    {
      icon: Eye,
      title: "No Data Collection",
      content: "Duwitpedia does not collect, store on external servers, or sell your personal and financial data to any third parties. All data you input is stored locally and can only be accessed by you through your account."
    },
    {
      icon: Lock,
      title: "Encryption and Protection",
      content: "Your data is protected with industry-standard encryption. We use modern security protocols to ensure your information remains secure. However, security is a shared responsibility between the platform and users."
    },
    {
      icon: AlertTriangle,
      title: "Important Warning",
      content: "Although we implement high security standards, we STRONGLY RECOMMEND NOT storing highly important or high-risk credentials such as ATM PINs, internet banking passwords, or complete credit card information. Use this platform for transaction recording and financial management, not for storing access credentials."
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <Link href="/" className="text-xl md:text-2xl font-bold text-blue-600">
            Duwitpedia
          </Link>
          <Link href="/">
            <Button variant="outline" className="text-sm md:text-base">Back to Home</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded-full mb-4 md:mb-6">
            <FileText className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
            Privacy Policy
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Duwitpedia Privacy Policy and Data Security
          </p>
          <p className="text-xs md:text-sm text-gray-500 mt-3 md:mt-4">
            Last updated: December 5, 2025
          </p>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 pb-12 md:pb-16">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 md:p-8 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2 md:mb-3">
                        {section.title}
                      </h2>
                      <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="container mx-auto px-4 pb-12 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="p-6 md:p-8 bg-red-50 border-red-200">
            <h2 className="text-xl md:text-2xl font-semibold text-red-900 mb-3 md:mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 md:w-6 md:h-6" />
              Disclaimer and Limitation of Liability
            </h2>
            <div className="space-y-3 md:space-y-4 text-red-800">
              <p className="text-sm md:text-base leading-relaxed">
                Duwitpedia is provided "as is" without any warranties, either express or implied. 
                By using this platform, you understand and agree that:
              </p>
              <ul className="list-disc list-inside space-y-1.5 md:space-y-2 pl-2 md:pl-4 text-sm md:text-base">
                <li>Use of this platform is entirely at your own risk</li>
                <li>We are not responsible for any data loss, damage, or losses arising from the use of the platform</li>
                <li>All risks related to data and information security are the user's responsibility</li>
                <li>We do not guarantee that this platform is error-free or will always be available</li>
                <li>Financial decisions you make based on data in this platform are entirely your responsibility</li>
              </ul>
              <p className="text-sm md:text-base leading-relaxed font-semibold mt-4 md:mt-6">
                By using Duwitpedia, you agree that the developers and contributors of this platform 
                are not responsible for any loss, damage, or consequences arising from 
                the use or inability to use this platform.
              </p>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Authentication Information */}
      <section className="container mx-auto px-4 pb-12 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">
              Authentication Information
            </h2>
            <div className="space-y-3 md:space-y-4 text-gray-600">
              <p className="text-sm md:text-base leading-relaxed">
                Duwitpedia provides two authentication methods:
              </p>
              <ul className="list-disc list-inside space-y-1.5 md:space-y-2 pl-2 md:pl-4 text-sm md:text-base">
                <li><strong>Google OAuth:</strong> We use Google OAuth for authentication. We only receive basic profile information (name and email) from Google and do not access any other data from your Google account.</li>
                <li><strong>Email & Password:</strong> For email and password authentication, your password is stored with hash encryption using the bcrypt algorithm. We never store your password in plain text.</li>
              </ul>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Open Source Notice */}
      <section className="container mx-auto px-4 pb-12 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="p-6 md:p-8 bg-green-50 border-green-200">
            <h2 className="text-xl md:text-2xl font-semibold text-green-900 mb-3 md:mb-4">
              Open Source & Usage License
            </h2>
            <div className="space-y-3 md:space-y-4 text-green-800">
              <p className="text-sm md:text-base leading-relaxed">
                Duwitpedia is an open-source project developed to help people 
                manage their personal finances. This platform:
              </p>
              <ul className="list-disc list-inside space-y-1.5 md:space-y-2 pl-2 md:pl-4 text-sm md:text-base">
                <li>Free to use for personal and non-commercial purposes</li>
                <li>Must not be used for commercial purposes without permission</li>
                <li>Source code can be viewed and studied for educational purposes</li>
                <li>Contributions from the community are highly welcomed and appreciated</li>
              </ul>
              <p className="text-sm md:text-base leading-relaxed font-semibold mt-3 md:mt-4">
                If you are interested in using Duwitpedia for commercial purposes or have questions 
                about licensing, please contact us.
              </p>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 pb-12 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="max-w-4xl mx-auto text-center"
        >
          <Card className="p-6 md:p-8">
            <Mail className="w-10 h-10 md:w-12 md:h-12 text-blue-600 mx-auto mb-3 md:mb-4" />
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">
              Questions or Concerns?
            </h2>
            <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 px-4">
              If you have any questions about this privacy policy or concerns about 
              your data security, please contact us:
            </p>
            <a 
              href="mailto:nandaiqbalhanafii@gmail.com"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-base md:text-lg break-all"
            >
              <Mail className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
              nandaiqbalhanafii@gmail.com
            </a>
            <p className="text-xs md:text-sm text-gray-500 mt-3 md:mt-4">
              Nanda Iqbal Hanafi - Developer
            </p>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-6 md:py-8 text-center">
          <p className="text-gray-600 text-xs md:text-sm">
            &copy; 2025 Duwitpedia. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Open source & free for non-commercial use
          </p>
        </div>
      </footer>
    </div>
  );
}
