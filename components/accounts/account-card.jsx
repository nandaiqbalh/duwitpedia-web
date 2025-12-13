'use client';

import { Wallet, Edit, Trash2, CreditCard, ChevronDown, ChevronUp, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Gradient colors for cards
const gradients = [
  'bg-gradient-to-br from-green-500 via-green-600 to-emerald-700',
  'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700',
  'bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600',
  'bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700',
  'bg-gradient-to-br from-orange-500 via-red-500 to-pink-600',
  'bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900',
  'bg-gradient-to-br from-amber-500 via-orange-600 to-red-600',
  'bg-gradient-to-br from-green-500 via-green-600 to-emerald-700',
  'bg-gradient-to-br from-red-500 via-red-600 to-rose-700',
  'bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700',
  'bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-700',
  'bg-gradient-to-br from-pink-500 via-pink-600 to-rose-700',
  'bg-gradient-to-br from-orange-500 via-orange-600 to-amber-700',
  'bg-gradient-to-br from-teal-500 via-teal-600 to-green-700',
  'bg-gradient-to-br from-violet-500 via-violet-600 to-purple-700',
  'bg-gradient-to-br from-lime-500 via-lime-600 to-green-700',
  'bg-gradient-to-br from-rose-500 via-rose-600 to-pink-700',
];

export function AccountCard({ account, onEdit, onDelete, index = 0 }) {
  const [showWallets, setShowWallets] = useState(false);
  const gradient = gradients[index % gradients.length];

  // Calculate total balance from wallets
  const totalBalance = account.wallets?.reduce((sum, wallet) => sum + (wallet.balance || 0), 0) || 0;

  // Format currency
  const formatCurrency = (amount, currency = 'IDR') => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="group relative">
      {/* Main Card */}
      <div className={cn(
        "relative overflow-hidden rounded-2xl shadow-lg",
        gradient
      )}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
        </div>

        {/* Card Content */}
        <div className="relative p-6 text-white">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="max-w-48 lg:max-w-64">
                <h3 className="text-xl font-bold truncate">{account.name}</h3>
                <p className="text-sm text-white/80">{account.type || 'Account'}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full bg-white/30 text-white hover:bg-white/40 border border-white/20"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onEdit(account)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(account)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Balance */}
          <div className="mb-4">
            <p className="text-sm text-white/70 mb-1">Total Balance</p>
            <p className="text-3xl font-bold tracking-tight">
              {formatCurrency(totalBalance, account.currency)}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                {account.currency}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                <Wallet className="w-3 h-3 mr-1" />
                {account.wallets?.length || 0} Wallets
              </Badge>
            </div>

            {account.wallets && account.wallets.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowWallets(!showWallets)}
                className="text-white hover:bg-white/20"
              >
                {showWallets ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Hide
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Show
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Wallets Section */}
      <AnimatePresence>
        {showWallets && account.wallets && account.wallets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            className="mt-4 space-y-2 overflow-hidden"
          >
            {account.wallets.map((wallet, walletIndex) => (
              <motion.div
                key={wallet.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.2,
                  delay: walletIndex * 0.1,
                  ease: [0.4, 0.0, 0.2, 1],
                }}
                className="bg-white rounded-lg shadow border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      gradient,
                      "bg-opacity-10"
                    )}>
                      <Wallet className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{wallet.name}</h4>
                      {wallet.description && (
                        <p className="text-sm text-gray-500">{wallet.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(wallet.balance || 0, account.currency)}
                    </p>
                    <p className="text-xs text-gray-500">Balance</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
