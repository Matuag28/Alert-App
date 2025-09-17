
export enum Severity {
  INFO = 'Info',
  WARNING = 'Warning',
  CRITICAL = 'Critical',
}

export enum DeliveryType {
  IN_APP = 'In-App',
  EMAIL = 'Email',
  SMS = 'SMS',
}

export enum VisibilityType {
  ORGANIZATION = 'Entire Organization',
  TEAM = 'Specific Teams',
  USER = 'Specific Users',
}

export interface User {
  id: string;
  name: string;
  teamId: string;
  isAdmin: boolean;
}

export interface Team {
  id: string;
  name: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: Severity;
  deliveryTypes: DeliveryType[];
  visibilityType: VisibilityType;
  visibilityTarget: string[]; // Team IDs or User IDs
  startTime: string; // ISO string
  expiryTime: string; // ISO string
  remindersEnabled: boolean;
  createdAt: string; // ISO string
  isArchived: boolean;
}

export interface UserAlertPreference {
  userId: string;
  alertId: string;
  isRead: boolean;
  snoozedUntil: string | null; // ISO string
}
