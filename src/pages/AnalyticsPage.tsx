import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  FileText, 
  FileSpreadsheet, 
  Download, 
  ChartPie, 
  ChartLine, 
  Table as TableIcon,
  Filter,
  ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RegionFilter } from "@/components/filters/RegionFilter";
import { BranchFilter } from "@/components/filters/BranchFilter";
import { useRegions } from "@/hooks/useRegions";
import { useRegionBranches } from "@/hooks/useBranches";
import { ReportBuilder } from "@/components/analytics/ReportBuilder";
import { ChartContainer } from "@/components/ui/chart";

const DEFAULT_CHART_CONFIG = {
  dataset: "ratings",
  dataType: "bar",
  colorScheme: "default",
  timeFrame: "30days",
};

export default function AnalyticsPage() {
  const [selectedRegionId, setSelectedRegionId] = useState<string | undefined>(undefined);
  const [selectedBranchId, setBranchId] = useState<string | undefined>(undefined);
  const [chartConfig, setChartConfig] = useState(DEFAULT_CHART_CONFIG);
  const [activeTab, setActiveTab] = useState("chart");
  
  const { data: regions = [], isLoading: isLoadingRegions } = useRegions();
  const { data: branches = [], isLoading: isLoadingBranches } = useRegionBranches(selectedRegionId);

  const handleExport = (format: "pdf" | "excel" | "csv") => {
    console.log(`Exporting in ${format} format`);
    alert(`Report would now be exported as ${format.toUpperCase()}`);
  };

  const handleDatasetChange = (value: string) => {
    setChartConfig(prev => ({ ...prev, dataset: value }));
  };

  const handleChartTypeChange = (value: string) => {
    setChartConfig(prev => ({ ...prev, dataType: value }));
  };

  const handleTimeFrameChange = (value: string) => {
    setChartConfig(prev => ({ ...prev, timeFrame: value }));
  };

  const handleColorSchemeChange = (value: string) => {
    setChartConfig(prev => ({ ...prev, colorScheme: value }));
  };

  return (
    <Layout>
      <PageHeader 
        title="Analytics & Reporting" 
        description="Build custom reports and visualize your data"
      />
      
      <div className="space-y-6">
        <Card className="bg-white">
          <CardHeader className="bg-[#4C6A9C] text-white">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Report Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataset">Dataset</Label>
                <Select value={chartConfig.dataset} onValueChange={handleDatasetChange}>
                  <SelectTrigger id="dataset">
                    <SelectValue placeholder="Select dataset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ratings">Rating Distribution</SelectItem>
                    <SelectItem value="sentiment">Sentiment Analysis</SelectItem>
                    <SelectItem value="trends">Monthly Trends</SelectItem>
                    <SelectItem value="performance">Branch Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <RegionFilter 
                  regions={regions}
                  selectedRegionId={selectedRegionId}
                  onChange={setSelectedRegionId}
                  isLoading={isLoadingRegions}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <BranchFilter 
                  branches={branches}
                  selectedBranchId={selectedBranchId}
                  onChange={setBranchId}
                  isLoading={isLoadingBranches}
                  disabled={!selectedRegionId}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeFrame">Time Frame</Label>
                <Select value={chartConfig.timeFrame} onValueChange={handleTimeFrameChange}>
                  <SelectTrigger id="timeFrame">
                    <SelectValue placeholder="Select time frame" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                    <SelectItem value="1year">Last Year</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {chartConfig.timeFrame === "custom" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" className="w-full" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="bg-[#4C6A9C] text-white">
            <CardTitle className="flex items-center gap-2">
              <ChartLine className="h-5 w-5" />
              Visualization Options
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="chartType">Chart Type</Label>
                <Select value={chartConfig.dataType} onValueChange={handleChartTypeChange}>
                  <SelectTrigger id="chartType">
                    <SelectValue placeholder="Select chart type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="pie">Pie Chart</SelectItem>
                    <SelectItem value="area">Area Chart</SelectItem>
                    <SelectItem value="table">Table View</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="colorScheme">Color Scheme</Label>
                <Select value={chartConfig.colorScheme} onValueChange={handleColorSchemeChange}>
                  <SelectTrigger id="colorScheme">
                    <SelectValue placeholder="Select color scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">SARS Default</SelectItem>
                    <SelectItem value="blue">Blue Scale</SelectItem>
                    <SelectItem value="green">Green Scale</SelectItem>
                    <SelectItem value="contrast">High Contrast</SelectItem>
                    <SelectItem value="monochrome">Monochrome</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sortBy">Sort By</Label>
                <div className="flex items-center gap-2">
                  <Select defaultValue="value">
                    <SelectTrigger id="sortBy">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="value">Value</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="bg-[#4C6A9C] text-white flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {chartConfig.dataType === "bar" && <BarChart className="h-5 w-5" />}
              {chartConfig.dataType === "pie" && <ChartPie className="h-5 w-5" />}
              {chartConfig.dataType === "line" && <ChartLine className="h-5 w-5" />}
              {chartConfig.dataType === "table" && <TableIcon className="h-5 w-5" />}
              Results
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/10 hover:bg-white/20 text-white"
                onClick={() => handleExport("pdf")}
              >
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/10 hover:bg-white/20 text-white"
                onClick={() => handleExport("excel")}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/10 hover:bg-white/20 text-white"
                onClick={() => handleExport("csv")}
              >
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="chart" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="chart">Chart View</TabsTrigger>
                <TabsTrigger value="table">Table View</TabsTrigger>
                <TabsTrigger value="raw">Raw Data</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chart" className="h-[500px]">
                <ReportBuilder 
                  chartType={chartConfig.dataType}
                  dataset={chartConfig.dataset}
                  colorScheme={chartConfig.colorScheme}
                  timeFrame={chartConfig.timeFrame}
                  regionId={selectedRegionId}
                  branchId={selectedBranchId}
                />
              </TabsContent>
              
              <TabsContent value="table">
                <div className="rounded border">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="p-2 text-left font-medium">Category</th>
                        <th className="p-2 text-left font-medium">Value</th>
                        <th className="p-2 text-left font-medium">Percentage</th>
                        <th className="p-2 text-left font-medium">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="p-2">Rating 5</td>
                        <td className="p-2">245</td>
                        <td className="p-2">42%</td>
                        <td className="p-2 text-green-600">+5%</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2">Rating 4</td>
                        <td className="p-2">187</td>
                        <td className="p-2">32%</td>
                        <td className="p-2 text-green-600">+2%</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2">Rating 3</td>
                        <td className="p-2">98</td>
                        <td className="p-2">17%</td>
                        <td className="p-2 text-red-600">-1%</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2">Rating 2</td>
                        <td className="p-2">35</td>
                        <td className="p-2">6%</td>
                        <td className="p-2 text-red-600">-3%</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2">Rating 1</td>
                        <td className="p-2">18</td>
                        <td className="p-2">3%</td>
                        <td className="p-2 text-red-600">-3%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="raw">
                <div className="bg-muted/50 p-4 rounded">
                  <pre className="text-xs overflow-auto max-h-[400px]">
                    {JSON.stringify({
                      dataset: chartConfig.dataset,
                      region: selectedRegionId || "all",
                      branch: selectedBranchId || "all",
                      timeFrame: chartConfig.timeFrame,
                      data: [
                        { category: "Rating 5", value: 245, percentage: 42 },
                        { category: "Rating 4", value: 187, percentage: 32 },
                        { category: "Rating 3", value: 98, percentage: 17 },
                        { category: "Rating 2", value: 35, percentage: 6 },
                        { category: "Rating 1", value: 18, percentage: 3 },
                      ]
                    }, null, 2)}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
