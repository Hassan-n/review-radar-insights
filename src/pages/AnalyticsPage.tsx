
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart, Info } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <Layout>
      <PageHeader 
        title="Analytics" 
        description="Advanced analytics and reporting tools"
      />
      
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertDescription>
          The advanced analytics features are in development and will be available soon.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-muted/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Regional Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
            Coming soon
          </CardContent>
        </Card>
        
        <Card className="bg-muted/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
            Coming soon
          </CardContent>
        </Card>
        
        <Card className="bg-muted/40 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Sentiment Analysis Heat Map
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
            Coming soon
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
