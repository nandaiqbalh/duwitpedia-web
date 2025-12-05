"use client";

import { Home, Wallet, CreditCard, PieChart, Settings, LogOut, FolderOpen, X, ChevronDown, ChevronRight, Tag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useConfirmDialog } from "@/components/common";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Accounts", href: "/accounts", icon: FolderOpen },
  { name: "Transactions", href: "/transactions", icon: CreditCard },
  { name: "Reports", href: "/reports", icon: PieChart },
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

  const handleSignOut = async () => {
    const confirmed = await showConfirm({
      title: "Sign Out",
      message: "Are you sure you want to sign out from your account?",
      variant: "warning",
      confirmText: "Yes, Sign Out",
      cancelText: "Cancel",
    });

    if (confirmed) {
      await signOut({ callbackUrl: "/" });
    }
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

          return (
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

      {/* Logout */}
      <div className="border-t border-gray-200 p-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
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
    </>
  );
}