'use client';

import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

export function WalletFilters({
  searchInput,
  onSearchChange,
  onSearchSubmit,
  showFilters,
  onToggleFilters,
  filters,
  onFilterChange,
  accounts = [],
  loading = false,
  onClearFilters,
  activeFiltersCount,
}) {
  const handleAccountChange = (value) => {
    onFilterChange('accountId', value);
  };

  const handleClearFilters = () => {
    onClearFilters();
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex gap-2">
        <form onSubmit={onSearchSubmit} className="flex gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search wallets..."
              value={searchInput}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Search
          </Button>
        </form>
        <Button
          variant="outline"
          onClick={onToggleFilters}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Account Filter */}
            <div className="space-y-2">
              <Label htmlFor="account" className="text-sm font-medium text-gray-700">
                Account
              </Label>
              <Select
                value={filters.accountId || 'all'}
                onValueChange={handleAccountChange}
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
          </div>
        </Card>
      )}
    </div>
  );
}