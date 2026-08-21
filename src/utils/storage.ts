import type { User, EventItem, Contribution, Receipt, AppNotification } from "../types";
import { SEED_EVENTS, SEED_USERS } from "../constants";

const KEYS = {
  users: "jgm_users",
  session: "jgm_session",
  events: "jgm_events",
  contributions: "jgm_contributions",
  receipts: "jgm_receipts",
  notifications: "jgm_notifications",
};

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Initialize seeds
function init() {
  if (!localStorage.getItem(KEYS.events)) {
    setItem(KEYS.events, SEED_EVENTS);
  }
  if (!localStorage.getItem(KEYS.users)) {
    setItem(KEYS.users, SEED_USERS);
  }
  if (!localStorage.getItem(KEYS.contributions)) {
    setItem(KEYS.contributions, []);
  }
  if (!localStorage.getItem(KEYS.receipts)) {
    setItem(KEYS.receipts, []);
  }
  if (!localStorage.getItem(KEYS.notifications)) {
    setItem(KEYS.notifications, []);
  }
}
init();

// Users
export function getUsers(): User[] {
  return getItem<User[]>(KEYS.users, []);
}

export function getUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(user: User): void {
  const users = getUsers();
  users.push(user);
  setItem(KEYS.users, users);
}

export function updateUser(id: string, updates: Partial<User>): void {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...updates };
    setItem(KEYS.users, users);
  }
}

// Session
export function getSession(): User | null {
  return getItem<User | null>(KEYS.session, null);
}

export function setSession(user: User | null): void {
  setItem(KEYS.session, user);
}

// Events
export function getEvents(): EventItem[] {
  return getItem<EventItem[]>(KEYS.events, []);
}

export function getEventById(id: string): EventItem | undefined {
  return getEvents().find((e) => e.id === id);
}

export function createEvent(event: EventItem): void {
  const events = getEvents();
  events.push(event);
  setItem(KEYS.events, events);
}

export function updateEvent(id: string, updates: Partial<EventItem>): void {
  const events = getEvents();
  const idx = events.findIndex((e) => e.id === id);
  if (idx !== -1) {
    events[idx] = { ...events[idx], ...updates };
    setItem(KEYS.events, events);
  }
}

export function deleteEvent(id: string): void {
  const events = getEvents().filter((e) => e.id !== id);
  setItem(KEYS.events, events);
}

// Contributions
export function getContributions(): Contribution[] {
  return getItem<Contribution[]>(KEYS.contributions, []);
}

export function getContributionsByEvent(eventId: string): Contribution[] {
  return getContributions().filter((c) => c.eventId === eventId);
}

export function addContribution(contribution: Contribution): void {
  const contributions = getContributions();
  contributions.push(contribution);
  setItem(KEYS.contributions, contributions);
  // Update event total
  const event = getEventById(contribution.eventId);
  if (event) {
    const all = getContributionsByEvent(contribution.eventId);
    const total = all.reduce((sum, c) => sum + c.amount, 0);
    const contributorIds = [...new Set(all.map((c) => c.contributorName))];
    updateEvent(contribution.eventId, {
      totalCollected: total,
      contributors: contributorIds,
    });
  }
}

// Receipts
export function getReceipts(): Receipt[] {
  return getItem<Receipt[]>(KEYS.receipts, []);
}

export function getReceiptsByUser(name: string): Receipt[] {
  return getReceipts().filter((r) => r.contributorName === name);
}

export function addReceipt(receipt: Receipt): void {
  const receipts = getReceipts();
  receipts.push(receipt);
  setItem(KEYS.receipts, receipts);
}

export function deleteReceipt(id: string): void {
  const receipts = getReceipts().filter((r) => r.id !== id);
  setItem(KEYS.receipts, receipts);
}

// Notifications
export function getNotifications(): AppNotification[] {
  return getItem<AppNotification[]>(KEYS.notifications, []);
}

export function getNotificationsByUser(userId: string): AppNotification[] {
  return getNotifications()
    .filter((n) => n.userId === userId || n.userId === "all")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addNotification(notification: AppNotification): void {
  const notifications = getNotifications();
  notifications.unshift(notification);
  setItem(KEYS.notifications, notifications);
}

export function markNotificationRead(id: string): void {
  const notifications = getNotifications();
  const idx = notifications.findIndex((n) => n.id === id);
  if (idx !== -1) {
    notifications[idx].read = true;
    setItem(KEYS.notifications, notifications);
  }
}

export function markAllNotificationsRead(userId: string): void {
  const notifications = getNotifications();
  notifications.forEach((n) => {
    if (n.userId === userId || n.userId === "all") n.read = true;
  });
  setItem(KEYS.notifications, notifications);
}

export function getUnreadCount(userId: string): number {
  return getNotifications().filter(
    (n) => (n.userId === userId || n.userId === "all") && !n.read
  ).length;
}

// Seed data reset
export function resetToSeed(): void {
  setItem(KEYS.events, SEED_EVENTS);
  setItem(KEYS.users, SEED_USERS);
  setItem(KEYS.contributions, []);
  setItem(KEYS.receipts, []);
  setItem(KEYS.notifications, []);
}