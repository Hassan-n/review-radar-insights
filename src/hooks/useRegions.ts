
import { getRegionByCode, getRegions } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useRegions() {
  return useQuery({
    queryKey: ["regions"],
    queryFn: getRegions,
  });
}

export function useRegion(code?: string) {
  return useQuery({
    queryKey: ["region", code],
    queryFn: () => getRegionByCode(code!),
    enabled: !!code,
  });
}
