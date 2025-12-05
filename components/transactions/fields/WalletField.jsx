'use client';

import { useState, useEffect } from 'react';
import { Plus, Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export function WalletField({
  label = 'Wallet',
  value,
  onChange,
  wallets = [],
  loading = false,
  disabled = false,
  error,
  required = true,
  onCreateNew,
  accountSelected = true,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedWallet = wallets.find(w => w.id === value);

  useEffect(() => {
    if (!open) {
      setSearch('');
    }
  }, [open]);

  return (
    <div className="space-y-2">
      <Label>{label} {required && '*'}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              error && "border-red-500"
            )}
            disabled={disabled || loading || !accountSelected}
          >
            {!accountSelected ? "Select account first" : 
             selectedWallet ? selectedWallet.name : "Select wallet..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Search wallet..." 
              value={search}
              onValueChange={setSearch}
            />
            <CommandEmpty>
              {loading ? (
                <div className="py-6 text-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">Searching...</p>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-sm text-gray-500 mb-3">
                    {!accountSelected 
                      ? "Select an account first" 
                      : "No wallets found for this account"}
                  </p>
                  {accountSelected && onCreateNew && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setOpen(false);
                        onCreateNew();
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Create Wallet
                    </Button>
                  )}
                </div>
              )}
            </CommandEmpty>
            <CommandGroup>
              {wallets.map((wallet) => (
                <CommandItem
                  key={wallet.id}
                  value={wallet.name}
                  onSelect={() => {
                    onChange(wallet.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === wallet.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {wallet.name}
                </CommandItem>
              ))}
              {wallets.length > 0 && onCreateNew && (
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    onCreateNew();
                  }}
                  className="border-t"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Wallet
                </CommandItem>
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
