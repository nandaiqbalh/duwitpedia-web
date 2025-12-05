"use client";

import { Card } from "@/components/ui/card";
import { Plus, Wallet, Tags, CreditCard, BarChart3 } from "lucide-react";
import Link from "next/link";

export function DashboardQuickActions() {
  const actions = [
    {
      href: "/transactions",
      icon: Plus,
      label: "New Transaction",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100",
    },
    {
      href: "/accounts",
      icon: CreditCard,
      label: "Manage Accounts",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      hoverColor: "hover:bg-purple-100",
    },
    {
      href: "/wallets",
      icon: Wallet,
      label: "Manage Wallets",
      color: "text-green-600",
      bgColor: "bg-green-50",
      hoverColor: "hover:bg-green-100",
    },
    {
      href: "/categories",
      icon: Tags,
      label: "Manage Categories",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      hoverColor: "hover:bg-orange-100",
    },
    {
      href: "/reports",
      icon: BarChart3,
      label: "See Reports",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      hoverColor: "hover:bg-indigo-100",
    },
  ];

  return (
    <div className="mb-6">
      <h2 className="text-base font-semibold text-gray-900 mb-3">Quick Actions</h2>
      
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {actions.map((action) => (
          <Card 
            key={action.href} 
            className={`border-gray-200 ${action.bgColor} ${action.hoverColor} transition-all cursor-pointer`}
          >
            <Link href={action.href} className="block p-4">
              <div className="flex flex-col items-center text-center gap-2">
                <action.icon className={`h-6 w-6 ${action.color}`} />
                <span className="text-xs font-medium text-gray-900">{action.label}</span>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}

