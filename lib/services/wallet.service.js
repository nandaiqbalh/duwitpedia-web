// Wallet Service - API calls for wallet management

const BASE_URL = '/api/wallets';

export const walletService = {
  // Get all wallets
  async getWallets(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', params.page);
    if (params.limit) searchParams.set('limit', params.limit);
    if (params.search) searchParams.set('search', params.search);
    if (params.accountId) searchParams.set('accountId', params.accountId);

    const response = await fetch(`${BASE_URL}?${searchParams}`);
    return response.json();
  },

  // Get single wallet
  async getWallet(id) {
    const response = await fetch(`${BASE_URL}/${id}`);
    return response.json();
  },

  // Create wallet
  async createWallet(data) {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Update wallet
  async updateWallet(id, data) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Delete wallet (soft delete)
  async deleteWallet(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};
