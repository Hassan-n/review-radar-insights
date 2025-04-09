
import { getAllBranches, getBranchById, getBranchesByRegion, searchBranches } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useAllBranches() {
  return useQuery({
    queryKey: ["branches"],
    queryFn: getAllBranches,
  });
}

export function useBranch(id?: string) {
  return useQuery({
    queryKey: ["branch", id],
    queryFn: () => getBranchById(id!),
    enabled: !!id,
  });
}

export function useRegionBranches(regionId?: string) {
  return useQuery({
    queryKey: ["regionBranches", regionId],
    queryFn: () => getBranchesByRegion(regionId!),
    enabled: !!regionId,
  });
}

export function useBranchSearch(query: string) {
  return useQuery({
    queryKey: ["branchSearch", query],
    queryFn: () => searchBranches(query),
    enabled: query.length > 2,
  });
}
