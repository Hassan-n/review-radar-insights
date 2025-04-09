
import { useMemo } from "react";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Cell
} from "recharts";
import { useStats } from "@/hooks/useStats";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

// SARS color palette
const COLOR_SCHEMES = {
  default: ["#4C6A9C", "#2D4E6D", "#003366", "#1A5276", "#7FB3D5"],
  blue: ["#1A5276", "#2874A6", "#3498DB", "#85C1E9", "#D6EAF8"],
  green: ["#145A32", "#196F3D", "#1E8449", "#27AE60", "#58D68D"],
  contrast: ["#F1C40F", "#3498DB", "#E74C3C", "#2ECC71", "#9B59B6"],
  monochrome: ["#1F1F1F", "#383838", "#555555", "#777777", "#999999"]
};

interface ReportBuilderProps {
  chartType: string;
  dataset: string;
  colorScheme: string;
  timeFrame: string;
  regionId?: string;
  branchId?: string;
}

export function ReportBuilder({
  chartType,
  dataset,
  colorScheme,
  timeFrame,
  regionId,
  branchId
}: ReportBuilderProps) {
  const { 
    data: statsData, 
    isLoading: isLoadingStats, 
    error: statsError 
  } = useStats({ 
    timePeriod: timeFrame as any, 
    regionId, 
    branchId 
  });

  const chartData = useMemo(() => {
    if (!statsData) return [];

    switch (dataset) {
      case "ratings":
        return statsData.ratingDistribution || [];
      case "sentiment":
        return statsData.sentimentDistribution || [];
      case "trends":
        return statsData.monthlyTrends || [];
      case "performance":
        // For demonstration - in a real app, this would use branch performance data
        return [
          { name: "Western Cape", value: 92 },
          { name: "Gauteng", value: 87 },
          { name: "KwaZulu-Natal", value: 83 },
          { name: "Eastern Cape", value: 78 },
          { name: "Free State", value: 76 }
        ];
      default:
        return [];
    }
  }, [dataset, statsData]);

  // Get colors from the selected scheme
  const colors = COLOR_SCHEMES[colorScheme as keyof typeof COLOR_SCHEMES] || COLOR_SCHEMES.default;

  if (isLoadingStats) {
    return <Skeleton className="h-full w-full" />;
  }

  if (statsError) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Failed to load report data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (chartData.length === 0) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          No data available for the selected filters. Try adjusting your filter criteria.
        </AlertDescription>
      </Alert>
    );
  }

  // Determine which keys to use based on the dataset
  const getChartProps = () => {
    switch (dataset) {
      case "ratings":
        return {
          dataKey: "count",
          nameKey: "rating",
          labelKey: (entry: any) => `${entry.rating} Stars`
        };
      case "sentiment":
        return {
          dataKey: "count",
          nameKey: "sentiment",
          labelKey: (entry: any) => entry.sentiment.charAt(0).toUpperCase() + entry.sentiment.slice(1)
        };
      case "trends":
        return {
          dataKey: "averageRating",
          nameKey: "month",
          secondaryKey: "reviewCount"
        };
      case "performance":
        return {
          dataKey: "value",
          nameKey: "name"
        };
      default:
        return {
          dataKey: "value",
          nameKey: "name"
        };
    }
  };

  const { dataKey, nameKey, secondaryKey, labelKey } = getChartProps();

  const renderTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    
    const data = payload[0].payload;
    
    return (
      <div className="bg-white p-2 border shadow-sm rounded">
        <p className="font-medium">{typeof labelKey === 'function' ? labelKey(data) : label}</p>
        <p className="text-sm text-gray-700">
          Count: {data[dataKey]}
          {data.percentage !== undefined && ` (${data.percentage.toFixed(1)}%)`}
        </p>
        {secondaryKey && <p className="text-sm text-gray-700">Reviews: {data[secondaryKey]}</p>}
      </div>
    );
  };

  // Render appropriate chart based on chartType
  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={nameKey} />
              <YAxis />
              <Tooltip content={renderTooltip} />
              <Legend />
              <Bar dataKey={dataKey} fill={colors[0]} radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
              {secondaryKey && (
                <Bar dataKey={secondaryKey} fill={colors[1]} radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        );
        
      case "line":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={nameKey} />
              <YAxis />
              <Tooltip content={renderTooltip} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke={colors[0]} 
                strokeWidth={2} 
                dot={{ fill: colors[0], r: 4 }} 
                activeDot={{ r: 6 }} 
              />
              {secondaryKey && (
                <Line 
                  type="monotone" 
                  dataKey={secondaryKey} 
                  stroke={colors[1]} 
                  strokeWidth={2} 
                  dot={{ fill: colors[1], r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );
        
      case "pie":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey={dataKey}
                nameKey={nameKey}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [value, "Count"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
        
      case "area":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={nameKey} />
              <YAxis />
              <Tooltip content={renderTooltip} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey={dataKey} 
                stroke={colors[0]} 
                fill={colors[0]} 
                fillOpacity={0.3} 
              />
              {secondaryKey && (
                <Area 
                  type="monotone" 
                  dataKey={secondaryKey} 
                  stroke={colors[1]} 
                  fill={colors[1]} 
                  fillOpacity={0.3} 
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        );
        
      case "table":
        return (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">Please switch to the Table View tab to see tabular data.</p>
          </div>
        );
        
      default:
        return (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">Select a chart type to visualize the data.</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full w-full">
      {renderChart()}
    </div>
  );
}
