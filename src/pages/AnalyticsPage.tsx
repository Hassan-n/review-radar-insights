
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChartLine, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  PlusCircle, 
  Save
} from "lucide-react";
import { ReportManager } from "@/components/analytics/ReportManager";
import { ReportGrid } from "@/components/analytics/ReportGrid";
import { VisualizationEditor } from "@/components/analytics/VisualizationEditor";
import { CustomReport, ReportVisualization } from "@/types/reports";
import { v4 as uuidv4 } from "@/lib/uuid";
import { toast } from "sonner";

// Mock initial report for demonstration purposes
const initialReport: CustomReport = {
  id: "default-report",
  name: "Default Dashboard",
  description: "Overview of customer ratings and sentiment",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  visualizations: [
    {
      id: "viz-1",
      title: "Rating Distribution",
      type: "bar",
      dataset: "ratings",
      colorScheme: "default",
      filters: {
        timePeriod: "30days",
      },
      width: 2,
      height: 1,
      position: { x: 0, y: 0 }
    },
    {
      id: "viz-2",
      title: "Monthly Rating Trends",
      type: "line",
      dataset: "trends",
      colorScheme: "blue",
      filters: {
        timePeriod: "90days",
      },
      width: 2,
      height: 1,
      position: { x: 2, y: 0 }
    },
    {
      id: "viz-3",
      title: "Sentiment Analysis",
      type: "pie",
      dataset: "sentiment",
      colorScheme: "contrast",
      filters: {
        timePeriod: "30days",
      },
      width: 2,
      height: 2,
      position: { x: 0, y: 1 }
    },
    {
      id: "viz-4",
      title: "Branch Performance",
      type: "bar",
      dataset: "performance",
      colorScheme: "green",
      filters: {
        timePeriod: "30days",
      },
      width: 2,
      height: 2,
      position: { x: 2, y: 1 }
    }
  ],
  layout: {
    columns: 4,
    rowHeight: 250
  }
};

export default function AnalyticsPage() {
  // State for managing reports
  const [reports, setReports] = useState<CustomReport[]>([initialReport]);
  const [activeReport, setActiveReport] = useState<CustomReport>(initialReport);
  
  // State for visualization editor
  const [isEditing, setIsEditing] = useState(false);
  const [currentVisualization, setCurrentVisualization] = useState<Partial<ReportVisualization> | null>(null);
  const [editingVizId, setEditingVizId] = useState<string | null>(null);

  // Handle report selection
  const handleSelectReport = (report: CustomReport) => {
    setActiveReport(report);
  };

  // Handle report creation
  const handleCreateReport = (report: CustomReport) => {
    setReports([...reports, report]);
    setActiveReport(report);
    toast.success("New report created");
  };

  // Handle report update
  const handleUpdateReport = (updatedReport: CustomReport) => {
    setReports(reports.map(r => r.id === updatedReport.id ? updatedReport : r));
    setActiveReport(updatedReport);
    toast.success("Report updated");
  };

  // Handle report deletion
  const handleDeleteReport = (id: string) => {
    const remainingReports = reports.filter(r => r.id !== id);
    setReports(remainingReports);
    
    if (activeReport.id === id) {
      setActiveReport(remainingReports[0] || initialReport);
    }
    
    toast.success("Report deleted");
  };

  // Handle adding a new visualization
  const handleAddVisualization = () => {
    setCurrentVisualization({
      id: uuidv4(),
      title: "New Visualization",
      type: "bar",
      dataset: "ratings",
      colorScheme: "default",
      filters: {
        timePeriod: "30days"
      },
      width: 2,
      height: 1,
      position: { x: 0, y: 0 }
    });
    setIsEditing(true);
    setEditingVizId(null);
  };

  // Handle editing a visualization
  const handleEditVisualization = (id: string) => {
    const vizToEdit = activeReport.visualizations.find(v => v.id === id);
    if (vizToEdit) {
      setCurrentVisualization(vizToEdit);
      setIsEditing(true);
      setEditingVizId(id);
    }
  };

  // Handle deleting a visualization
  const handleDeleteVisualization = (id: string) => {
    const updatedVisualizations = activeReport.visualizations.filter(v => v.id !== id);
    const updatedReport = {
      ...activeReport,
      visualizations: updatedVisualizations,
      updatedAt: new Date().toISOString()
    };
    
    handleUpdateReport(updatedReport);
    toast.success("Visualization deleted");
  };

  // Handle duplicating a visualization
  const handleDuplicateVisualization = (id: string) => {
    const vizToDuplicate = activeReport.visualizations.find(v => v.id === id);
    if (vizToDuplicate) {
      const duplicatedViz = {
        ...vizToDuplicate,
        id: uuidv4(),
        title: `${vizToDuplicate.title} (Copy)`
      };
      
      const updatedReport = {
        ...activeReport,
        visualizations: [...activeReport.visualizations, duplicatedViz],
        updatedAt: new Date().toISOString()
      };
      
      handleUpdateReport(updatedReport);
      toast.success("Visualization duplicated");
    }
  };

  // Handle save visualization
  const handleSaveVisualization = (visualization: Partial<ReportVisualization>) => {
    if (!visualization.id) return;
    
    let updatedVisualizations;
    
    if (editingVizId) {
      // Update existing visualization
      updatedVisualizations = activeReport.visualizations.map(v => 
        v.id === editingVizId ? visualization as ReportVisualization : v
      );
    } else {
      // Add new visualization
      updatedVisualizations = [
        ...activeReport.visualizations, 
        visualization as ReportVisualization
      ];
    }
    
    const updatedReport = {
      ...activeReport,
      visualizations: updatedVisualizations,
      updatedAt: new Date().toISOString()
    };
    
    handleUpdateReport(updatedReport);
    setIsEditing(false);
    setCurrentVisualization(null);
    setEditingVizId(null);
    
    toast.success(editingVizId ? "Visualization updated" : "Visualization added");
  };

  // Handle cancel visualization editing
  const handleCancelVisualizationEdit = () => {
    setIsEditing(false);
    setCurrentVisualization(null);
    setEditingVizId(null);
  };

  // Handle export report
  const handleExport = (format: "pdf" | "excel" | "csv") => {
    toast.success(`Report exported as ${format.toUpperCase()}`);
  };

  // Handle save report changes
  const handleSaveReport = () => {
    const updatedReport = {
      ...activeReport,
      updatedAt: new Date().toISOString()
    };
    
    handleUpdateReport(updatedReport);
    toast.success("Report saved");
  };

  return (
    <Layout>
      <PageHeader 
        title="Analytics & Reporting" 
        description="Build custom reports and visualize your data"
      />
      
      <div className="space-y-6">
        {isEditing ? (
          // Visualization Editor View
          <VisualizationEditor 
            visualization={currentVisualization || {}}
            onSave={handleSaveVisualization}
            onCancel={handleCancelVisualizationEdit}
          />
        ) : (
          // Report View
          <>
            <Card>
              <CardHeader className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1">
                    <CardTitle>{activeReport.name}</CardTitle>
                    {activeReport.description && (
                      <p className="text-sm text-muted-foreground">
                        {activeReport.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <ReportManager
                      reports={reports}
                      activeReportId={activeReport.id}
                      onSelectReport={handleSelectReport}
                      onCreateReport={handleCreateReport}
                      onUpdateReport={handleUpdateReport}
                      onDeleteReport={handleDeleteReport}
                    />
                    <Button onClick={handleSaveReport}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={handleAddVisualization} variant="default">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Visualization
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="flex items-center justify-end gap-2 mb-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExport("pdf")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExport("excel")}
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export Excel
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExport("csv")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
                
                {activeReport.visualizations.length === 0 ? (
                  <div className="border rounded-md flex flex-col items-center justify-center p-12 bg-muted/30">
                    <ChartLine className="h-12 w-12 text-muted mb-4" />
                    <h3 className="text-lg font-medium mb-2">No visualizations yet</h3>
                    <p className="text-muted-foreground text-center max-w-md mb-6">
                      This report doesn't have any visualizations. Add your first visualization
                      to start building your custom report.
                    </p>
                    <Button onClick={handleAddVisualization}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Your First Visualization
                    </Button>
                  </div>
                ) : (
                  <ReportGrid 
                    report={activeReport}
                    onEditVisualization={handleEditVisualization}
                    onDeleteVisualization={handleDeleteVisualization}
                    onDuplicateVisualization={handleDuplicateVisualization}
                  />
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}
