
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RegionFilter } from "@/components/filters/RegionFilter";
import { BranchFilter } from "@/components/filters/BranchFilter";
import { ReportVisualization } from "@/types/reports";
import { useRegions } from "@/hooks/useRegions";
import { useRegionBranches } from "@/hooks/useBranches";
import { TimePeriod } from "@/types";
import { ArrowLeft, Check, X } from "lucide-react";

interface VisualizationEditorProps {
  visualization: Partial<ReportVisualization>;
  onSave: (visualization: Partial<ReportVisualization>) => void;
  onCancel: () => void;
}

export function VisualizationEditor({ 
  visualization, 
  onSave, 
  onCancel 
}: VisualizationEditorProps) {
  const [formData, setFormData] = useState<Partial<ReportVisualization>>(
    visualization || {
      title: "New Visualization",
      type: "bar",
      dataset: "ratings",
      colorScheme: "default",
      filters: {
        timePeriod: "30days",
      },
      width: 2,
      height: 1,
      position: { x: 0, y: 0 }
    }
  );
  
  const [selectedRegionId, setSelectedRegionId] = useState<string | undefined>(
    visualization?.filters?.regionId
  );
  
  const { data: regions = [], isLoading: isLoadingRegions } = useRegions();
  const { data: branches = [], isLoading: isLoadingBranches } = useRegionBranches(selectedRegionId);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFilterChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [field]: value
      }
    }));
  };

  const handleRegionChange = (regionId: string | undefined) => {
    setSelectedRegionId(regionId);
    
    setFormData(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        regionId,
        branchId: undefined // Reset branch when region changes
      }
    }));
  };

  const handleBranchChange = (branchId: string | undefined) => {
    setFormData(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        branchId
      }
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Check className="h-4 w-4 mr-2" />
            Save Visualization
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Visualization Title</Label>
              <Input 
                id="title" 
                value={formData.title || ''} 
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter a title for this visualization"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataset">Dataset</Label>
              <Select 
                value={formData.dataset} 
                onValueChange={(value) => handleChange('dataset', value)}
              >
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visualization Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chartType">Chart Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: any) => handleChange('type', value)}
              >
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
              <Select 
                value={formData.colorScheme} 
                onValueChange={(value) => handleChange('colorScheme', value)}
              >
                <SelectTrigger id="colorScheme">
                  <SelectValue placeholder="Select color scheme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
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
                <Select 
                  defaultValue="value"
                  value={formData.sortBy}
                  onValueChange={(value) => handleChange('sortBy', value)}
                >
                  <SelectTrigger id="sortBy">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="value">Value</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                  </SelectContent>
                </Select>
                <Select 
                  defaultValue="desc"
                  value={formData.sortOrder}
                  onValueChange={(value: 'asc' | 'desc') => handleChange('sortOrder', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timeFrame">Time Frame</Label>
              <Select 
                value={formData.filters?.timePeriod as string || '30days'} 
                onValueChange={(value: TimePeriod) => handleFilterChange('timePeriod', value)}
              >
                <SelectTrigger id="timeFrame">
                  <SelectValue placeholder="Select time frame" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <RegionFilter 
                regions={regions}
                selectedRegionId={selectedRegionId}
                onChange={handleRegionChange}
                isLoading={isLoadingRegions}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <BranchFilter 
                branches={branches}
                selectedBranchId={formData.filters?.branchId}
                onChange={handleBranchChange}
                isLoading={isLoadingBranches}
                disabled={!selectedRegionId}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Size and Layout</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Width (columns)</Label>
              <Select 
                value={formData.width?.toString()} 
                onValueChange={(value) => handleChange('width', parseInt(value))}
              >
                <SelectTrigger id="width">
                  <SelectValue placeholder="Select width" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 column</SelectItem>
                  <SelectItem value="2">2 columns</SelectItem>
                  <SelectItem value="3">3 columns</SelectItem>
                  <SelectItem value="4">4 columns (full width)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (rows)</Label>
              <Select 
                value={formData.height?.toString()} 
                onValueChange={(value) => handleChange('height', parseInt(value))}
              >
                <SelectTrigger id="height">
                  <SelectValue placeholder="Select height" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 row (small)</SelectItem>
                  <SelectItem value="2">2 rows (medium)</SelectItem>
                  <SelectItem value="3">3 rows (large)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
