
import { MonthlyTrend } from "@/types";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  Area,
  ComposedChart
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface TrendChartProps {
  data: MonthlyTrend[];
  isLoading?: boolean;
  onDrilldown?: (month: string) => void;
}

export function TrendChart({ data, isLoading = false, onDrilldown }: TrendChartProps) {
  // Function to handle point click for drilldown
  const handlePointClick = (data: any) => {
    if (onDrilldown && data.activePayload && data.activePayload.length > 0) {
      onDrilldown(data.activePayload[0].payload.month);
    }
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Monthly Trends</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart 
              data={data}
              onClick={onDrilldown ? handlePointClick : undefined}
              cursor={onDrilldown ? "pointer" : "default"}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }} 
              />
              <YAxis 
                yAxisId="left" 
                tick={{ fontSize: 12 }} 
                domain={[0, 5]} 
                allowDecimals
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                tick={{ fontSize: 12 }} 
              />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="averageRating"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Average Rating"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="reviewCount"
                fill="#3b82f6"
                stroke="#3b82f6"
                fillOpacity={0.3}
                name="Review Count"
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
