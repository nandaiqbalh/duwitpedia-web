"use client";

import { motion } from 'framer-motion';
import { 
  Wallet, 
  BarChart3, 
  Heart
} from "lucide-react";
import { Card } from "@/components/ui/card";

export function LandingFeatures() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const features = [
    {
      icon: Wallet,
      title: "Multi Account & Multi Wallet",
      description: "Manage multiple accounts and wallets in one place with real-time balance tracking.",
      color: "blue",
    },
    {
      icon: BarChart3,
      title: "Financial Tracking & Reports",
      description: "Track transactions with detailed categorization and generate comprehensive reports with charts.",
      color: "green",
    },
    {
      icon: Heart,
      title: "Smart Health Insight",
      description: "Get intelligent financial health analysis with key metrics and personalized recommendations.",
      color: "purple",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'hover:border-blue-600' },
      green: { bg: 'bg-green-100', text: 'text-green-600', border: 'hover:border-green-600' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'hover:border-purple-600' },
    };
    return colors[color] || colors.blue;
  };

  return (
    <section id="features" className="container mx-auto px-4 py-16 md:py-20 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 md:mb-16"
      >
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Powerful Features for Complete Financial Control
        </h2>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
          Everything you need to manage your finances efficiently and make informed decisions
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const colors = getColorClasses(feature.color);
          
          return (
            <motion.div key={index} variants={itemVariants}>
              <Card 
                className={`p-6 md:p-8 border-gray-200 ${colors.border} transition-all h-full hover:shadow-xl`}
              >
                <motion.div 
                  className={`${colors.bg} w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-4 md:mb-6`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Icon className={`w-7 h-7 md:w-8 md:h-8 ${colors.text}`} />
                </motion.div>
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2 md:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
