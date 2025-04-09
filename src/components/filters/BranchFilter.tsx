
import { Branch } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BranchFilterProps {
  branches: Branch[];
  selectedBranchId: string | undefined;
  onChange: (branchId: string | undefined) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function BranchFilter({
  branches,
  selectedBranchId,
  onChange,
  isLoading = false,
  disabled = false,
}: BranchFilterProps) {
  return (
    <Select
      value={selectedBranchId || "all"}
      onValueChange={(value) => onChange(value === "all" ? undefined : value)}
      disabled={isLoading || disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="All Branches" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Branches</SelectItem>
        {branches.map((branch) => (
          <SelectItem key={branch.id} value={branch.id}>
            {branch.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
