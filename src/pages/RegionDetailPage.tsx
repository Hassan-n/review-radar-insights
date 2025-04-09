
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/common/PageHeader";
import { useRegion } from "@/hooks/useRegions";
import { useRegionBranches } from "@/hooks/useBranches";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BranchCard } from "@/components/branches/BranchCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpDown, Star, Store } from "lucide-react";
import { useState } from "react";
import { Branch } from "@/types";

type SortField = "name" | "city" | "averageRating" | "reviewCount";
type SortDirection = "asc" | "desc";

export default function RegionDetailPage() {
  const { regionCode } = useParams<{ regionCode: string }>();
  const { data: region, isLoading: regionLoading } = useRegion(regionCode);
  const { data: branches, isLoading: branchesLoading } = useRegionBranches(region?.id);
  
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  
  // Sort branches based on sort field and direction
  const sortedBranches = [...(branches || [])].sort((a, b) => {
    if (sortField === "name" || sortField === "city") {
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
  
  // Toggle sort direction or change sort field
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  return (
    <Layout>
      <PageHeader 
        title={regionLoading ? "Loading..." : region?.name || "Region Not Found"} 
        description={region?.description || ""}
        backLink="/regions"
      />
      
      {regionLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[100px] w-full" />
          ))}
        </div>
      ) : region ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Branches</h3>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Store className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-2xl font-bold">{region.branchCount}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Average Rating</h3>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-2" />
                <span className="text-2xl font-bold">{region.averageRating.toFixed(1)}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Reviews</h3>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{region.reviewCount}</span>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex justify-center my-12">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center">
              <h3 className="text-lg font-medium mb-2">Region Not Found</h3>
              <p className="text-muted-foreground mb-4">
                The region you're looking for doesn't exist or has been moved.
              </p>
              <Button asChild>
                <Link to="/regions">Back to All Regions</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
      
      {region && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Branches in {region.name}</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSort("name")}
                className="flex items-center gap-1"
              >
                Name
                {sortField === "name" && (
                  <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSort("city")}
                className="flex items-center gap-1"
              >
                City
                {sortField === "city" && (
                  <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSort("averageRating")}
                className="flex items-center gap-1"
              >
                Rating
                {sortField === "averageRating" && (
                  <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                )}
              </Button>
            </div>
          </div>
          
          {branchesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-[200px] w-full" />
              ))}
            </div>
          ) : sortedBranches.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No branches found</h3>
              <p className="text-muted-foreground">This region has no branches yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedBranches.map((branch) => (
                <BranchCard key={branch.id} branch={branch} />
              ))}
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
