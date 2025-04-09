
import { SentimentDistribution } from "@/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SentimentChartProps {
  data: SentimentDistribution[];
  isLoading?: boolean;
}

export function SentimentChart({ data, isLoading = false }: SentimentChartProps) {
  // Custom colors for sentiment types
  const COLORS = {
    positive: "#10B981", // green
    neutral: "#F59E0B",  // amber
    negative: "#EF4444", // red
  };

  // Custom labels for the sentiment types
  const LABELS: Record<string, string> = {
    positive: "Positive",
    neutral: "Neutral",
    negative: "Negative",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[250px] w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                nameKey="sentiment"
                label={({ sentiment, percentage }) => 
                  `${LABELS[sentiment]}: ${percentage.toFixed(1)}%`
                }
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[entry.sentiment]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number, name: string, props: any) => {
                  const entry = data.find(item => item.sentiment === props.payload.sentiment);
                  return [`${value} reviews (${entry?.percentage.toFixed(1)}%)`, LABELS[props.payload.sentiment]];
                }}
              />
              <Legend 
                formatter={(value) => LABELS[value]}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
