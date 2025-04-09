
import { getDashboardStatistics } from "@/api";
import { FilterOptions } from "@/types";
import { useQuery } from "@tanstack/react-query";

// Export the useDashboardStats function
export function useDashboardStats(filters?: FilterOptions) {
  return useQuery({
    queryKey: ["dashboardStats", filters],
    queryFn: () => getDashboardStatistics(filters),
  });
}

// Add the useStats alias function for compatibility with ReportBuilder component
export function useStats(filters?: FilterOptions) {
  return useDashboardStats(filters);
}
