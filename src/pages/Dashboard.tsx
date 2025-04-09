
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
import { BarChart3, MapPin, Star, TrendingUp, Users } from "lucide-react";
import { FilterOptions, TimePeriod } from "@/types";
import { useRegions } from "@/hooks/useRegions";
import { RegionFilter } from "@/components/filters/RegionFilter";

export default function Dashboard() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("30days");
  const [selectedRegionId, setSelectedRegionId] = useState<string | undefined>(undefined);
  
  const filters: FilterOptions = {
    timePeriod,
    regionId: selectedRegionId,
  };
  
  const { data: stats, isLoading } = useDashboardStats(filters);
  const { data: regions, isLoading: regionsLoading } = useRegions();
  
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
        />
        <SentimentChart 
          data={stats?.sentimentDistribution || []}
          isLoading={isLoading}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TrendChart 
          data={stats?.monthlyTrends || []}
          isLoading={isLoading}
        />
        <RecentReviews />
      </div>
    </Layout>
  );
}
