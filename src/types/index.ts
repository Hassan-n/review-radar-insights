
export interface Region {
  id: string;
  code: string;
  name: string;
  description?: string;
  branchCount: number;
  averageRating: number;
  reviewCount: number;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
  regionId: string;
  regionName: string;
  averageRating: number;
  reviewCount: number;
}

export interface Review {
  id: string;
  branchId: string;
  branchName: string;
  rating: number;
  content: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  date: string;
  customerName?: string;
}

export interface RatingDistribution {
  rating: number;
  count: number;
  percentage: number;
}

export interface SentimentDistribution {
  sentiment: 'positive' | 'neutral' | 'negative';
  count: number;
  percentage: number;
}

export interface MonthlyTrend {
  month: string;
  averageRating: number;
  reviewCount: number;
}

export interface DashboardStats {
  totalReviews: number;
  averageRating: number;
  sentimentDistribution: SentimentDistribution[];
  ratingDistribution: RatingDistribution[];
  monthlyTrends: MonthlyTrend[];
}

export type TimePeriod = '7days' | '30days' | '90days' | '1year' | 'all';

export interface FilterOptions {
  regionId?: string;
  branchId?: string;
  rating?: number[];
  sentiment?: ('positive' | 'neutral' | 'negative')[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  timePeriod?: TimePeriod;
}
