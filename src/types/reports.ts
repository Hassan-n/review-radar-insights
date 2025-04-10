
import { FilterOptions } from ".";

export type ReportVisualizationType = 'bar' | 'line' | 'pie' | 'area' | 'table';

export interface ReportVisualization {
  id: string;
  title: string;
  type: ReportVisualizationType;
  dataset: string;
  colorScheme: string;
  filters: FilterOptions;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  width: number;
  height: number;
  position: {
    x: number;
    y: number;
  };
}

export interface CustomReport {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  visualizations: ReportVisualization[];
  layout: {
    columns: number;
    rowHeight: number;
  };
}
