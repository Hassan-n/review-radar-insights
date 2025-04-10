
import { getRecentReviews, getReviews, getReviewsByBranch } from "@/api";
import { FilterOptions, Review } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useReviews(page: number, pageSize: number, filters?: FilterOptions) {
  return useQuery({
    queryKey: ["reviews", page, pageSize, filters],
    queryFn: () => getReviews(page, pageSize, filters),
  });
}

export function useBranchReviews(
  branchId: string, 
  filters?: FilterOptions,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["branchReviews", branchId, filters],
    queryFn: () => getReviewsByBranch(branchId, filters),
    enabled: options?.enabled,
  });
}

export function useRecentReviews(limit: number = 5) {
  return useQuery({
    queryKey: ["recentReviews", limit],
    queryFn: () => getRecentReviews(limit),
  });
}
