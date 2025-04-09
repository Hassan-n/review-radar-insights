
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/common/PageHeader";
import { useReviews } from "@/hooks/useReviews";
import { useAllBranches } from "@/hooks/useBranches";
import { useRegions } from "@/hooks/useRegions";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { 
  FilterOptions, 
  TimePeriod
} from "@/types";
import { Button } from "@/components/ui/button";
import { ReviewItem } from "@/components/reviews/ReviewItem";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, SearchX, SlidersHorizontal, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { RegionFilter } from "@/components/filters/RegionFilter";
import { BranchFilter } from "@/components/filters/BranchFilter";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { TimeFilter } from "@/components/dashboard/TimeFilter";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ReviewsPage() {
  // Filter state
  const [page, setPage] = useState(1);
  const [selectedRegionId, setSelectedRegionId] = useState<string | undefined>(undefined);
  const [selectedBranchId, setSelectedBranchId] = useState<string | undefined>(undefined);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedSentiments, setSelectedSentiments] = useState<("positive" | "neutral" | "negative")[]>([]);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("all");
  
  // Prepare filters object for the API
  const filters: FilterOptions = {
    regionId: selectedRegionId,
    branchId: selectedBranchId,
    rating: selectedRatings.length > 0 ? selectedRatings : undefined,
    sentiment: selectedSentiments.length > 0 ? selectedSentiments : undefined,
    timePeriod: timePeriod === "all" ? undefined : timePeriod,
  };
  
  // Fetch data
  const { data, isLoading, error } = useReviews(page, 10, filters);
  const { data: branches, isLoading: branchesLoading } = useAllBranches();
  const { data: regions, isLoading: regionsLoading } = useRegions();
  
  // Get filtered branches based on selected region
  const filteredBranches = branches?.filter(branch => 
    !selectedRegionId || branch.regionId === selectedRegionId
  );
  
  // Count active filters
  const countActiveFilters = () => {
    let count = 0;
    if (selectedRegionId) count++;
    if (selectedBranchId) count++;
    if (selectedRatings.length) count++;
    if (selectedSentiments.length) count++;
    if (timePeriod !== "all") count++;
    return count;
  };
  
  // Rating toggle handler
  const handleRatingToggle = (rating: number) => {
    setSelectedRatings(prev => 
      prev.includes(rating) 
        ? prev.filter(r => r !== rating) 
        : [...prev, rating]
    );
    setPage(1); // Reset to first page when filters change
  };
  
  // Sentiment toggle handler
  const handleSentimentToggle = (sentiment: "positive" | "neutral" | "negative") => {
    setSelectedSentiments(prev => 
      prev.includes(sentiment) 
        ? prev.filter(s => s !== sentiment) 
        : [...prev, sentiment]
    );
    setPage(1); // Reset to first page when filters change
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedRegionId(undefined);
    setSelectedBranchId(undefined);
    setSelectedRatings([]);
    setSelectedSentiments([]);
    setTimePeriod("all");
    setPage(1);
  };
  
  return (
    <Layout>
      <PageHeader 
        title="Reviews" 
        description="Manage and analyze customer reviews across all branches"
      />
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {countActiveFilters() > 0 && (
                  <Badge className="ml-1 bg-primary text-primary-foreground">
                    {countActiveFilters()}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
              <SheetHeader className="p-6 pb-2">
                <SheetTitle>Filter Reviews</SheetTitle>
                <SheetDescription>
                  Apply filters to narrow down the reviews
                </SheetDescription>
              </SheetHeader>
              
              <ScrollArea className="h-[calc(100vh-80px)]">
                <div className="p-6 pt-2 space-y-6">
                  <div className="space-y-2">
                    <Label>Time Period</Label>
                    <TimeFilter 
                      selected={timePeriod} 
                      onChange={(period) => {
                        setTimePeriod(period);
                        setPage(1);
                      }}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Region</Label>
                    {regions && (
                      <RegionFilter
                        regions={regions}
                        selectedRegionId={selectedRegionId}
                        onChange={(regionId) => {
                          setSelectedRegionId(regionId);
                          setSelectedBranchId(undefined); // Reset branch when region changes
                          setPage(1);
                        }}
                        isLoading={regionsLoading}
                      />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Branch</Label>
                    {filteredBranches && (
                      <BranchFilter
                        branches={filteredBranches}
                        selectedBranchId={selectedBranchId}
                        onChange={(branchId) => {
                          setSelectedBranchId(branchId);
                          setPage(1);
                        }}
                        isLoading={branchesLoading}
                        disabled={!filteredBranches.length}
                      />
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <Label>Rating</Label>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Button
                          key={rating}
                          variant={selectedRatings.includes(rating) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleRatingToggle(rating)}
                        >
                          {rating} <Star className="h-3 w-3 ml-1" />
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Sentiment</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="sentiment-positive" 
                          checked={selectedSentiments.includes("positive")}
                          onCheckedChange={() => handleSentimentToggle("positive")}
                        />
                        <label 
                          htmlFor="sentiment-positive"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Positive
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="sentiment-neutral" 
                          checked={selectedSentiments.includes("neutral")}
                          onCheckedChange={() => handleSentimentToggle("neutral")}
                        />
                        <label 
                          htmlFor="sentiment-neutral"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Neutral
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="sentiment-negative" 
                          checked={selectedSentiments.includes("negative")}
                          onCheckedChange={() => handleSentimentToggle("negative")}
                        />
                        <label 
                          htmlFor="sentiment-negative"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Negative
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={clearFilters}
                    disabled={countActiveFilters() === 0}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
          
          {countActiveFilters() > 0 && (
            <Badge variant="outline" className="gap-1">
              {countActiveFilters()} active filters
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground" 
                onClick={clearFilters}
              >
                ×
              </Button>
            </Badge>
          )}
        </div>
        
        <Select
          value={`${page}`}
          onValueChange={(value) => setPage(parseInt(value))}
          disabled={isLoading || !data?.totalCount}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Page" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: Math.ceil((data?.totalCount || 0) / 10) }, (_, i) => (
              <SelectItem key={i + 1} value={`${i + 1}`}>
                Page {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Card className="mb-6">
        {isLoading ? (
          <div className="p-6 space-y-6">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-[120px] w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-500">Error loading reviews. Please try again.</p>
          </div>
        ) : data?.reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <SearchX className="h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium">No reviews found</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Try adjusting your filters to find what you're looking for
            </p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        ) : (
          <div className="divide-y">
            {data?.reviews.map((review) => (
              <div key={review.id} className="p-6">
                <ReviewItem review={review} showBranch={true} />
              </div>
            ))}
          </div>
        )}
      </Card>
      
      {data && data.totalCount > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {Math.min((page - 1) * 10 + 1, data.totalCount)} - {Math.min(page * 10, data.totalCount)} of {data.totalCount} reviews
          </p>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(Math.ceil(data.totalCount / 10), page + 1))}
              disabled={page >= Math.ceil(data.totalCount / 10) || isLoading}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </Layout>
  );
}
