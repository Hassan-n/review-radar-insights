
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/common/PageHeader";
import { RegionCard } from "@/components/regions/RegionCard";
import { useRegions } from "@/hooks/useRegions";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDownAZ, ArrowUpAZ, SortDesc, Star } from "lucide-react";
import { Region } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

type SortField = "name" | "branchCount" | "reviewCount" | "averageRating";
type SortDirection = "asc" | "desc";

export default function RegionsPage() {
  const { data: regions, isLoading } = useRegions();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  
  // Filter regions based on search query
  const filteredRegions = regions?.filter(region => 
    region.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort regions based on sort field and direction
  const sortedRegions = [...(filteredRegions || [])].sort((a, b) => {
    if (sortField === "name") {
      return sortDirection === "asc" 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else {
      const aValue = a[sortField];
      const bValue = b[sortField];
      return sortDirection === "asc" 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    }
  });
  
  // Toggle sort direction or change sort field
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  // Helper to render sort icon
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    
    if (sortDirection === "asc") {
      return field === "name" ? <ArrowDownAZ className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />;
    } else {
      return field === "name" ? <ArrowUpAZ className="h-4 w-4" /> : <SortDesc className="h-4 w-4 rotate-180" />;
    }
  };
  
  return (
    <Layout>
      <PageHeader 
        title="Regions" 
        description="Explore all regions and their performance metrics"
      />
      
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full md:w-[300px]">
          <Input
            placeholder="Search regions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
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
            onClick={() => handleSort("branchCount")}
            className="flex items-center gap-1"
          >
            Branches {getSortIcon("branchCount")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort("reviewCount")}
            className="flex items-center gap-1"
          >
            Reviews {getSortIcon("reviewCount")}
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
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[200px]">
              <Skeleton className="h-full w-full" />
            </div>
          ))}
        </div>
      ) : sortedRegions?.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h3 className="text-lg font-medium">No regions found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search query
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRegions?.map((region) => (
            <RegionCard key={region.id} region={region} />
          ))}
        </div>
      )}
    </Layout>
  );
}
