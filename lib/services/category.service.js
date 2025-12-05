// Category Service - API calls for category management

const BASE_URL = '/api/categories';

export const categoryService = {
  // Get all categories
  async getCategories(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', params.page);
    if (params.limit) searchParams.set('limit', params.limit);
    if (params.search) searchParams.set('search', params.search);
    if (params.type) searchParams.set('type', params.type);

    const response = await fetch(`${BASE_URL}?${searchParams}`);
    return response.json();
  },

  // Get single category
  async getCategory(id) {
    const response = await fetch(`${BASE_URL}/${id}`);
    return response.json();
  },

  // Create category
  async createCategory(data) {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Update category
  async updateCategory(id, data) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Delete category (soft delete)
  async deleteCategory(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};
