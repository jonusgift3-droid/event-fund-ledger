import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Lock,
  Plus,
  Trash,
  Edit,
  Users,
  UserCheck,
  UserX,
  Megaphone,
  MessageSquare,
  Shield,
  DollarSign,
  Calendar,
  Check,
  AlertCircle,
  BarChart,
  TrendingUp,
  ChevronDown,
  Eye,
  EyeOff,
  CircleCheck,
  Ban,
  Send,
  Settings,
  Bell,
  LogOut,
  Wallet,
  Receipt,
  Banknote,
  Landmark,
  CircleDollarSign,
  Sparkles,
  Activity,
  ChartBar,
  PieChart,
  Key,
  Unlock,
  GalleryThumbnails,
  FileText,
  ScrollText,
  BadgeCheck,
  Circle,
  Sliders,
  FilePen,
  Download,
  Search,
  Award,
  Target,
  Zap,
  Layout,
  Grid,
  List,
  Briefcase,
  Heart,
  Gift,
  GraduationCap,
  Music,
  Cake,
  PartyPopper,
  HeartHandshake,
  Star,
  Trophy,
  Medal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ADMIN_PASSWORD, CATEGORIES, APP_NAME } from "@/constants";
import {
  getUsers,
  getEvents,
  getContributions,
  getReceipts,
  getUserById,
  createEvent,
  updateEvent,
  deleteEvent,
  updateUser,
  addNotification,
  getNotifications,
  getNotificationsByUser,
  getSession,
} from "@/utils/storage";
import type { EventItem, EventCategory, EventStatus, User, AppNotification } from "@/types";

interface AdminDashboardProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminDashboard({ open, onClose }: AdminDashboardProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const session = getSession();
  const users = getUsers();
  const events = getEvents();
  const contributions = getContributions();
  const receipts = getReceipts();
  const notifications = getNotifications();

  const totalCollected = events.reduce((sum, e) => sum + e.totalCollected, 0);
  const totalTarget = events.reduce((sum, e) => sum + e.targetAmount, 0);
  const activeEvents = events.filter((e) => e.status === "Active").length;
  const totalContributors = new Set(contributions.map((c) => c.contributorName)).size;

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setPasswordError(false);
      setPassword("");
      toast.success("Admin portal unlocked!");
    } else {
      setPasswordError(true);
      toast.error("Invalid admin password");
    }
  };

  // Admin can only access if they are logged in as admin user
  const canAccess = session?.role === "admin" || authenticated;

  // Reset when closing
  const handleClose = () => {
    setAuthenticated(false);
    setPassword("");
    setPasswordError(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 md:p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-20 flex items-center justify-between p-4 border-b bg-card/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 text-white">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold">Admin Dashboard</h2>
                  <p className="text-xs text-muted-foreground">{APP_NAME} Management</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {!canAccess ? (
              /* Password Gate */
              <div className="flex flex-col items-center justify-center p-8 md:p-16">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 mb-4">
                  <Lock className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold mb-1">Admin Access Required</h3>
                <p className="text-sm text-muted-foreground mb-6 text-center max-w-xs">
                  Enter the admin password to access the management dashboard.
                </p>
                <div className="w-full max-w-xs space-y-3">
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter admin password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError(false);
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      className={cn(passwordError && "border-rose-500")}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                  {passwordError && (
                    <p className="text-xs text-rose-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Incorrect password. Please try again.
                    </p>
                  )}
                  <Button className="w-full bg-amber-600 hover:bg-amber-700" onClick={handleLogin}>
                    <Unlock className="h-4 w-4 mr-1.5" />
                    Unlock Dashboard
                  </Button>
                </div>
              </div>
            ) : (
              /* Dashboard Content */
              <div className="p-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4 flex-wrap h-auto">
                    <TabsTrigger value="overview" className="text-xs gap-1.5">
                      <BarChart className="h-3.5 w-3.5" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="events" className="text-xs gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Events
                    </TabsTrigger>
                    <TabsTrigger value="users" className="text-xs gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      Users
                    </TabsTrigger>
                    <TabsTrigger value="contributions" className="text-xs gap-1.5">
                      <Wallet className="h-3.5 w-3.5" />
                      Contributions
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="text-xs gap-1.5">
                      <Bell className="h-3.5 w-3.5" />
                      Notify
                    </TabsTrigger>
                    <TabsTrigger value="receipts" className="text-xs gap-1.5">
                      <Receipt className="h-3.5 w-3.5" />
                      Receipts
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="text-xs gap-1.5">
                      <Settings className="h-3.5 w-3.5" />
                      Settings
                    </TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Card className="p-3">
                        <div className="flex items-center gap-2 text-emerald-600 mb-1">
                          <DollarSign className="h-4 w-4" />
                          <span className="text-xs text-muted-foreground">Total Collected</span>
                        </div>
                        <p className="text-xl font-bold">${totalCollected.toLocaleString()}</p>
                      </Card>
                      <Card className="p-3">
                        <div className="flex items-center gap-2 text-amber-600 mb-1">
                          <Target className="h-4 w-4" />
                          <span className="text-xs text-muted-foreground">Total Target</span>
                        </div>
                        <p className="text-xl font-bold">${totalTarget.toLocaleString()}</p>
                      </Card>
                      <Card className="p-3">
                        <div className="flex items-center gap-2 text-blue-600 mb-1">
                          <Calendar className="h-4 w-4" />
                          <span className="text-xs text-muted-foreground">Active Events</span>
                        </div>
                        <p className="text-xl font-bold">{activeEvents}</p>
                      </Card>
                      <Card className="p-3">
                        <div className="flex items-center gap-2 text-violet-600 mb-1">
                          <Users className="h-4 w-4" />
                          <span className="text-xs text-muted-foreground">Contributors</span>
                        </div>
                        <p className="text-xl font-bold">{totalContributors}</p>
                      </Card>
                    </div>
                    <Card className="p-4">
                      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                        Category Breakdown
                      </h3>
                      <div className="space-y-2">
                        {CATEGORIES.map((cat) => {
                          const catEvents = events.filter((e) => e.category === cat.value);
                          const catTotal = catEvents.reduce((s, e) => s + e.totalCollected, 0);
                          if (catTotal === 0) return null;
                          return (
                            <div key={cat.value} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <div className={cn("h-2.5 w-2.5 rounded-full", cat.bgColor.replace("bg-", "bg-").replace("100", "500"))} />
                                <span>{cat.label}</span>
                              </div>
                              <span className="font-medium">${catTotal.toLocaleString()}</span>
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  </TabsContent>

                  {/* Events Tab */}
                  <TabsContent value="events" className="space-y-4">
                    <EventManager events={events} />
                  </TabsContent>

                  {/* Users Tab */}
                  <TabsContent value="users" className="space-y-4">
                    <UserManager users={users} />
                  </TabsContent>

                  {/* Contributions Tab */}
                  <TabsContent value="contributions" className="space-y-4">
                    <ContributionManager contributions={contributions} />
                  </TabsContent>

                  {/* Notifications Tab */}
                  <TabsContent value="notifications" className="space-y-4">
                    <NotificationManager />
                  </TabsContent>

                  {/* Receipts Tab */}
                  <TabsContent value="receipts" className="space-y-4">
                    <ReceiptAdminView receipts={receipts} />
                  </TabsContent>

                  {/* Settings Tab */}
                  <TabsContent value="settings" className="space-y-4">
                    <SettingsPanel />
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---- Event Manager ---- */
function EventManager({ events }: { events: EventItem[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    category: "Other" as EventCategory,
    description: "",
    targetAmount: 1000,
    suggestedContribution: 50,
    targetDate: "",
    location: "",
    adminPhone: "",
    adminAccountName: "",
    adminAccountDetails: "",
    status: "Active" as EventStatus,
  });

  const resetForm = () => {
    setForm({
      title: "",
      category: "Other",
      description: "",
      targetAmount: 1000,
      suggestedContribution: 50,
      targetDate: "",
      location: "",
      adminPhone: "",
      adminAccountName: "",
      adminAccountDetails: "",
      status: "Active",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (e: EventItem) => {
    setForm({
      title: e.title,
      category: e.category,
      description: e.description,
      targetAmount: e.targetAmount,
      suggestedContribution: e.suggestedContribution,
      targetDate: e.targetDate,
      location: e.location,
      adminPhone: e.adminPhone,
      adminAccountName: e.adminAccountName,
      adminAccountDetails: e.adminAccountDetails,
      status: e.status,
    });
    setEditingId(e.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.title || !form.targetDate) {
      toast.error("Title and target date are required");
      return;
    }
    if (editingId) {
      updateEvent(editingId, form);
      toast.success("Event updated!");
    } else {
      const newEvent: EventItem = {
        id: "evt-" + Date.now(),
        ...form,
        createdBy: "admin-001",
        createdAt: new Date().toISOString(),
        contributors: [],
        totalCollected: 0,
      };
      createEvent(newEvent);
      toast.success("Event created!");
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteEvent(id);
    toast.success("Event deleted");
  };

  const handleComplete = (id: string) => {
    updateEvent(id, { status: "Completed" });
    toast.success("Event marked as completed");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Events ({events.length})</h3>
        <Button size="sm" className="h-8 gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowForm(true)}>
          <Plus className="h-3.5 w-3.5" />
          New Event
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-3"
          >
            <Card className="p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Title</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Event title" className="h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Category</Label>
                  <Select value={form.category} onValueChange={(v: EventCategory) => setForm({ ...form, category: v })}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Target Amount ($)</Label>
                  <Input type="number" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: Number(e.target.value) })} className="h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Suggested Contribution ($)</Label>
                  <Input type="number" value={form.suggestedContribution} onChange={(e) => setForm({ ...form, suggestedContribution: Number(e.target.value) })} className="h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Target Date</Label>
                  <Input type="date" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} className="h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Status</Label>
                  <Select value={form.status} onValueChange={(v: EventStatus) => setForm({ ...form, status: v })}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Active", "Completed", "Urgent", "Upcoming"].map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Location</Label>
                  <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Admin Phone</Label>
                  <Input value={form.adminPhone} onChange={(e) => setForm({ ...form, adminPhone: e.target.value })} className="h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Account Name</Label>
                  <Input value={form.adminAccountName} onChange={(e) => setForm({ ...form, adminAccountName: e.target.value })} className="h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Account Details</Label>
                  <Input value={form.adminAccountDetails} onChange={(e) => setForm({ ...form, adminAccountDetails: e.target.value })} className="h-9 text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="text-sm" />
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSave}>
                  {editingId ? "Update" : "Create"} Event
                </Button>
                <Button size="sm" variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {events.map((event) => {
          const cat = CATEGORIES.find((c) => c.value === event.category);
          const progress = event.targetAmount > 0 ? (event.totalCollected / event.targetAmount) * 100 : 0;
          return (
            <Card key={event.id} className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={cn(cat?.bgColor, cat?.color, "border-0 text-[10px]")}>{event.category}</Badge>
                    <Badge variant="outline" className={cn(
                      "text-[10px]",
                      event.status === "Active" && "border-emerald-300 text-emerald-700",
                      event.status === "Urgent" && "border-rose-300 text-rose-700",
                      event.status === "Completed" && "border-blue-300 text-blue-700",
                      event.status === "Upcoming" && "border-amber-300 text-amber-700",
                    )}>
                      {event.status}
                    </Badge>
                  </div>
                  <p className="text-sm font-semibold truncate">{event.title}</p>
                  <p className="text-xs text-muted-foreground">${event.totalCollected.toLocaleString()} / ${event.targetAmount.toLocaleString()}</p>
                  <div className="mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(event)}>
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-emerald-600" onClick={() => handleComplete(event.id)}>
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-rose-500" onClick={() => handleDelete(event.id)}>
                    <Trash className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ---- User Manager ---- */
function UserManager({ users }: { users: User[] }) {
  const handleToggleBlock = (user: User) => {
    updateUser(user.id, { blocked: !user.blocked });
    toast.success(user.blocked ? "User unblocked" : "User blocked");
  };

  const handleToggleAdmin = (user: User) => {
    updateUser(user.id, { role: user.role === "admin" ? "user" : "admin" });
    toast.success(user.role === "admin" ? "Admin rights revoked" : "Admin rights granted");
  };

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">Users ({users.length})</h3>
      <div className="space-y-2">
        {users.map((user) => (
          <Card key={user.id} className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src={user.profilePicture || undefined} />
                  <AvatarFallback className="text-xs">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email} · {user.country}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant={user.role === "admin" ? "default" : "outline"} className="text-[10px]">
                  {user.role}
                </Badge>
                {user.blocked && <Badge variant="destructive" className="text-[10px]">Blocked</Badge>}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleToggleAdmin(user)}
                  title={user.role === "admin" ? "Revoke admin" : "Make admin"}
                >
                  {user.role === "admin" ? <UserCheck className="h-3.5 w-3.5 text-amber-500" /> : <UserX className="h-3.5 w-3.5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleToggleBlock(user)}
                  title={user.blocked ? "Unblock" : "Block"}
                >
                  {user.blocked ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Ban className="h-3.5 w-3.5 text-rose-500" />}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---- Contribution Manager ---- */
function ContributionManager({ contributions }: { contributions: any[] }) {
  const [search, setSearch] = useState("");

  const filtered = contributions.filter(
    (c) => c.contributorName?.toLowerCase().includes(search.toLowerCase()) || c.eventId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Contributions ({contributions.length})</h3>
        <div className="relative w-48">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>
      <div className="space-y-2">
        {filtered.map((c) => (
          <Card key={c.id} className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{c.contributorName}</p>
                <p className="text-xs text-muted-foreground">{c.contributorPhone} · {c.reason || "No reason"}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-600">${c.amount?.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">No contributions found</p>
        )}
      </div>
    </div>
  );
}

/* ---- Notification Manager ---- */
function NotificationManager() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState<"all" | "specific">("all");
  const [selectedUser, setSelectedUser] = useState("");
  const [type, setType] = useState<"info" | "success" | "warning" | "admin">("admin");
  const users = getUsers().filter((u) => u.role !== "admin");

  const handleSend = () => {
    if (!title || !message) {
      toast.error("Title and message required");
      return;
    }
    const userIds = target === "all" ? ["all"] : [selectedUser];
    userIds.forEach((uid) => {
      if (!uid) return;
      addNotification({
        id: "notif-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
        userId: uid,
        title,
        message,
        type,
        read: false,
        createdAt: new Date().toISOString(),
      });
    });
    toast.success("Notification sent!");
    setTitle("");
    setMessage("");
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-amber-500" />
          Send Broadcast
        </h3>
        <div className="space-y-1.5">
          <Label className="text-xs">Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notification title" className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Message</Label>
          <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your message..." rows={3} className="text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Type</Label>
            <Select value={type} onValueChange={(v: any) => setType(v)}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Target</Label>
            <Select value={target} onValueChange={(v: "all" | "specific") => setTarget(v)}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="specific">Specific User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {target === "specific" && (
          <div className="space-y-1.5">
            <Label className="text-xs">Select User</Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Choose a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>{u.name} ({u.email})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <Button className="w-full bg-amber-600 hover:bg-amber-700" onClick={handleSend}>
          <Send className="h-4 w-4 mr-1.5" />
          Send Notification
        </Button>
      </Card>
    </div>
  );
}

/* ---- Receipt Admin View ---- */
function ReceiptAdminView({ receipts }: { receipts: any[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">Receipt Records ({receipts.length})</h3>
      <div className="space-y-2">
        {receipts.map((r) => (
          <Card key={r.id} className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium font-mono text-xs">{r.receiptNumber}</p>
                <p className="text-xs text-muted-foreground">{r.contributorName} · ${r.amount?.toLocaleString()}</p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                {new Date(r.createdAt).toLocaleDateString()}
              </div>
            </div>
          </Card>
        ))}
        {receipts.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">No receipts generated yet</p>
        )}
      </div>
    </div>
  );
}

/* ---- Settings Panel ---- */
function SettingsPanel() {
  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <Settings className="h-4 w-4" />
        Admin Settings
      </h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Admin Password</span>
          <span className="font-mono text-xs font-bold">{ADMIN_PASSWORD}</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Users</span>
          <span className="font-medium">{getUsers().length}</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Events</span>
          <span className="font-medium">{getEvents().length}</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Contributions</span>
          <span className="font-medium">{getContributions().length}</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Receipts</span>
          <span className="font-medium">{getReceipts().length}</span>
        </div>
      </div>
    </Card>
  );
}