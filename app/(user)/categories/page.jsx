'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader, CommonPagination, useConfirmDialog, ErrorState } from '@/components/common';
import { CategoryTable } from '@/components/categories/category-table';
import { CategoryFormDialog } from '@/components/categories/category-form-dialog';
import { useCategories, useCategoryMutations } from '@/lib/hooks/useCategory';
import { toast } from 'sonner';

export default function CategoriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const { ConfirmDialog, showConfirm } = useConfirmDialog();

  const {
    categories,
    pagination,
    loading,
    error,
    refetch,
  } = useCategories({
    page,
    search: searchInput,
    type: typeFilter,
  });

  const {
    createCategory,
    updateCategory,
    deleteCategory,
    loading: mutationLoading,
  } = useCategoryMutations();

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
  };

  const handleTypeFilterChange = (value) => {
    const actualValue = value === 'all' ? '' : value;
    setTypeFilter(actualValue);
    setPage(1); // Reset to first page when filtering
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleSubmit = async (data) => {
    let result;
    if (editingCategory) {
      result = await updateCategory(editingCategory.id, data);
    } else {
      result = await createCategory(data);
    }

    if (result.success) {
      toast.success(
        editingCategory
          ? 'Category updated successfully'
          : 'Category created successfully'
      );
      setShowForm(false);
      setEditingCategory(null);
      refetch();
    } else {
      toast.error(result.error || 'Something went wrong');
    }
  };

  const handleDelete = async (category) => {
    const confirmed = await showConfirm({
      title: 'Delete Category',
      message: `Are you sure you want to delete "${category.name}"? This action cannot be undone.`,
      variant: 'danger',
      confirmText: 'Delete',
    });

    if (confirmed) {
      const result = await deleteCategory(category.id);
      if (result.success) {
        toast.success('Category deleted successfully');
        refetch();
      } else {
        toast.error(result.error || 'Failed to delete category');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Categories"
        description="Manage your transaction categories"
        infoContent={
          <div className="space-y-2">
            <p>
              Categories help you group your transactions so you can understand where
              your money comes from and where it goes. Categories are divided into two
              main types:
            </p>

            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Income Categories</strong> (money you earn)</li>
              <li><strong>Expense Categories</strong> (money you spend)</li>
            </ul>

            <p>
              Examples of <strong>Income Categories</strong> include:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Gaji</li>
              <li>Freelance</li>
              <li>Bisnis</li>
            </ul>

            <p>
              Examples of <strong>Expense Categories</strong> include:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Makanan & Minuman</li>
              <li>Transportasi</li>
              <li>Langganan (subscriptions)</li>
              <li>Belanja</li>
              <li>Hiburan</li>
            </ul>

            <p>
              By organizing transactions into categories, you can easily see how much
              you spend in each area, identify spending patterns, and make better
              financial decisions.
            </p>
          </div>
        }
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Categories' },
        ]}
        actions={
          <Button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        }
      />

      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="mb-6">
        <div className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search categories..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Search
          </Button>
        </div>
      </form>

      {/* Type Filter */}
      <div className="mb-6">
        <Select value={typeFilter || 'all'} onValueChange={handleTypeFilterChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
            <SelectItem value="transfer">Transfer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <CategoryTable
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          currentPage={pagination.page}
          itemsPerPage={pagination.limit}
        />

        {/* Pagination */}
        {!loading && (
          <div className="px-4 py-4 border-t">
            <CommonPagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
              onPageChange={setPage}
              itemLabel="categories"
            />
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <ErrorState
          title="Failed to load categories"
          description={error}
          actionLabel="Try Again"
          actionOnClick={() => refetch()}
          className="mt-4"
        />
      )}

      {/* Form Dialog */}
      <CategoryFormDialog
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingCategory(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingCategory}
        loading={mutationLoading}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog />
    </div>
  );
}