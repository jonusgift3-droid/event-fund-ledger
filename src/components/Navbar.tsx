import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  User,
  LogOut,
  Shield,
  ChevronDown,
  Menu,
  X,
  Home,
  Wallet,
  Receipt,
  Calculator,
  BellRing,
  Settings,
  ScrollText,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { getSession, getUnreadCount, setSession, markAllNotificationsRead, getNotificationsByUser } from "@/utils/storage";
import type { AppView, AppNotification } from "@/types";
import { APP_NAME } from "@/constants";

interface NavbarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  onAdminClick: () => void;
  onLogout: () => void;
}

export default function Navbar({ currentView, onViewChange, onAdminClick, onLogout }: NavbarProps) {
  const [session, setSessionState] = useState(getSession());
  const [unread, setUnread] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const refresh = () => {
    const s = getSession();
    setSessionState(s);
    if (s) {
      setUnread(getUnreadCount(s.id));
      setNotifications(getNotificationsByUser(s.id).slice(0, 10));
    }
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    setSession(null);
    onLogout();
  };

  const navItems: { view: AppView; label: string; icon: React.ReactNode }[] = [
    { view: "events", label: "Events", icon: <Home className="h-4 w-4" /> },
    { view: "my-contributions", label: "My Contributions", icon: <Wallet className="h-4 w-4" /> },
    { view: "receipt-vault", label: "Receipts", icon: <Receipt className="h-4 w-4" /> },
    { view: "calculator", label: "Calculator", icon: <Calculator className="h-4 w-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewChange("events")}
            className="flex items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-800 text-white text-xs font-bold">
              JG
            </div>
            <span className="hidden sm:inline text-sm font-bold tracking-tight text-foreground">
              {APP_NAME}
            </span>
          </button>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Button
              key={item.view}
              variant={currentView === item.view ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange(item.view)}
              className={cn(
                "gap-1.5 text-sm",
                currentView === item.view
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.icon}
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-rose-500">
                  {unread > 9 ? "9+" : unread}
                </Badge>
              )}
            </Button>
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  className="absolute right-0 mt-2 w-80 rounded-xl border bg-card shadow-xl overflow-hidden"
                >
                  <div className="flex items-center justify-between p-3 border-b">
                    <span className="text-sm font-semibold">Notifications</span>
                    {unread > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => {
                          if (session) {
                            markAllNotificationsRead(session.id);
                            refresh();
                          }
                        }}
                      >
                        Mark all read
                      </Button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-sm text-muted-foreground">
                        <BellRing className="h-8 w-8 mx-auto mb-2 opacity-40" />
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={cn(
                            "p-3 border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer",
                            !n.read && "bg-emerald-50 dark:bg-emerald-950/20"
                          )}
                        >
                          <div className="flex items-start gap-2">
                            <div className={cn(
                              "mt-0.5 h-2 w-2 rounded-full shrink-0",
                              n.type === "admin" ? "bg-amber-400" : n.type === "success" ? "bg-emerald-400" : n.type === "warning" ? "bg-rose-400" : "bg-blue-400"
                            )} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{n.title}</p>
                              <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                              <p className="text-[10px] text-muted-foreground mt-1">
                                {new Date(n.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Admin Access */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onAdminClick}
            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
            title="Admin Portal"
          >
            <Shield className="h-5 w-5" />
          </Button>

          {/* User Menu */}
          {session ? (
            <div className="hidden md:flex items-center gap-2">
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border-2 border-emerald-200">
                  <AvatarImage src={session.profilePicture || undefined} />
                  <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
                    {session.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block">
                  <p className="text-xs font-medium leading-tight">{session.name}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{session.country}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-rose-500"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => onViewChange("profile")}
            >
              <User className="h-4 w-4 mr-1" />
              Sign In
            </Button>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-background"
          >
            <div className="p-3 space-y-1">
              {navItems.map((item) => (
                <Button
                  key={item.view}
                  variant={currentView === item.view ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "w-full justify-start gap-2",
                    currentView === item.view
                      ? "bg-emerald-600 text-white"
                      : "text-muted-foreground"
                  )}
                  onClick={() => {
                    onViewChange(item.view);
                    setMobileMenuOpen(false);
                  }}
                >
                  {item.icon}
                  {item.label}
                </Button>
              ))}
              {session && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2 text-rose-500 hover:text-rose-600"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}