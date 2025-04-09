
import { Branch, DashboardStats, MonthlyTrend, RatingDistribution, Region, Review, SentimentDistribution } from "@/types";

// Mock Regions
export const regions: Region[] = [
  {
    id: "1",
    code: "NE",
    name: "North East",
    description: "The North East region covering major cities",
    branchCount: 12,
    averageRating: 4.2,
    reviewCount: 356
  },
  {
    id: "2",
    code: "NW",
    name: "North West",
    description: "The North West region covering major cities",
    branchCount: 15,
    averageRating: 3.9,
    reviewCount: 412
  },
  {
    id: "3",
    code: "SE",
    name: "South East",
    description: "The South East region covering major cities",
    branchCount: 18,
    averageRating: 4.4,
    reviewCount: 528
  },
  {
    id: "4",
    code: "SW",
    name: "South West",
    description: "The South West region covering major cities",
    branchCount: 10,
    averageRating: 4.1,
    reviewCount: 275
  },
  {
    id: "5",
    code: "CE",
    name: "Central",
    description: "The Central region covering major cities",
    branchCount: 14,
    averageRating: 4.0,
    reviewCount: 389
  }
];

// Mock Branches
export const branches: Branch[] = [
  {
    id: "1",
    name: "Newcastle Central",
    address: "123 Newcastle Rd",
    city: "Newcastle",
    phone: "0191 123 4567",
    email: "newcastle@example.com",
    regionId: "1",
    regionName: "North East",
    averageRating: 4.3,
    reviewCount: 87
  },
  {
    id: "2",
    name: "Sunderland",
    address: "45 Sunderland Ave",
    city: "Sunderland",
    phone: "0191 987 6543",
    email: "sunderland@example.com",
    regionId: "1",
    regionName: "North East",
    averageRating: 4.1,
    reviewCount: 65
  },
  {
    id: "3",
    name: "Manchester Central",
    address: "78 Manchester Rd",
    city: "Manchester",
    phone: "0161 123 4567",
    email: "manchester@example.com",
    regionId: "2",
    regionName: "North West",
    averageRating: 4.0,
    reviewCount: 92
  },
  {
    id: "4",
    name: "Liverpool",
    address: "90 Liverpool St",
    city: "Liverpool",
    phone: "0151 123 4567",
    email: "liverpool@example.com",
    regionId: "2",
    regionName: "North West",
    averageRating: 3.8,
    reviewCount: 78
  },
  {
    id: "5",
    name: "London Central",
    address: "10 Oxford St",
    city: "London",
    phone: "020 1234 5678",
    email: "london@example.com",
    regionId: "3",
    regionName: "South East",
    averageRating: 4.5,
    reviewCount: 145
  },
  {
    id: "6",
    name: "Brighton",
    address: "22 Brighton Rd",
    city: "Brighton",
    phone: "01273 123 456",
    email: "brighton@example.com",
    regionId: "3",
    regionName: "South East",
    averageRating: 4.4,
    reviewCount: 89
  },
  {
    id: "7",
    name: "Bristol",
    address: "33 Bristol Rd",
    city: "Bristol",
    phone: "0117 123 4567",
    email: "bristol@example.com",
    regionId: "4",
    regionName: "South West",
    averageRating: 4.2,
    reviewCount: 78
  },
  {
    id: "8",
    name: "Plymouth",
    address: "55 Plymouth Ave",
    city: "Plymouth",
    phone: "01752 123 456",
    email: "plymouth@example.com",
    regionId: "4",
    regionName: "South West",
    averageRating: 3.9,
    reviewCount: 62
  },
  {
    id: "9",
    name: "Birmingham",
    address: "77 Birmingham St",
    city: "Birmingham",
    phone: "0121 123 4567",
    email: "birmingham@example.com",
    regionId: "5",
    regionName: "Central",
    averageRating: 4.1,
    reviewCount: 95
  },
  {
    id: "10",
    name: "Nottingham",
    address: "88 Nottingham Rd",
    city: "Nottingham",
    phone: "0115 123 4567",
    email: "nottingham@example.com",
    regionId: "5",
    regionName: "Central",
    averageRating: 3.8,
    reviewCount: 72
  }
];

// Mock Reviews
const generateReviews = (): Review[] => {
  const sentiments = ['positive', 'neutral', 'negative'] as const;
  const reviews: Review[] = [];
  const names = ['John D.', 'Sarah M.', 'Michael T.', 'Emma W.', 'David L.', 'Olivia P.', 'James H.', 'Sofia B.'];
  const reviewContents = [
    "Great service, very satisfied!",
    "Staff was helpful and professional.",
    "Waited too long for service, but eventually got what I needed.",
    "Not impressed with the level of service provided.",
    "Excellent experience, will definitely return!",
    "Average service, nothing special.",
    "Very disappointed with my visit today.",
    "The staff went above and beyond to help me.",
    "Facility was clean but the wait time was too long.",
    "Could use improvement in response time."
  ];

  // Generate 200 random reviews
  for (let i = 0; i < 200; i++) {
    const branchIndex = Math.floor(Math.random() * branches.length);
    const branch = branches[branchIndex];
    const rating = Math.floor(Math.random() * 5) + 1;
    
    // Assign sentiment based on rating
    let sentiment: 'positive' | 'neutral' | 'negative';
    if (rating >= 4) sentiment = 'positive';
    else if (rating === 3) sentiment = 'neutral';
    else sentiment = 'negative';
    
    // Create date within the last year
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 365));
    
    reviews.push({
      id: `${i + 1}`,
      branchId: branch.id,
      branchName: branch.name,
      rating,
      content: reviewContents[Math.floor(Math.random() * reviewContents.length)],
      sentiment,
      date: date.toISOString(),
      customerName: names[Math.floor(Math.random() * names.length)]
    });
  }
  
  return reviews;
};

export const reviews = generateReviews();

// Dashboard Stats
export const getDashboardStats = (): DashboardStats => {
  // Calculate total reviews
  const totalReviews = reviews.length;
  
  // Calculate average rating
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / totalReviews;
  
  // Calculate sentiment distribution
  const sentimentCounts = {
    positive: reviews.filter(r => r.sentiment === 'positive').length,
    neutral: reviews.filter(r => r.sentiment === 'neutral').length,
    negative: reviews.filter(r => r.sentiment === 'negative').length
  };
  
  const sentimentDistribution: SentimentDistribution[] = [
    {
      sentiment: 'positive',
      count: sentimentCounts.positive,
      percentage: (sentimentCounts.positive / totalReviews) * 100
    },
    {
      sentiment: 'neutral',
      count: sentimentCounts.neutral,
      percentage: (sentimentCounts.neutral / totalReviews) * 100
    },
    {
      sentiment: 'negative',
      count: sentimentCounts.negative,
      percentage: (sentimentCounts.negative / totalReviews) * 100
    }
  ];
  
  // Calculate rating distribution
  const ratingCounts = {
    1: reviews.filter(r => r.rating === 1).length,
    2: reviews.filter(r => r.rating === 2).length,
    3: reviews.filter(r => r.rating === 3).length,
    4: reviews.filter(r => r.rating === 4).length,
    5: reviews.filter(r => r.rating === 5).length
  };
  
  const ratingDistribution: RatingDistribution[] = [
    {
      rating: 1,
      count: ratingCounts[1],
      percentage: (ratingCounts[1] / totalReviews) * 100
    },
    {
      rating: 2,
      count: ratingCounts[2],
      percentage: (ratingCounts[2] / totalReviews) * 100
    },
    {
      rating: 3,
      count: ratingCounts[3],
      percentage: (ratingCounts[3] / totalReviews) * 100
    },
    {
      rating: 4,
      count: ratingCounts[4],
      percentage: (ratingCounts[4] / totalReviews) * 100
    },
    {
      rating: 5,
      count: ratingCounts[5],
      percentage: (ratingCounts[5] / totalReviews) * 100
    }
  ];
  
  // Calculate monthly trends for the last 12 months
  const monthlyTrends: MonthlyTrend[] = [];
  const today = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const monthDate = new Date();
    monthDate.setMonth(today.getMonth() - i);
    const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
    
    const monthReviews = reviews.filter(review => {
      const reviewDate = new Date(review.date);
      return reviewDate >= monthStart && reviewDate <= monthEnd;
    });
    
    const monthReviewCount = monthReviews.length;
    const monthRatingSum = monthReviews.reduce((sum, review) => sum + review.rating, 0);
    const monthAvgRating = monthReviewCount > 0 ? monthRatingSum / monthReviewCount : 0;
    
    monthlyTrends.push({
      month: monthDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      averageRating: parseFloat(monthAvgRating.toFixed(1)),
      reviewCount: monthReviewCount
    });
  }
  
  return {
    totalReviews,
    averageRating,
    sentimentDistribution,
    ratingDistribution,
    monthlyTrends
  };
};
