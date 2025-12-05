// Report Service - API calls for financial reports

const BASE_URL = '/api/reports';

export const reportService = {
  // Get financial reports with filters
  async getReports(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.period) searchParams.set('period', params.period);
    if (params.month) searchParams.set('month', params.month);
    if (params.startDate) searchParams.set('startDate', params.startDate);
    if (params.endDate) searchParams.set('endDate', params.endDate);
    if (params.year) searchParams.set('year', params.year);
    if (params.accountId) searchParams.set('accountId', params.accountId);
    if (params.walletId) searchParams.set('walletId', params.walletId);
    if (params.categoryId) searchParams.set('categoryId', params.categoryId);

    const response = await fetch(`${BASE_URL}?${searchParams}`);
    return response.json();
  },
};
