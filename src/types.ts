export type EventCategory =
  | "Wedding"
  | "Funeral"
  | "Birthday"
  | "Party"
  | "Meeting"
  | "Memorial"
  | "Graduation"
  | "Charity"
  | "Fundraiser"
  | "Anniversary"
  | "Other";

export type EventStatus = "Active" | "Completed" | "Urgent" | "Upcoming";

export interface User {
  id: string;
  name: string;
  email: string;
  country: string;
  mobile: string;
  password: string;
  profilePicture: string;
  role: "user" | "admin";
  blocked: boolean;
  createdAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  category: EventCategory;
  description: string;
  targetAmount: number;
  suggestedContribution: number;
  targetDate: string;
  location: string;
  adminPhone: string;
  adminAccountName: string;
  adminAccountDetails: string;
  status: EventStatus;
  createdBy: string;
  createdAt: string;
  contributors: string[];
  totalCollected: number;
}

export interface Contribution {
  id: string;
  eventId: string;
  contributorName: string;
  contributorPhone: string;
  amount: number;
  reason: string;
  paymentReference: string;
  category: EventCategory;
  createdAt: string;
  approved: boolean;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  eventId: string;
  eventTitle: string;
  category: EventCategory;
  contributorName: string;
  contributorPhone: string;
  amount: number;
  suggestedIndividualTarget: number;
  individualBalance: number;
  eventTotalCollected: number;
  eventTargetAmount: number;
  eventRemainingTarget: number;
  reason: string;
  adminPhone: string;
  createdAt: string;
  watermark: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "admin";
  read: boolean;
  createdAt: string;
}

export type AppView =
  | "events"
  | "my-contributions"
  | "receipt-vault"
  | "calculator"
  | "notifications"
  | "profile"
  | "admin";