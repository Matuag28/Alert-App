
import { User, Team, Alert, Severity, DeliveryType, VisibilityType, UserAlertPreference } from './types';

export const TEAMS: Team[] = [
  { id: 'team-1', name: 'Engineering' },
  { id: 'team-2', name: 'Marketing' },
  { id: 'team-3', name: 'Product' },
];

export const USERS: User[] = [
  { id: 'user-admin', name: 'Admin Alice', teamId: 'team-1', isAdmin: true },
  { id: 'user-1', name: 'Engineer Eve', teamId: 'team-1', isAdmin: false },
  { id: 'user-2', name: 'Marketer Mike', teamId: 'team-2', isAdmin: false },
  { id: 'user-3', name: 'Product Pete', teamId: 'team-3', isAdmin: false },
  { id: 'user-4', name: 'Engineer Bob', teamId: 'team-1', isAdmin: false },
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'alert-1',
    title: 'System Maintenance Scheduled',
    message: 'We will be undergoing scheduled maintenance this Sunday from 2 AM to 4 AM UTC. Expect brief service interruptions.',
    severity: Severity.INFO,
    deliveryTypes: [DeliveryType.IN_APP],
    visibilityType: VisibilityType.ORGANIZATION,
    visibilityTarget: [],
    startTime: new Date().toISOString(),
    expiryTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    remindersEnabled: true,
    createdAt: new Date().toISOString(),
    isArchived: false,
  },
  {
    id: 'alert-2',
    title: 'High CPU Usage on Web Servers',
    message: 'We are investigating high CPU usage on our primary web server cluster. Some requests may be slower than usual.',
    severity: Severity.WARNING,
    deliveryTypes: [DeliveryType.IN_APP],
    visibilityType: VisibilityType.TEAM,
    visibilityTarget: ['team-1'], // Engineering
    startTime: new Date().toISOString(),
    expiryTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    remindersEnabled: true,
    createdAt: new Date().toISOString(),
    isArchived: false,
  },
  {
    id: 'alert-3',
    title: 'Database Connectivity Issues',
    message: 'We are experiencing critical issues with our main database. Services are currently down. We are working on a fix.',
    severity: Severity.CRITICAL,
    deliveryTypes: [DeliveryType.IN_APP],
    visibilityType: VisibilityType.TEAM,
    visibilityTarget: ['team-1', 'team-3'], // Engineering & Product
    startTime: new Date().toISOString(),
    expiryTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    remindersEnabled: true,
    createdAt: new Date().toISOString(),
    isArchived: false,
  },
    {
    id: 'alert-4',
    title: 'New Marketing Campaign Launch',
    message: 'The Q3 marketing campaign "Innovate" is now live! Please review the launch documents.',
    severity: Severity.INFO,
    deliveryTypes: [DeliveryType.IN_APP],
    visibilityType: VisibilityType.TEAM,
    visibilityTarget: ['team-2'], // Marketing
    startTime: new Date().toISOString(),
    expiryTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    remindersEnabled: false,
    createdAt: new Date().toISOString(),
    isArchived: false,
  },
  {
    id: 'alert-5',
    title: 'Personalized Alert for Pete',
    message: 'Pete, please review the latest product roadmap document before the meeting tomorrow.',
    severity: Severity.WARNING,
    deliveryTypes: [DeliveryType.IN_APP],
    visibilityType: VisibilityType.USER,
    visibilityTarget: ['user-3'], // Product Pete
    startTime: new Date().toISOString(),
    expiryTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    remindersEnabled: true,
    createdAt: new Date().toISOString(),
    isArchived: false,
  },
];

export const INITIAL_PREFERENCES: UserAlertPreference[] = [
    { userId: 'user-1', alertId: 'alert-1', isRead: true, snoozedUntil: null },
];
