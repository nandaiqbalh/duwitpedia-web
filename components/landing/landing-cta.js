"use client";

import { motion } from 'framer-motion';
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-700 text-white">
      {/* Animated background circles */}
      <motion.div
        className="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.1, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative container mx-auto px-4 py-16 md:py-20">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 md:mb-6 px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Ready to Take Control of Your Finances?
          </motion.h2>
          
          <motion.p
            className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 text-blue-100 px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Join thousands of users managing their money better with Duwitpedia.
          </motion.p>

          {/* Features List */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10 text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[
              'Free to start',
              'Full access to all features',
              'Cancel anytime',
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-3 md:p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                <Check className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 text-green-300" />
                <span className="text-sm md:text-base text-white/90">{feature}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link href="/login" className="inline-block w-full sm:w-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white hover:bg-gray-100 text-blue-600 font-medium text-base md:text-lg px-6 md:px-8 py-5 md:py-6 shadow-2xl"
                >
                  Start Free Today <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </motion.div>
            </Link>
            <p className="mt-4 text-xs md:text-sm text-blue-100">
              No credit card required • Get started in 2 minutes
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
