"use client";

import { motion } from 'framer-motion';
import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingHero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 md:py-24 lg:py-32">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 left-10 w-48 h-48 md:w-72 md:h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-48 h-48 md:w-72 md:h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative container mx-auto px-4">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-block mb-4 md:mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-blue-100 text-blue-700 text-xs md:text-sm font-medium">
              <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
              Smart Financial Management
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight px-4"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Duwitpedia
            </span>
            <br />
            Manage Your Finances Smarter & Easier
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto px-4"
          >
            Track expenses, manage budgets, and gain insights into your financial health
            with powerful analytics and intuitive reports.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4"
          >
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium text-base md:text-lgshadow-lg hover:shadow-xl transition-shadow"
              >
                Get Started
                <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </Link>
            <Link href="/login/demo" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto text-base md:text-lg border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              >
                Start Demo
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
