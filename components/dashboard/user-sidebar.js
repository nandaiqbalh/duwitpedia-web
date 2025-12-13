"use client";

import { Home, Wallet, CreditCard, PieChart, Settings, LogOut, FolderOpen, X, ChevronDown, ChevronRight, Tag, Target, Stars, BookOpen, Info } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useConfirmDialog } from "@/components/common";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Accounts", href: "/accounts", icon: FolderOpen },
  { name: "Transactions", href: "/transactions", icon: CreditCard },
  { name: "Reports", href: "/reports", icon: PieChart },
  { name: "Budgeting", href: "#", icon: BookOpen, comingSoon: true },
  { name: "Saving Goals", href: "#", icon: Target, comingSoon: true },
  { name: "Smart Insights", href: "#", icon: Stars, comingSoon: true },
  {
    name: "Configuration",
    icon: Settings,
    submenu: [
      { name: "Wallets", href: "/wallets", icon: Wallet },
      { name: "Categories", href: "/categories", icon: Tag },
    ]
  },
];

export function UserSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { ConfirmDialog, showConfirm } = useConfirmDialog();
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState('');

  const getFeatureDescription = (feature) => {
    switch (feature) {
      case 'Budgeting':
        return {
          description: "Create and manage budgets for different categories of your expenses. Set spending limits, track your progress, and get alerts when you're approaching your budget limits. Perfect for controlling spending and achieving financial goals.",
          benefits: "Helps you avoid overspending, understand where your money goes, and make informed financial decisions."
        };
      case 'Saving Goals':
        return {
          description: "Set specific savings targets with timelines and track your progress towards financial milestones. Whether it's for an emergency fund, vacation, or a big purchase, our saving goals feature will help you stay motivated and on track.",
          benefits: "Motivates consistent saving habits, visualizes progress, and celebrates achievements when goals are reached."
        };
      case 'Smart Insights':
        return {
          description: "Get intelligent analysis of your spending patterns, income trends, and financial health. Receive personalized recommendations, detect unusual transactions, and discover opportunities to optimize your finances.",
          benefits: "Provides data-driven insights, helps identify trends, and offers actionable recommendations for better financial management."
        };
      default:
        return {
          description: "This exciting feature is coming soon to help you manage your finances better.",
          benefits: "Stay tuned for updates!"
        };
    }
  };

  // If current pathname belongs to a submenu, keep that parent open and lock it (cannot be collapsed)
  const activeParent = navigation.find((item) =>
    item.submenu && item.submenu.some((sub) => sub.href === pathname)
  )?.name || null;

  useEffect(() => {
    if (activeParent) {
      setOpenSubmenu(activeParent);
    }
  }, [activeParent]);

  // Close mobile menu when route changes
  useEffect(() => {
    onClose?.();
  }, [pathname, onClose]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleSubmenu = (menuName) => {
    setOpenSubmenu(openSubmenu === menuName ? null : menuName);
  };

  const sidebarVariants = {
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  };

  const overlayVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.2
      }
    }
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <Wallet className="w-8 h-8 text-blue-600" />
        <span className="ml-2 text-xl font-semibold text-gray-900">Duwitpedia</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const hasSubmenu = item.submenu;
          const isSubmenuOpen = openSubmenu === item.name;

          if (hasSubmenu) {
            return (
              <div key={item.name}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleSubmenu(item.name);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    activeParent === item.name
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </div>
                  {isSubmenuOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                {/* Submenu */}
                {isSubmenuOpen && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.submenu.map((subItem) => {
                      const isSubActive = pathname === subItem.href;
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            isSubActive
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          )}
                        >
                          <subItem.icon className="h-4 w-4" />
                          {subItem.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return item.comingSoon ? (
            <div
              key={item.name}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 bg-gray-50 cursor-not-allowed"
            >
              <item.icon className="h-5 w-5" />
              {item.name}
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => {
                    setComingSoonFeature(item.name);
                    setShowComingSoon(true);
                    onClose?.();
                  }}
                  className="cursor-pointer group relative p-1 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                  aria-label="Show information"
                >
                  <Info className="w-4 h-4" />
                  <span className="absolute -top-8 right-0 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Click for info
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>     
    </>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex fixed inset-y-0 left-0 h-screen w-64 flex-col border-r border-gray-200 bg-white z-30">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="lg:hidden fixed inset-y-0 left-0 z-[70] w-64 flex flex-col border-r border-gray-200 bg-white shadow-xl"
          >
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all z-20"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>

            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Dialog */}
      <ConfirmDialog />

      {/* Coming Soon Dialog */}
      <Dialog open={showComingSoon} onOpenChange={setShowComingSoon}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Stars className="w-6 h-6 text-blue-500" />
              </div>
              {comingSoonFeature} - Coming Soon
            </DialogTitle>
          </DialogHeader>

          <DialogDescription asChild>
            <div className="text-sm text-gray-700 space-y-3">
              <p>
                {getFeatureDescription(comingSoonFeature).description}
              </p>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="font-medium text-blue-900 mb-1">Benefits:</p>
                <p className="text-blue-800">
                  {getFeatureDescription(comingSoonFeature).benefits}
                </p>
              </div>
              <p className="text-gray-600">
                We're working hard to bring this feature to you. Stay tuned for updates!
              </p>
            </div>
          </DialogDescription>

          <DialogFooter>
            <button
              onClick={() => setShowComingSoon(false)}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Got it
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}