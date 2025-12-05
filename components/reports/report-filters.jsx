'use client';

import { useState } from 'react';
import { Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

export function ReportFilters({ 
  filters, 
  onFilterChange, 
  accounts = [], 
  wallets = [], 
  categories = [],
  loading = false 
}) {
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const handlePeriodChange = (value) => {
    setShowCustomRange(value === 'custom');
    onFilterChange('period', value);
  };

  const handleStartDateSelect = (date) => {
    onFilterChange('startDate', date ? format(date, 'yyyy-MM-dd') : '');
    setStartDateOpen(false);
  };

  const handleEndDateSelect = (date) => {
    onFilterChange('endDate', date ? format(date, 'yyyy-MM-dd') : '');
    setEndDateOpen(false);
  };

  const startDateValue = filters.startDate ? new Date(filters.startDate) : undefined;
  const endDateValue = filters.endDate ? new Date(filters.endDate) : undefined;

  return (
    <Card className="p-4 md:p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Period Filter */}
        <div className="space-y-2">
          <Label htmlFor="period" className="text-sm font-medium text-gray-700">
            Period
          </Label>
          <Select 
            value={filters.period} 
            onValueChange={handlePeriodChange}
            disabled={loading}
          >
            <SelectTrigger id="period" className="w-full">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">This Month</SelectItem>
              <SelectItem value="weekly">This Week</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Month Selector (for custom single month) */}
        {filters.period === 'custom' && !showCustomRange && (
          <div className="space-y-2">
            <Label htmlFor="month" className="text-sm font-medium text-gray-700">
              Month
            </Label>
            <Input
              id="month"
              type="month"
              value={filters.month}
              onChange={(e) => onFilterChange('month', e.target.value)}
              disabled={loading}
              className="w-full"
            />
          </div>
        )}

        {/* Custom Date Range */}
        {showCustomRange && (
          <>
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                Start Date
              </Label>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-white"
                    disabled={loading}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {filters.startDate ? format(startDateValue, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={startDateValue}
                    onSelect={handleStartDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                End Date
              </Label>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-white"
                    disabled={loading}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {filters.endDate ? format(endDateValue, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={endDateValue}
                    onSelect={handleEndDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </>
        )}

        {/* Account Filter */}
        <div className="space-y-2">
          <Label htmlFor="account" className="text-sm font-medium text-gray-700">
            Account
          </Label>
          <Select 
            value={filters.accountId || 'all'} 
            onValueChange={(value) => onFilterChange('accountId', value)}
            disabled={loading}
          >
            <SelectTrigger id="account" className="w-full">
              <SelectValue placeholder="All Accounts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Wallet Filter */}
        <div className="space-y-2">
          <Label htmlFor="wallet" className="text-sm font-medium text-gray-700">
            Wallet
          </Label>
          <Select 
            value={filters.walletId || 'all'} 
            onValueChange={(value) => onFilterChange('walletId', value)}
            disabled={loading}
          >
            <SelectTrigger id="wallet" className="w-full">
              <SelectValue placeholder="All Wallets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Wallets</SelectItem>
              {wallets.map((wallet) => (
                <SelectItem key={wallet.id} value={wallet.id}>
                  {wallet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium text-gray-700">
            Category
          </Label>
          <Select 
            value={filters.categoryId || 'all'} 
            onValueChange={(value) => onFilterChange('categoryId', value)}
            disabled={loading}
          >
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name} ({category.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
