
import { useState } from "react";
import { CustomReport } from "@/types/reports";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, FileText, PlusCircle, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "@/lib/uuid";

interface ReportManagerProps {
  reports: CustomReport[];
  activeReportId?: string;
  onSelectReport: (report: CustomReport) => void;
  onCreateReport: (report: CustomReport) => void;
  onUpdateReport: (report: CustomReport) => void;
  onDeleteReport: (id: string) => void;
}

export function ReportManager({
  reports,
  activeReportId,
  onSelectReport,
  onCreateReport,
  onUpdateReport,
  onDeleteReport,
}: ReportManagerProps) {
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [newReportName, setNewReportName] = useState("");
  const [newReportDescription, setNewReportDescription] = useState("");

  const handleCreateReport = () => {
    if (!newReportName.trim()) return;

    const newReport: CustomReport = {
      id: uuidv4(),
      name: newReportName.trim(),
      description: newReportDescription.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      visualizations: [],
      layout: {
        columns: 4,
        rowHeight: 250,
      },
    };

    onCreateReport(newReport);
    setNewReportName("");
    setNewReportDescription("");
    setIsCreateMode(false);
  };

  const cancelCreate = () => {
    setNewReportName("");
    setNewReportDescription("");
    setIsCreateMode(false);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          My Reports
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 sm:max-w-md">
        <SheetHeader className="pb-4">
          <SheetTitle>My Reports</SheetTitle>
          <SheetDescription>
            Select, create or manage your custom reports
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 py-4">
          {isCreateMode ? (
            <div className="space-y-4 p-4 border rounded-md">
              <div className="space-y-2">
                <Label htmlFor="new-report-name">Report Name</Label>
                <Input
                  id="new-report-name"
                  value={newReportName}
                  onChange={(e) => setNewReportName(e.target.value)}
                  placeholder="Enter report name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-report-description">Description (Optional)</Label>
                <Input
                  id="new-report-description"
                  value={newReportDescription}
                  onChange={(e) => setNewReportDescription(e.target.value)}
                  placeholder="Enter description"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={cancelCreate}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleCreateReport}>
                  <Check className="h-4 w-4 mr-2" />
                  Create
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => setIsCreateMode(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Report
            </Button>
          )}

          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="space-y-2 pr-4">
              {reports.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No reports yet. Create your first report!
                </div>
              ) : (
                reports.map((report) => (
                  <Button
                    key={report.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start py-2 px-3 h-auto",
                      activeReportId === report.id && "bg-muted"
                    )}
                    onClick={() => onSelectReport(report)}
                  >
                    <div className="flex flex-col items-start text-left">
                      <span className="font-medium">{report.name}</span>
                      {report.description && (
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {report.description}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground mt-1">
                        {new Date(report.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
