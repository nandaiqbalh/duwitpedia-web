// Dashboard Service - API calls for dashboard data

const BASE_URL = '/api/dashboard';

export const dashboardService = {
  // Get dashboard data (stats, insights, recent transactions)
  async getDashboardData() {
    const response = await fetch(BASE_URL);
    return response.json();
  },
};
