// Transaction Service - API calls for transaction management

const BASE_URL = '/api/transactions';

export const transactionService = {
  // Get all transactions with filters
  async getTransactions(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', params.page);
    if (params.limit) searchParams.set('limit', params.limit);
    if (params.search) searchParams.set('search', params.search);
    if (params.type) searchParams.set('type', params.type);
    if (params.accountId) searchParams.set('accountId', params.accountId);
    if (params.walletId) searchParams.set('walletId', params.walletId);
    if (params.categoryId) searchParams.set('categoryId', params.categoryId);
    if (params.startDate) searchParams.set('startDate', params.startDate);
    if (params.endDate) searchParams.set('endDate', params.endDate);

    console.log('Transaction service params:', params);

    const response = await fetch(`${BASE_URL}?${searchParams}`);
    return response.json();
  },

  // Get single transaction
  async getTransaction(id) {
    const response = await fetch(`${BASE_URL}/${id}`);
    return response.json();
  },

  // Create transaction
  async createTransaction(data) {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Update transaction
  async updateTransaction(id, data) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Delete transaction (soft delete)
  async deleteTransaction(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};
