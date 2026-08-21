import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Users,
  Calendar,
  Bell,
  ArrowRight,
  Check,
  X,
  Plus,
  Trash,
  Settings,
  ChevronDown,
  LogOut,
  Menu,
  Home,
  Mail,
  Phone,
  Globe,
  Copy,
  Download,
  Printer,
  Eye,
  Shield,
  Search,
  Filter,
  Clock,
  Wallet,
  CreditCard,
  Receipt,
  FileText,
  AlertCircle,
  Info,
  RefreshCw,
  Upload,
  Image,
  Camera,
  Star,
  Music,
  Briefcase,
  GraduationCap,
  HeartHandshake,
  Cake,
  Gift,
  Heart,
  Sparkles,
  PiggyBank,
  TrendingUp,
  BarChart,
  Lock,
  Key,
  Megaphone,
  MessageSquare,
  UserPlus,
  UserCheck,
  BadgeCheck,
  DollarSign,
  QrCode,
  MapPin,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  XCircle,
  Circle,
  CircleCheck,
  Zap,
  Layout,
  List,
  ArrowUpCircle,
  ArrowDownCircle,
  Edit,
  Pencil,
  ShoppingBag,
  Landmark,
  Banknote,
  ArrowLeft,
  CircleUser,
  CircleAlert,
  LogIn,
  ScrollText,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  BellOff,
  BellDot,
  PlusCircle,
  MinusCircle,
  Minus,
  SearchCheck,
  CheckCheck,
  FilePen,
  Bookmark,
  LayoutGrid,
  DownloadCloud,
  Send,
  ExternalLink,
  Trophy,
  Target,
  Notebook,
  ArrowUp,
  ArrowDown,
  Badge,
  PartyPopper,
  GalleryThumbnails,
  Ban,
  Unlock,
  Pen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  APP_NAME,
  ADMIN_PASSWORD,
  CATEGORIES,
  COUNTRY_CODES,
  AVATAR_PRESETS,
  SEED_EVENTS,
  CATEGORY_WATERMARK_COLORS,
} from "@/constants";
import {
  getSession,
  setSession,
  getUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getContributions,
  getContributionsByEvent,
  addContribution,
  getReceipts,
  getReceiptsByUser,
  addReceipt,
  deleteReceipt,
  getNotifications,
  getNotificationsByUser,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  getUnreadCount,
  resetToSeed,
} from "@/utils/storage";
import type {
  User as UserType,
  EventItem,
  EventCategory,
  EventStatus,
  Contribution,
  Receipt as ReceiptType,
  AppNotification,
  AppView,
} from "@/types";
import Navbar from "@/components/Navbar";
import AdminDashboard from "@/components/AdminDashboard";
import ReceiptModal from "@/components/ReceiptModal";

// Generate a unique receipt number
function generateReceiptNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 99999).toString().padStart(5, "0");
  return `JGM-${year}-${rand}`;
}

function App() {
  const [session, setSessionState] = useState<UserType | null>(getSession());
  const [currentView, setCurrentView] = useState<AppView>("events");
  const [showWelcome, setShowWelcome] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);

  // Auth state
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupCountry, setSignupCountry] = useState("");
  const [signupMobile, setSignupMobile] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupAvatar, setSignupAvatar] = useState("");
  const [signupError, setSignupError] = useState("");
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(-1);

  // Event view
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [showContribution, setShowContribution] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Contribution flow
  const [contribStep, setContribStep] = useState(0);
  const [contribName, setContribName] = useState("");
  const [contribPhone, setContribPhone] = useState("");
  const [contribAmount, setContribAmount] = useState(0);
  const [contribReason, setContribReason] = useState("");
  const [contribRef, setContribRef] = useState("");

  // Receipt
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState<ReceiptType | null>(null);

  // Refresh helper
  const refresh = useCallback(() => {
    setSessionState(getSession());
  }, []);

  // Welcome dismiss
  useEffect(() => {
    const dismissed = sessionStorage.getItem("jgm_welcome_dismissed");
    if (dismissed) setShowWelcome(false);
  }, []);

  const dismissWelcome = () => {
    setShowWelcome(false);
    sessionStorage.setItem("jgm_welcome_dismissed", "true");
  };

  // Auth handlers
  const handleLogin = () => {
    const user = getUserByEmail(loginEmail);
    if (!user) {
      toast.error("User not found");
      return;
    }
    if (user.blocked) {
      toast.error("Account is blocked. Contact admin.");
      return;
    }
    if (user.password !== loginPassword) {
      toast.error("Incorrect password");
      return;
    }
    setSession(user);
    setSessionState(user);
    setShowAuth(false);
    setLoginEmail("");
    setLoginPassword("");
    toast.success(`Welcome back, ${user.name}!`);
    addNotification({
      id: "notif-" + Date.now(),
      userId: user.id,
      title: "Login Successful",
      message: "Welcome back to JG Event Manager!",
      type: "success",
      read: false,
      createdAt: new Date().toISOString(),
    });
  };

  const handleSignup = () => {
    setSignupError("");

    if (!signupName.trim()) {
      setSignupError("Full name is required");
      return;
    }
    if (!signupEmail.trim()) {
      setSignupError("Email is required");
      return;
    }
    if (!signupCountry) {
      setSignupError("Country is required");
      return;
    }
    if (!signupMobile.trim()) {
      setSignupError("Mobile number is required");
      return;
    }
    if (!signupPassword || signupPassword.length < 6) {
      setSignupError("Password must be at least 6 characters");
      return;
    }
    if (!/[a-zA-Z]/.test(signupPassword) || !/\d/.test(signupPassword)) {
      setSignupError("Password must contain both letters and numbers");
      return;
    }

    const existing = getUserByEmail(signupEmail);
    if (existing) {
      setSignupError("Email already registered");
      return;
    }

    const avatar = signupAvatar || AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)];

    const newUser: UserType = {
      id: "user-" + Date.now(),
      name: signupName.trim(),
      email: signupEmail.trim().toLowerCase(),
      country: signupCountry,
      mobile: signupMobile.trim(),
      password: signupPassword,
      profilePicture: avatar,
      role: "user",
      blocked: false,
      createdAt: new Date().toISOString(),
    };

    createUser(newUser);
    setSession(newUser);
    setSessionState(newUser);
    setShowAuth(false);
    resetSignupForm();
    toast.success("Account created successfully!");
    addNotification({
      id: "notif-" + Date.now(),
      userId: newUser.id,
      title: "Welcome to JG Event Manager!",
      message: "Your account has been created. Start exploring events and contributing!",
      type: "success",
      read: false,
      createdAt: new Date().toISOString(),
    });
  };

  const resetSignupForm = () => {
    setSignupName("");
    setSignupEmail("");
    setSignupCountry("");
    setSignupMobile("");
    setSignupPassword("");
    setSignupAvatar("");
    setSelectedAvatarIndex(-1);
    setSignupError("");
  };

  const handleLogout = () => {
    setSession(null);
    setSessionState(null);
    setCurrentView("events");
    toast.success("Logged out");
  };

  // Contribution flow
  const openContribution = (event: EventItem) => {
    setSelectedEvent(event);
    setContribStep(0);
    setContribName(session?.name || "");
    setContribPhone(session?.mobile || "");
    setContribAmount(event.suggestedContribution);
    setContribReason("");
    setContribRef("");
    setShowContribution(true);
  };

  const handleContribute = () => {
    if (!selectedEvent) return;
    if (!contribName.trim() || !contribPhone.trim() || contribAmount <= 0) {
      toast.error("Please fill all required fields");
      return;
    }

    const contributions = getContributionsByEvent(selectedEvent.id);
    const totalContributions = contributions.reduce((s, c) => s + c.amount, 0);
    const newTotalCollected = totalContributions + contribAmount;
    const remaining = selectedEvent.targetAmount - newTotalCollected;

    if (contribStep < 2) {
      setContribStep(contribStep + 1);
      return;
    }

    // Create contribution
    const contribution: Contribution = {
      id: "cont-" + Date.now(),
      eventId: selectedEvent.id,
      contributorName: contribName.trim(),
      contributorPhone: contribPhone.trim(),
      amount: contribAmount,
      reason: contribReason.trim(),
      paymentReference: contribRef.trim(),
      category: selectedEvent.category,
      createdAt: new Date().toISOString(),
      approved: true,
    };

    addContribution(contribution);

    // Create receipt
    const individualBalance = Math.max(0, selectedEvent.suggestedContribution - contribAmount);
    const receipt: ReceiptType = {
      id: "receipt-" + Date.now(),
      receiptNumber: generateReceiptNumber(),
      eventId: selectedEvent.id,
      eventTitle: selectedEvent.title,
      category: selectedEvent.category,
      contributorName: contribName.trim(),
      contributorPhone: contribPhone.trim(),
      amount: contribAmount,
      suggestedIndividualTarget: selectedEvent.suggestedContribution,
      individualBalance,
      eventTotalCollected: newTotalCollected,
      eventTargetAmount: selectedEvent.targetAmount,
      eventRemainingTarget: Math.max(0, remaining),
      reason: contribReason.trim(),
      adminPhone: selectedEvent.adminPhone,
      createdAt: new Date().toISOString(),
      watermark: selectedEvent.category,
    };

    addReceipt(receipt);
    setCurrentReceipt(receipt);
    setShowContribution(false);
    setShowReceipt(true);

    // Admin notification
    addNotification({
      id: "notif-" + Date.now(),
      userId: "all",
      title: "New Contribution!",
      message: `${contribName.trim()} contributed $${contribAmount} to "${selectedEvent.title}"`,
      type: "success",
      read: false,
      createdAt: new Date().toISOString(),
    });

    toast.success("Contribution submitted! Receipt generated.");
    setContribStep(0);
  };

  // Receipt vault
  const receipts = getReceipts();
  const userReceipts = session ? getReceiptsByUser(session.name) : [];

  // Events
  const events = getEvents();
  const filteredEvents = categoryFilter === "all" ? events : events.filter((e) => e.category === categoryFilter);

  // My contributions
  const myContributions = session
    ? getContributions().filter((c) => c.contributorName === session.name)
    : [];

  // Balance calculator
  const [calcEventId, setCalcEventId] = useState("");
  const [calcMyAmount, setCalcMyAmount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950 text-foreground">
      {/* Navbar */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        onAdminClick={() => setShowAdmin(true)}
        onLogout={handleLogout}
      />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Welcome Banner */}
        <AnimatePresence>
          {showWelcome && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              className="mb-6 relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 p-6 md:p-8 text-white"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15)_0%,transparent_60%)]" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur text-white text-lg font-bold">
                    JG
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">{APP_NAME}</h2>
                    <p className="text-sm text-emerald-100">Group Contribution Planning</p>
                  </div>
                </div>
                <p className="text-sm text-emerald-50 max-w-lg mb-4">
                  {session
                    ? `Welcome back, ${session.name}! Plan events, contribute, and track your payments.`
                    : "Welcome! Sign up to start planning events, contributing with your group, and tracking contributions."}
                </p>
                <div className="flex items-center gap-2">
                  {!session && (
                    <Button
                      size="sm"
                      className="bg-white text-emerald-700 hover:bg-emerald-50"
                      onClick={() => {
                        setShowAuth(true);
                        setAuthMode("signup");
                        dismissWelcome();
                      }}
                    >
                      <UserPlus className="h-4 w-4 mr-1.5" />
                      Get Started
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={dismissWelcome}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Dismiss
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content based on view */}
        {currentView === "events" && (
          <EventsView
            events={filteredEvents}
            categoryFilter={categoryFilter}
            onCategoryFilter={setCategoryFilter}
            onEventSelect={setSelectedEvent}
            onContribute={openContribution}
            session={session}
            onAuthRequired={() => {
              setShowAuth(true);
              setAuthMode("login");
            }}
          />
        )}

        {currentView === "my-contributions" && (
          <MyContributionsView contributions={myContributions} events={events} />
        )}

        {currentView === "receipt-vault" && (
          <ReceiptVaultView
            receipts={session ? userReceipts : receipts}
            onViewReceipt={(r) => {
              setCurrentReceipt(r);
              setShowReceipt(true);
            }}
            onDeleteReceipt={(id) => {
              deleteReceipt(id);
              toast.success("Receipt deleted");
              refresh();
            }}
          />
        )}

        {currentView === "calculator" && (
          <CalculatorView
            events={events}
            calcEventId={calcEventId}
            setCalcEventId={setCalcEventId}
            calcMyAmount={calcMyAmount}
            setCalcMyAmount={setCalcMyAmount}
          />
        )}

        {currentView === "profile" && (
          <ProfileView
            session={session}
            onAuth={() => {
              setShowAuth(true);
              setAuthMode("login");
            }}
            onSignup={() => {
              setShowAuth(true);
              setAuthMode("signup");
            }}
          />
        )}
      </main>

      {/* Auth Dialog */}
      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {authMode === "login" ? "Welcome Back" : "Create Account"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {authMode === "login"
                ? "Sign in to manage your contributions"
                : "Join JG Event Manager to start planning events"}
            </DialogDescription>
          </DialogHeader>

          {authMode === "login" ? (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Email</Label>
                <Input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="h-9 text-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Password</Label>
                <Input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-9 text-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={handleLogin}>
                <LogIn className="h-4 w-4 mr-1.5" />
                Sign In
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Don't have an account?{" "}
                <button
                  className="text-emerald-600 hover:underline font-medium"
                  onClick={() => setAuthMode("signup")}
                >
                  Sign up
                </button>
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {/* Avatar Selector */}
              <div className="space-y-1.5">
                <Label className="text-xs">Profile Picture</Label>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_PRESETS.slice(0, 8).map((url, i) => (
                    <button
                      key={i}
                      className={cn(
                        "h-10 w-10 rounded-full border-2 transition-all overflow-hidden",
                        selectedAvatarIndex === i
                          ? "border-emerald-500 ring-2 ring-emerald-200 scale-110"
                          : "border-gray-200 hover:border-emerald-300"
                      )}
                      onClick={() => {
                        setSelectedAvatarIndex(i);
                        setSignupAvatar(url);
                      }}
                    >
                      <img src={url} alt="Avatar" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Full Name *</Label>
                <Input value={signupName} onChange={(e) => setSignupName(e.target.value)} placeholder="John Doe" className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Email *</Label>
                <Input type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="your@email.com" className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Country *</Label>
                <Select value={signupCountry} onValueChange={setSignupCountry}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    {COUNTRY_CODES.map((c) => (
                      <SelectItem key={c.code + c.name} value={c.name}>
                        {c.flag} {c.name} ({c.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Mobile Number *</Label>
                <Input value={signupMobile} onChange={(e) => setSignupMobile(e.target.value)} placeholder="+1 (555) 000-0000" className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Password *</Label>
                <Input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="At least 6 characters (letters + numbers)"
                  className="h-9 text-sm"
                />
                <p className="text-[10px] text-muted-foreground">
                  Must be at least 6 characters with both letters and numbers
                </p>
              </div>

              {signupError && (
                <p className="text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {signupError}
                </p>
              )}

              <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={handleSignup}>
                <UserPlus className="h-4 w-4 mr-1.5" />
                Create Account
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Already have an account?{" "}
                <button
                  className="text-emerald-600 hover:underline font-medium"
                  onClick={() => {
                    setAuthMode("login");
                    setSignupError("");
                  }}
                >
                  Sign in
                </button>
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Event Detail / Contribution Modal */}
      <Dialog open={!!selectedEvent && !showContribution} onOpenChange={(o) => !o && setSelectedEvent(null)}>
        {selectedEvent && (
          <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedEvent.title}</DialogTitle>
            </DialogHeader>
            <EventDetailCard
              event={selectedEvent}
              onContribute={() => openContribution(selectedEvent)}
              session={session}
              onAuthRequired={() => {
                setShowAuth(true);
                setAuthMode("login");
              }}
            />
          </DialogContent>
        )}
      </Dialog>

      {/* Contribution Stepper Modal */}
      <Dialog open={showContribution} onOpenChange={(o) => !o && setShowContribution(false)}>
        {selectedEvent && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {contribStep === 0 && "Step 1: Admin Deposit Details"}
                {contribStep === 1 && "Step 2: Your Details"}
                {contribStep === 2 && "Step 3: Balance Summary"}
              </DialogTitle>
              <DialogDescription>
                {contribStep === 0 && "Send your contribution to the admin account below"}
                {contribStep === 1 && "Enter your information for the receipt"}
                {contribStep === 2 && "Review your contribution before submitting"}
              </DialogDescription>
            </DialogHeader>

            {contribStep === 0 && (
              <div className="space-y-4">
                <Card className="p-4 bg-amber-50 border-amber-200">
                  <h4 className="text-sm font-semibold text-amber-800 mb-2">Admin Deposit Information</h4>
                  <div className="space-y-1.5 text-sm">
                    <p><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{selectedEvent.adminPhone}</span></p>
                    <p><span className="text-muted-foreground">Account:</span> <span className="font-medium">{selectedEvent.adminAccountName}</span></p>
                    <p><span className="text-muted-foreground">Details:</span> <span className="font-medium">{selectedEvent.adminAccountDetails}</span></p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 h-8 text-xs"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedEvent.adminPhone);
                      toast.success("Admin number copied!");
                    }}
                  >
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    Copy Phone Number
                  </Button>
                </Card>
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => setContribStep(1)}
                  >
                    I've Made the Payment
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            )}

            {contribStep === 1 && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Your Name *</Label>
                  <Input value={contribName} onChange={(e) => setContribName(e.target.value)} className="h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Telephone Number *</Label>
                  <Input value={contribPhone} onChange={(e) => setContribPhone(e.target.value)} className="h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Amount Paid ($) *</Label>
                  <Input
                    type="number"
                    value={contribAmount || ""}
                    onChange={(e) => setContribAmount(Number(e.target.value))}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Reason / Note</Label>
                  <Input value={contribReason} onChange={(e) => setContribReason(e.target.value)} placeholder="Optional note" className="h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Payment Reference</Label>
                  <Input value={contribRef} onChange={(e) => setContribRef(e.target.value)} placeholder="Transaction ID (optional)" className="h-9 text-sm" />
                </div>
                <div className="flex justify-between">
                  <Button size="sm" variant="outline" onClick={() => setContribStep(0)}>
                    <ArrowLeft className="h-4 w-4 mr-1.5" />
                    Back
                  </Button>
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => {
                      if (!contribName.trim() || !contribPhone.trim() || contribAmount <= 0) {
                        toast.error("Name, phone, and amount are required");
                        return;
                      }
                      setContribStep(2);
                    }}
                  >
                    Review Balance
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            )}

            {contribStep === 2 && (
              <div className="space-y-4">
                <Card className="p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Your Contribution</span>
                    <span className="font-bold text-emerald-600">${contribAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Suggested Individual Target</span>
                    <span className="font-medium">${selectedEvent.suggestedContribution.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Individual Balance</span>
                    <span className={cn(
                      "font-semibold",
                      contribAmount >= selectedEvent.suggestedContribution ? "text-emerald-600" : "text-amber-600"
                    )}>
                      {contribAmount >= selectedEvent.suggestedContribution
                        ? `$${(contribAmount - selectedEvent.suggestedContribution).toLocaleString()} Covered`
                        : `$${(selectedEvent.suggestedContribution - contribAmount).toLocaleString()} Due`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Event Total Collected</span>
                    <span className="font-medium">
                      ${(selectedEvent.totalCollected + contribAmount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Event Target</span>
                    <span className="font-medium">${selectedEvent.targetAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Event Remaining</span>
                    <span className={selectedEvent.targetAmount - (selectedEvent.totalCollected + contribAmount) <= 0 ? "text-emerald-600" : "text-rose-600"}>
                      {selectedEvent.targetAmount - (selectedEvent.totalCollected + contribAmount) <= 0
                        ? "Goal Reached!"
                        : `$${(selectedEvent.targetAmount - selectedEvent.totalCollected - contribAmount).toLocaleString()}`}
                    </span>
                  </div>
                </Card>
                <div className="flex justify-between">
                  <Button size="sm" variant="outline" onClick={() => setContribStep(1)}>
                    <ArrowLeft className="h-4 w-4 mr-1.5" />
                    Back
                  </Button>
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={handleContribute}
                  >
                    <CheckCircle className="h-4 w-4 mr-1.5" />
                    Confirm & Generate Receipt
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        )}
      </Dialog>

      {/* Receipt Modal */}
      <ReceiptModal
        receipt={currentReceipt}
        open={showReceipt}
        onClose={() => {
          setShowReceipt(false);
          setCurrentReceipt(null);
          refresh();
        }}
      />

      {/* Admin Dashboard */}
      <AdminDashboard
        open={showAdmin}
        onClose={() => {
          setShowAdmin(false);
          refresh();
        }}
      />
    </div>
  );
}

/* ---- Events View ---- */
function EventsView({
  events,
  categoryFilter,
  onCategoryFilter,
  onEventSelect,
  onContribute,
  session,
  onAuthRequired,
}: {
  events: EventItem[];
  categoryFilter: string;
  onCategoryFilter: (v: string) => void;
  onEventSelect: (e: EventItem) => void;
  onContribute: (e: EventItem) => void;
  session: UserType | null;
  onAuthRequired: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold tracking-tight">Events</h1>
        <div className="flex items-center gap-2">
          <Select value={categoryFilter} onValueChange={onCategoryFilter}>
            <SelectTrigger className="h-8 w-36 text-xs">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  <span className={c.color}>{c.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">No events in this category yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => {
            const cat = CATEGORIES.find((c) => c.value === event.category);
            const progress = event.targetAmount > 0 ? (event.totalCollected / event.targetAmount) * 100 : 0;
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                layout
              >
                <Card
                  className="group cursor-pointer overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200"
                  onClick={() => onEventSelect(event)}
                >
                  <div className={cn("h-2", cat?.bgColor.replace("100", "500"))} />
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <UIBadge className={cn(cat?.bgColor, cat?.color, "border-0 text-[10px]")}>
                        {event.category}
                      </UIBadge>
                      <UIBadge
                        variant="outline"
                        className={cn(
                          "text-[10px]",
                          event.status === "Active" && "border-emerald-300 text-emerald-700",
                          event.status === "Urgent" && "border-rose-300 text-rose-700",
                          event.status === "Completed" && "border-blue-300 text-blue-700",
                          event.status === "Upcoming" && "border-amber-300 text-amber-700"
                        )}
                      >
                        {event.status}
                      </UIBadge>
                    </div>
                    <h3 className="text-sm font-semibold mb-1 line-clamp-1">{event.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{event.description}</p>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Raised</span>
                        <span className="font-medium">
                          ${event.totalCollected.toLocaleString()} / ${event.targetAmount.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={Math.min(progress, 100)} className="h-2" />
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>{event.contributors.length} contributor(s)</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </div>
                      <Button
                        size="sm"
                        className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!session) {
                            onAuthRequired();
                            return;
                          }
                          onContribute(event);
                        }}
                      >
                        <DollarSign className="h-3 w-3 mr-1" />
                        Contribute
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---- Event Detail Card ---- */
function EventDetailCard({
  event,
  onContribute,
  session,
  onAuthRequired,
}: {
  event: EventItem;
  onContribute: () => void;
  session: UserType | null;
  onAuthRequired: () => void;
}) {
  const cat = CATEGORIES.find((c) => c.value === event.category);
  const progress = event.targetAmount > 0 ? (event.totalCollected / event.targetAmount) * 100 : 0;
  const contributions = getContributionsByEvent(event.id);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <UIBadge className={cn(cat?.bgColor, cat?.color, "border-0")}>{event.category}</UIBadge>
        <UIBadge variant="outline" className={cn(
          "text-xs",
          event.status === "Active" && "border-emerald-300 text-emerald-700",
          event.status === "Urgent" && "border-rose-300 text-rose-700",
          event.status === "Completed" && "border-blue-300 text-blue-700",
          event.status === "Upcoming" && "border-amber-300 text-amber-700"
        )}>{event.status}</UIBadge>
      </div>

      <p className="text-sm text-muted-foreground">{event.description}</p>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-muted-foreground">Target Date</span>
          <p className="font-medium">{new Date(event.targetDate).toLocaleDateString()}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Location</span>
          <p className="font-medium">{event.location}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Suggested Contribution</span>
          <p className="font-medium">${event.suggestedContribution.toLocaleString()}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Admin Phone</span>
          <p className="font-medium">{event.adminPhone}</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">${event.totalCollected.toLocaleString()} / ${event.targetAmount.toLocaleString()}</span>
        </div>
        <Progress value={Math.min(progress, 100)} className="h-2.5" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{event.contributors.length} contributor(s)</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-semibold mb-2">Recent Contributions</h4>
        {contributions.length === 0 ? (
          <p className="text-xs text-muted-foreground">No contributions yet. Be the first!</p>
        ) : (
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {contributions.slice(-5).reverse().map((c) => (
              <div key={c.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="font-medium">{c.contributorName}</span>
                </div>
                <span className="font-bold text-emerald-600">${c.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button
        className="w-full bg-emerald-600 hover:bg-emerald-700"
        onClick={() => {
          if (!session) {
            onAuthRequired();
            return;
          }
          onContribute();
        }}
      >
        <DollarSign className="h-4 w-4 mr-1.5" />
        Contribute Now
      </Button>
    </div>
  );
}

/* ---- My Contributions View ---- */
function MyContributionsView({ contributions, events }: { contributions: Contribution[]; events: EventItem[] }) {
  return (
    <div>
      <h1 className="text-xl font-bold tracking-tight mb-4">My Contributions</h1>
      {contributions.length === 0 ? (
        <div className="text-center py-16">
          <Wallet className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground mb-4">You haven't made any contributions yet</p>
          <Button variant="outline" className="text-xs" onClick={() => window.location.reload()}>
            Browse Events
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {contributions.map((c) => {
            const event = events.find((e) => e.id === c.eventId);
            return (
              <Card key={c.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{event?.title || "Unknown Event"}</p>
                    <p className="text-xs text-muted-foreground">{c.reason || "No reason"}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(c.createdAt).toLocaleDateString()} · Ref: {c.paymentReference || "N/A"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-600">${c.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">{c.category}</p>
                  </div>
                </div>
              </Card>
            );
          })}
          <Card className="p-4 bg-emerald-50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Total Contributed</span>
              <span className="text-lg font-bold text-emerald-700">
                ${contributions.reduce((s, c) => s + c.amount, 0).toLocaleString()}
              </span>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ---- Receipt Vault View ---- */
function ReceiptVaultView({
  receipts,
  onViewReceipt,
  onDeleteReceipt,
}: {
  receipts: ReceiptType[];
  onViewReceipt: (r: ReceiptType) => void;
  onDeleteReceipt: (id: string) => void;
}) {
  return (
    <div>
      <h1 className="text-xl font-bold tracking-tight mb-4">Receipt Vault</h1>
      {receipts.length === 0 ? (
        <div className="text-center py-16">
          <Receipt className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">No receipts saved yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {receipts.map((r) => (
            <Card key={r.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => onViewReceipt(r)}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-mono font-bold text-emerald-700">{r.receiptNumber}</p>
                  <p className="text-sm font-semibold mt-1">{r.eventTitle}</p>
                  <p className="text-xs text-muted-foreground">{r.contributorName} · ${r.amount.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => { e.stopPropagation(); onViewReceipt(r); }}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-rose-500"
                    onClick={(e) => { e.stopPropagation(); onDeleteReceipt(r.id); }}
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---- Calculator View ---- */
function CalculatorView({
  events,
  calcEventId,
  setCalcEventId,
  calcMyAmount,
  setCalcMyAmount,
}: {
  events: EventItem[];
  calcEventId: string;
  setCalcEventId: (v: string) => void;
  calcMyAmount: number;
  setCalcMyAmount: (v: number) => void;
}) {
  const selectedEvent = events.find((e) => e.id === calcEventId);
  const contributions = calcEventId ? getContributionsByEvent(calcEventId) : [];
  const totalCollected = contributions.reduce((s, c) => s + c.amount, 0);
  const suggestedTotal = contributions.length * (selectedEvent?.suggestedContribution || 0);
  const eventTotalCollectedWithMine = totalCollected + calcMyAmount;
  const remaining = selectedEvent ? selectedEvent.targetAmount - eventTotalCollectedWithMine : 0;
  const myBalance = selectedEvent ? selectedEvent.suggestedContribution - calcMyAmount : 0;

  return (
    <div>
      <h1 className="text-xl font-bold tracking-tight mb-4">Balance Calculator</h1>
      <Card className="p-4 max-w-lg">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Select Event</Label>
            <Select value={calcEventId} onValueChange={setCalcEventId}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Choose an event" />
              </SelectTrigger>
              <SelectContent>
                {events.map((e) => (
                  <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedEvent && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs">Your Contribution Amount ($)</Label>
                <Input
                  type="number"
                  value={calcMyAmount || ""}
                  onChange={(e) => setCalcMyAmount(Number(e.target.value))}
                  className="h-9 text-sm"
                  placeholder="Enter amount"
                />
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Individual Balance
                </h4>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Suggested per person</span>
                  <span className="font-medium">${selectedEvent.suggestedContribution.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Your contribution</span>
                  <span className="font-medium">${calcMyAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Your balance</span>
                  <span className={myBalance <= 0 ? "text-emerald-600" : "text-amber-600"}>
                    {myBalance <= 0
                      ? `$${Math.abs(myBalance).toLocaleString()} excess`
                      : `$${myBalance.toLocaleString()} due`}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Event Balance
                </h4>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Event Target</span>
                  <span className="font-medium">${selectedEvent.targetAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current total</span>
                  <span className="font-medium">${totalCollected.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">With your contribution</span>
                  <span className="font-medium">${eventTotalCollectedWithMine.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Remaining target</span>
                  <span className={remaining <= 0 ? "text-emerald-600" : "text-rose-600"}>
                    {remaining <= 0 ? "Goal Reached!" : `$${remaining.toLocaleString()}`}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

/* ---- Profile View ---- */
function ProfileView({
  session,
  onAuth,
  onSignup,
}: {
  session: UserType | null;
  onAuth: () => void;
  onSignup: () => void;
}) {
  if (!session) {
    return (
      <div className="text-center py-16">
        <CircleUser className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
        <h2 className="text-xl font-bold mb-2">Welcome to {APP_NAME}</h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
          Sign in to manage your profile, view contributions, and access your receipts.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={onAuth}>
            <LogIn className="h-4 w-4 mr-1.5" />
            Sign In
          </Button>
          <Button variant="outline" onClick={onSignup}>
            <UserPlus className="h-4 w-4 mr-1.5" />
            Create Account
          </Button>
        </div>
      </div>
    );
  }

  const contributions = getContributions().filter((c) => c.contributorName === session.name);
  const totalContributed = contributions.reduce((s, c) => s + c.amount, 0);
  const receipts = getReceiptsByUser(session.name);

  return (
    <div className="max-w-lg mx-auto">
      <Card className="p-6">
        <div className="flex flex-col items-center mb-6">
          <Avatar className="h-20 w-20 border-4 border-emerald-200 mb-3">
            <AvatarImage src={session.profilePicture || undefined} />
            <AvatarFallback className="text-2xl bg-emerald-100 text-emerald-700">
              {session.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-lg font-bold">{session.name}</h2>
          <p className="text-sm text-muted-foreground">{session.email}</p>
          <UIBadge variant="outline" className="mt-1 text-xs">{session.role}</UIBadge>
        </div>

        <Separator className="mb-4" />

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Country</span>
            <span className="font-medium">{session.country}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mobile</span>
            <span className="font-medium">{session.mobile}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Member Since</span>
            <span className="font-medium">{new Date(session.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xl font-bold text-emerald-600">{contributions.length}</p>
            <p className="text-[10px] text-muted-foreground">Contributions</p>
          </div>
          <div>
            <p className="text-xl font-bold text-emerald-600">${totalContributed.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">Total</p>
          </div>
          <div>
            <p className="text-xl font-bold text-emerald-600">{receipts.length}</p>
            <p className="text-[10px] text-muted-foreground">Receipts</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default App;