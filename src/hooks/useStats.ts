
import { getDashboardStatistics } from "@/api";
import { FilterOptions } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useDashboardStats(filters?: FilterOptions) {
  return useQuery({
    queryKey: ["dashboardStats", filters],
    queryFn: () => getDashboardStatistics(filters),
  });
}
