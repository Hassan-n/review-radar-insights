
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { RatingChart } from "@/components/dashboard/RatingChart";
import { SentimentChart } from "@/components/dashboard/SentimentChart";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { RecentReviews } from "@/components/dashboard/RecentReviews";
import { TimeFilter } from "@/components/dashboard/TimeFilter";
import { useDashboardStats } from "@/hooks/useStats";
import { BarChart3, ChevronLeft, MapPin, Star, TrendingUp, Users } from "lucide-react";
import { FilterOptions, TimePeriod } from "@/types";
import { useRegions } from "@/hooks/useRegions";
import { RegionFilter } from "@/components/filters/RegionFilter";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useBranchReviews } from "@/hooks/useReviews";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewItem } from "@/components/reviews/ReviewItem";

export default function Dashboard() {
  const navigate = useNavigate();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("30days");
  const [selectedRegionId, setSelectedRegionId] = useState<string | undefined>(undefined);
  
  // Drilldown states
  const [drilldownMode, setDrilldownMode] = useState<"rating" | "sentiment" | "month" | null>(null);
  const [drilldownValue, setDrilldownValue] = useState<string | number | null>(null);
  
  const filters: FilterOptions = {
    timePeriod,
    regionId: selectedRegionId,
  };
  
  const { data: stats, isLoading } = useDashboardStats(filters);
  const { data: regions, isLoading: regionsLoading } = useRegions();
  
  // Get filtered reviews based on drilldown selection
  const { data: drilldownReviews, isLoading: reviewsLoading } = useBranchReviews(
    "",
    drilldownMode ? {
      timePeriod,
      regionId: selectedRegionId,
      ...(drilldownMode === "rating" && { rating: drilldownValue as number }),
      ...(drilldownMode === "sentiment" && { sentiment: drilldownValue as string }),
      ...(drilldownMode === "month" && { month: drilldownValue as string }),
    } : undefined,
    drilldownMode !== null // Only fetch when in drilldown mode
  );
  
  // Handle drilldown on rating chart
  const handleRatingDrilldown = (rating: number) => {
    setDrilldownMode("rating");
    setDrilldownValue(rating);
  };
  
  // Handle drilldown on sentiment chart
  const handleSentimentDrilldown = (sentiment: string) => {
    setDrilldownMode("sentiment");
    setDrilldownValue(sentiment);
  };
  
  // Handle drilldown on month chart
  const handleMonthDrilldown = (month: string) => {
    setDrilldownMode("month");
    setDrilldownValue(month);
  };
  
  // Exit drilldown mode
  const exitDrilldown = () => {
    setDrilldownMode(null);
    setDrilldownValue(null);
  };
  
  // Generate drilldown title based on current mode
  const getDrilldownTitle = () => {
    if (!drilldownMode) return "";
    
    switch (drilldownMode) {
      case "rating":
        return `Reviews with ${drilldownValue} Stars`;
      case "sentiment":
        return `${drilldownValue.toString().charAt(0).toUpperCase() + drilldownValue.toString().slice(1)} Reviews`;
      case "month":
        return `Reviews from ${drilldownValue}`;
      default:
        return "";
    }
  };
  
  return (
    <Layout>
      <PageHeader 
        title="Review Radar Dashboard" 
        description="Your real-time overview of review performance across all locations."
      />
      
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <TimeFilter selected={timePeriod} onChange={setTimePeriod} />
        <div className="w-full md:w-[250px]">
          {regions && (
            <RegionFilter
              regions={regions}
              selectedRegionId={selectedRegionId}
              onChange={setSelectedRegionId}
              isLoading={regionsLoading}
            />
          )}
        </div>
      </div>
      
      {drilldownMode ? (
        // Drilldown view
        <>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exitDrilldown}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <h2 className="text-xl font-bold">{getDrilldownTitle()}</h2>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Filtered Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {reviewsLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-[100px] animate-pulse bg-slate-200 rounded-md"></div>
                  ))}
                </div>
              ) : drilldownReviews && drilldownReviews.length > 0 ? (
                <div className="space-y-4">
                  {drilldownReviews.map((review) => (
                    <ReviewItem key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg font-medium">No reviews found</p>
                  <p className="text-muted-foreground">Try adjusting your filters</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        // Regular dashboard view
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard
              title="Total Reviews"
              value={isLoading ? "..." : stats?.totalReviews.toLocaleString() || "0"}
              icon={<Star className="h-4 w-4" />}
              isLoading={isLoading}
            />
            <StatCard
              title="Average Rating"
              value={isLoading ? "..." : stats?.averageRating.toFixed(1) || "0.0"}
              icon={<TrendingUp className="h-4 w-4" />}
              isLoading={isLoading}
            />
            <StatCard
              title="Positive Sentiment"
              value={isLoading 
                ? "..." 
                : `${stats?.sentimentDistribution.find(s => s.sentiment === 'positive')?.percentage.toFixed(1) || 0}%`
              }
              icon={<TrendingUp className="h-4 w-4" />}
              isLoading={isLoading}
            />
            <StatCard
              title="Total Regions"
              value={regionsLoading ? "..." : regions?.length || "0"}
              icon={<MapPin className="h-4 w-4" />}
              isLoading={regionsLoading}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <RatingChart 
              data={stats?.ratingDistribution || []}
              isLoading={isLoading}
              onDrilldown={handleRatingDrilldown}
            />
            <SentimentChart 
              data={stats?.sentimentDistribution || []}
              isLoading={isLoading}
              onDrilldown={handleSentimentDrilldown}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TrendChart 
              data={stats?.monthlyTrends || []}
              isLoading={isLoading}
              onDrilldown={handleMonthDrilldown}
            />
            <RecentReviews />
          </div>
        </>
      )}
    </Layout>
  );
}
