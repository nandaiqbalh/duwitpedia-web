// Account Service - API calls for account management

const BASE_URL = '/api/accounts';

export const accountService = {
  // Get all accounts
  async getAccounts(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', params.page);
    if (params.limit) searchParams.set('limit', params.limit);
    if (params.search) searchParams.set('search', params.search);

    const response = await fetch(`${BASE_URL}?${searchParams}`);
    return response.json();
  },

  // Get single account
  async getAccount(id) {
    const response = await fetch(`${BASE_URL}/${id}`);
    return response.json();
  },

  // Create account
  async createAccount(data) {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Update account
  async updateAccount(id, data) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Delete account (soft delete)
  async deleteAccount(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};
