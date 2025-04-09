
import { Region } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RegionFilterProps {
  regions: Region[];
  selectedRegionId: string | undefined;
  onChange: (regionId: string | undefined) => void;
  isLoading?: boolean;
}

export function RegionFilter({
  regions,
  selectedRegionId,
  onChange,
  isLoading = false,
}: RegionFilterProps) {
  return (
    <Select
      value={selectedRegionId || "all"}
      onValueChange={(value) => onChange(value === "all" ? undefined : value)}
      disabled={isLoading}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="All Regions" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Regions</SelectItem>
        {regions.map((region) => (
          <SelectItem key={region.id} value={region.id}>
            {region.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
