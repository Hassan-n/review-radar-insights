
import { RatingDistribution } from "@/types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface RatingChartProps {
  data: RatingDistribution[];
  isLoading?: boolean;
  onDrilldown?: (rating: number) => void;
}

export function RatingChart({ data, isLoading = false, onDrilldown }: RatingChartProps) {
  // Custom colors for each rating
  const colors = ["#EF4444", "#F97316", "#F59E0B", "#34D399", "#10B981"];

  // Function to handle bar click for drilldown
  const handleBarClick = (data: any) => {
    if (onDrilldown) {
      onDrilldown(data.rating);
    }
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Rating Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[250px] w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `${value} reviews`,
                  name === "count" ? "Count" : name
                ]}
                labelFormatter={(label) => `${label} Stars`}
              />
              <Bar 
                dataKey="count" 
                radius={[4, 4, 0, 0]}
                barSize={50}
                name="count"
                fill="#10B981"
                fillOpacity={1}
                stroke="none"
                onClick={handleBarClick}
                cursor={onDrilldown ? "pointer" : "default"}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
