
import { Branch, DashboardStats, FilterOptions, Region, Review } from "@/types";
import { branches, getDashboardStats, regions, reviews } from "./mockData";

// Simulates API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get all regions
export const getRegions = async (): Promise<Region[]> => {
  await delay(800);
  return [...regions];
};

// Get region by code
export const getRegionByCode = async (code: string): Promise<Region | undefined> => {
  await delay(600);
  return regions.find(region => region.code === code);
};

// Get branches by region
export const getBranchesByRegion = async (regionId: string): Promise<Branch[]> => {
  await delay(700);
  return branches.filter(branch => branch.regionId === regionId);
};

// Get all branches
export const getAllBranches = async (): Promise<Branch[]> => {
  await delay(800);
  return [...branches];
};

// Get branch by id
export const getBranchById = async (id: string): Promise<Branch | undefined> => {
  await delay(600);
  return branches.find(branch => branch.id === id);
};

// Search branches
export const searchBranches = async (query: string): Promise<Branch[]> => {
  await delay(700);
  const lowerCaseQuery = query.toLowerCase();
  return branches.filter(
    branch => 
      branch.name.toLowerCase().includes(lowerCaseQuery) ||
      branch.city.toLowerCase().includes(lowerCaseQuery) ||
      branch.address.toLowerCase().includes(lowerCaseQuery)
  );
};

// Get reviews by branch
export const getReviewsByBranch = async (branchId: string): Promise<Review[]> => {
  await delay(800);
  return reviews
    .filter(review => review.branchId === branchId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get all reviews with pagination and filtering
export const getReviews = async (
  page: number = 1, 
  pageSize: number = 10,
  filters?: FilterOptions
): Promise<{reviews: Review[], totalCount: number}> => {
  await delay(1000);
  
  let filteredReviews = [...reviews];
  
  // Apply filters if provided
  if (filters) {
    if (filters.regionId) {
      const regionBranches = branches.filter(branch => branch.regionId === filters.regionId);
      const branchIds = regionBranches.map(branch => branch.id);
      filteredReviews = filteredReviews.filter(review => branchIds.includes(review.branchId));
    }
    
    if (filters.branchId) {
      filteredReviews = filteredReviews.filter(review => review.branchId === filters.branchId);
    }
    
    if (filters.rating && filters.rating.length > 0) {
      filteredReviews = filteredReviews.filter(review => filters.rating!.includes(review.rating));
    }
    
    if (filters.sentiment && filters.sentiment.length > 0) {
      filteredReviews = filteredReviews.filter(review => filters.sentiment!.includes(review.sentiment));
    }
    
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      filteredReviews = filteredReviews.filter(review => {
        const reviewDate = new Date(review.date);
        return reviewDate >= start && reviewDate <= end;
      });
    }
    
    if (filters.timePeriod && filters.timePeriod !== 'all') {
      const today = new Date();
      let startDate = new Date();
      
      switch (filters.timePeriod) {
        case '7days':
          startDate.setDate(today.getDate() - 7);
          break;
        case '30days':
          startDate.setDate(today.getDate() - 30);
          break;
        case '90days':
          startDate.setDate(today.getDate() - 90);
          break;
        case '1year':
          startDate.setFullYear(today.getFullYear() - 1);
          break;
      }
      
      filteredReviews = filteredReviews.filter(review => {
        const reviewDate = new Date(review.date);
        return reviewDate >= startDate && reviewDate <= today;
      });
    }
  }
  
  // Sort by date, most recent first
  filteredReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Apply pagination
  const start = (page - 1) * pageSize;
  const paginatedReviews = filteredReviews.slice(start, start + pageSize);
  
  return {
    reviews: paginatedReviews,
    totalCount: filteredReviews.length
  };
};

// Get recent reviews
export const getRecentReviews = async (limit: number = 5): Promise<Review[]> => {
  await delay(600);
  return [...reviews]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};

// Get dashboard statistics
export const getDashboardStatistics = async (filters?: FilterOptions): Promise<DashboardStats> => {
  await delay(1200);
  // For simplicity, we'll return the same stats regardless of filters in this mock
  // In a real implementation, you would filter the data based on the provided filters
  return getDashboardStats();
};
