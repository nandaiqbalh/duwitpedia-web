"use client";

import Link from "next/link";
import { Mail, Github, Heart } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Duwitpedia</h3>
            <p className="text-sm leading-relaxed">
              Open-source financial management platform designed to help you track your finances effectively.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-sm hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#faq" className="text-sm hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <Link href="/privacy" className="text-sm hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:nandaiqbalhanafii@gmail.com" className="hover:text-white transition-colors break-all">
                  nandaiqbalhanafii@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* License Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-center md:text-left">
              &copy; 2025 Duwitpedia. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>Open source & free for non-commercial use</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
