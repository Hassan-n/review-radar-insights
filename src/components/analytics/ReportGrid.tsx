
import { useState } from "react";
import { CustomReport, ReportVisualization } from "@/types/reports";
import { ReportBuilder } from "@/components/analytics/ReportBuilder";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Edit, Maximize, Minimize, MoreHorizontal, Trash2 } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface ReportGridProps {
  report: CustomReport;
  onEditVisualization: (id: string) => void;
  onDeleteVisualization: (id: string) => void;
  onDuplicateVisualization: (id: string) => void;
}

export function ReportGrid({ 
  report, 
  onEditVisualization, 
  onDeleteVisualization,
  onDuplicateVisualization
}: ReportGridProps) {
  const [expandedViz, setExpandedViz] = useState<string | null>(null);
  
  const calculateGridSpan = (visualization: ReportVisualization) => {
    return {
      colSpan: expandedViz === visualization.id ? report.layout.columns : visualization.width,
      rowSpan: expandedViz === visualization.id ? 3 : visualization.height
    };
  };

  const toggleExpand = (id: string) => {
    setExpandedViz(expandedViz === id ? null : id);
  };

  return (
    <div className="grid grid-cols-4 gap-4 auto-rows-[250px]">
      {report.visualizations.map((viz) => {
        const { colSpan, rowSpan } = calculateGridSpan(viz);
        
        return (
          <Card 
            key={viz.id} 
            className={`col-span-${colSpan} row-span-${rowSpan} flex flex-col`}
          >
            <CardHeader className="p-4 pb-0 flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base truncate max-w-[200px]">{viz.title}</CardTitle>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleExpand(viz.id)}
                    className="h-8 w-8"
                  >
                    {expandedViz === viz.id ? (
                      <Minimize className="h-4 w-4" />
                    ) : (
                      <Maximize className="h-4 w-4" />
                    )}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditVisualization(viz.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDuplicateVisualization(viz.id)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onDeleteVisualization(viz.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow overflow-hidden">
              <div className="h-full w-full">
                <ReportBuilder 
                  chartType={viz.type}
                  dataset={viz.dataset}
                  colorScheme={viz.colorScheme}
                  timeFrame={viz.filters.timePeriod || "30days"}
                  regionId={viz.filters.regionId}
                  branchId={viz.filters.branchId}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
