
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/common/PageHeader";
import { BranchCard } from "@/components/branches/BranchCard";
import { useAllBranches } from "@/hooks/useBranches";
import { useRegions } from "@/hooks/useRegions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  ArrowDownAZ, 
  ArrowUpAZ, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  SortDesc, 
  Star 
} from "lucide-react";
import { Branch } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { RegionFilter } from "@/components/filters/RegionFilter";

type SortField = "name" | "city" | "regionName" | "averageRating" | "reviewCount";
type SortDirection = "asc" | "desc";

export default function BranchesPage() {
  const { data: branches, isLoading: branchesLoading } = useAllBranches();
  const { data: regions, isLoading: regionsLoading } = useRegions();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegionId, setSelectedRegionId] = useState<string | undefined>(undefined);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  
  // Current page state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const branchesPerPage = 9;
  
  // Filter branches based on search query and selected region
  const filteredBranches = branches?.filter(branch => {
    const matchesSearch = 
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRegion = selectedRegionId 
      ? branch.regionId === selectedRegionId
      : true;
    
    return matchesSearch && matchesRegion;
  });
  
  // Sort branches based on sort field and direction
  const sortedBranches = [...(filteredBranches || [])].sort((a, b) => {
    if (sortField === "name" || sortField === "city" || sortField === "regionName") {
      return sortDirection === "asc" 
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField]);
    } else {
      const aValue = a[sortField];
      const bValue = b[sortField];
      return sortDirection === "asc" 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    }
  });
  
  // Calculate pagination
  const totalPages = Math.ceil((sortedBranches?.length || 0) / branchesPerPage);
  const startIndex = (currentPage - 1) * branchesPerPage;
  const paginatedBranches = sortedBranches?.slice(startIndex, startIndex + branchesPerPage);
  
  // Toggle sort direction or change sort field
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    // Reset to first page when sorting changes
    setCurrentPage(1);
  };
  
  // Helper to render sort icon
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    
    if (field === "name" || field === "city" || field === "regionName") {
      return sortDirection === "asc" ? <ArrowDownAZ className="h-4 w-4" /> : <ArrowUpAZ className="h-4 w-4" />;
    } else {
      return <SortDesc className={`h-4 w-4 ${sortDirection === "desc" ? "" : "rotate-180"}`} />;
    }
  };
  
  return (
    <Layout>
      <PageHeader 
        title="Branches" 
        description="View and analyze all branches across regions"
      />
      
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search branches..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="pl-9 w-full md:w-[300px]"
            />
          </div>
          
          <div className="w-full md:w-[220px]">
            {regions && (
              <RegionFilter
                regions={regions}
                selectedRegionId={selectedRegionId}
                onChange={(regionId) => {
                  setSelectedRegionId(regionId);
                  setCurrentPage(1); // Reset to first page on region change
                }}
                isLoading={regionsLoading}
              />
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort("name")}
            className="flex items-center gap-1"
          >
            Name {getSortIcon("name")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort("regionName")}
            className="flex items-center gap-1"
          >
            Region {getSortIcon("regionName")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort("averageRating")}
            className="flex items-center gap-1"
          >
            Rating {getSortIcon("averageRating")}
          </Button>
        </div>
      </div>
      
      {branchesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[200px] w-full" />
          ))}
        </div>
      ) : paginatedBranches?.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h3 className="text-lg font-medium">No branches found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search query or filters
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {paginatedBranches?.map((branch) => (
              <BranchCard key={branch.id} branch={branch} />
            ))}
          </div>
          
          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
