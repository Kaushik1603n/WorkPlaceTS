export interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  format?: "number" | "currency" | "percentage";
}

export interface TabButtonProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

export interface UserGrowthData {
  month?: string;
  week: string;
  freelancers: number;
  clients: number;
  activeFreelancers?: number;
  repeatClients?: number;
}
export interface JobData {
  month?: string;
  jobsPosted: number;
  hiresMade: number;
}

export interface JobCategoryData {
  name: string;
  value: number;
  color: string;
}

export interface RevenueData {
  week: string;
  platformFee: number;
  dateRange: string;
}

export interface TrafficData {
  source: string;
  visitors: number;
  conversions: number;
}

export interface TopFreelancer {
  userId: string;
  fullName: string;
  email: string;
  averageRating: number;
  feedbackCount: number;
  projects?: number;
}

export interface OverviewMetrics {
  totalUsers: number;
  totalProjects: number;
  totalRevenue: number;
  disputeRate: number;
  activeProjects: number;
  completedProjects: number;
}

export interface PaymentMethod {
  method: string;
  percentage: number;
  amount: number;
}

export interface ConversionFunnelStage {
  stage: string;
  count: number;
  percentage: number;
}
