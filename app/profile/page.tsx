"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Settings,
  Bell,
  Shield,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Edit,
  Save,
  Camera,
  Key,
  LogOut,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Monitor,
  Languages,
  DollarSign,
  FileText,
  Award,
  TrendingUp,
  Activity,
  BarChart3,
  PieChart,
  Target,
  Zap,
  Star,
  Heart,
  Bookmark,
  MessageCircle,
  Share2,
  Download,
  Upload,
  Plus,
  Minus
} from "lucide-react";
import { Protected } from "@/components/Protected";
import { ThemeToggle } from "@/components/ThemeToggle";
import HamburgerNav from "@/components/navigation/HamburgerNav";
import { useAuth } from "@/hooks/use-auth";

const translations = {
  en: {
    profile: "Profile",
    accountSettings: "Account Settings",
    personalInfo: "Personal Information",
    security: "Security",
    notifications: "Notifications",
    preferences: "Preferences",
    billing: "Billing",
    activity: "Activity",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone Number",
    location: "Location",
    farmSize: "Farm Size (acres)",
    crops: "Main Crops",
    experience: "Farming Experience",
    joinDate: "Member Since",
    lastLogin: "Last Login",
    editProfile: "Edit Profile",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    changePassword: "Change Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm New Password",
    updatePassword: "Update Password",
    twoFactorAuth: "Two-Factor Authentication",
    enable2FA: "Enable 2FA",
    disable2FA: "Disable 2FA",
    backupCodes: "Backup Codes",
    generateCodes: "Generate New Codes",
    emailNotifications: "Email Notifications",
    pushNotifications: "Push Notifications",
    smsNotifications: "SMS Notifications",
    marketAlerts: "Market Price Alerts",
    weatherAlerts: "Weather Alerts",
    cropAlerts: "Crop Health Alerts",
    systemUpdates: "System Updates",
    language: "Language",
    english: "English",
    swahili: "Swahili",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
    currency: "Currency",
    kenyanShilling: "Kenyan Shilling (KES)",
    usDollar: "US Dollar (USD)",
    timezone: "Timezone",
    eastAfrica: "East Africa Time (EAT)",
    subscription: "Subscription",
    currentPlan: "Current Plan",
    freePlan: "Free Plan",
    premiumPlan: "Premium Plan",
    upgrade: "Upgrade",
    billingHistory: "Billing History",
    paymentMethods: "Payment Methods",
    addPaymentMethod: "Add Payment Method",
    recentActivity: "Recent Activity",
    viewedResource: "Viewed resource",
    bookmarkedResource: "Bookmarked resource",
    completedCourse: "Completed course",
    madePurchase: "Made purchase",
    updatedProfile: "Updated profile",
    loggedIn: "Logged in",
    accountStats: "Account Statistics",
    totalViews: "Total Resource Views",
    bookmarks: "Bookmarks",
    completedCourses: "Completed Courses",
    forumPosts: "Forum Posts",
    achievements: "Achievements",
    badges: "Badges Earned",
    streak: "Learning Streak",
    days: "days",
    exportData: "Export Data",
    deleteAccount: "Delete Account",
    confirmDelete: "Are you sure you want to delete your account? This action cannot be undone.",
    delete: "Delete Account",
    privacySettings: "Privacy Settings",
    profileVisibility: "Profile Visibility",
    public: "Public",
    private: "Private",
    dataSharing: "Data Sharing",
    analytics: "Analytics",
    marketing: "Marketing Communications",
    thirdParty: "Third-party Integrations",
    connectedAccounts: "Connected Accounts",
    connect: "Connect",
    disconnect: "Disconnect",
    helpSupport: "Help & Support",
    faq: "FAQ",
    contactSupport: "Contact Support",
    userGuide: "User Guide",
    feedback: "Send Feedback"
  },
  sw: {
    profile: "Wasifu",
    accountSettings: "Mipangilio ya Akaunti",
    personalInfo: "Maelezo Binafsi",
    security: "Usalama",
    notifications: "Arifa",
    preferences: "Mapendeleo",
    billing: "Malipo",
    activity: "Shughuli",
    fullName: "Jina Kamili",
    email: "Barua Pepe",
    phone: "Nambari ya Simu",
    location: "Mahali",
    farmSize: "Ukubwa wa Shamba (ekari)",
    crops: "Mazao Kuu",
    experience: "Uzoefu wa Kilimo",
    joinDate: "Mwanachama Tangu",
    lastLogin: "Kuingia Mara ya Mwisho",
    editProfile: "Hariri Wasifu",
    saveChanges: "Hifadhi Mabadiliko",
    cancel: "Ghairi",
    changePassword: "Badilisha Nenosiri",
    currentPassword: "Nenosiri la Sasa",
    newPassword: "Nenosiri Mpya",
    confirmPassword: "Thibitisha Nenosiri Mpya",
    updatePassword: "Sasisha Nenosiri",
    twoFactorAuth: "Uthibitishaji wa Hatua Mbili",
    enable2FA: "Wezesha 2FA",
    disable2FA: "Lemaza 2FA",
    backupCodes: "Nambari za Hifadhi",
    generateCodes: "Tengeneza Nambari Mpya",
    emailNotifications: "Arifa za Barua Pepe",
    pushNotifications: "Arifa za Kushinikiza",
    smsNotifications: "Arifa za SMS",
    marketAlerts: "Arifa za Bei za Soko",
    weatherAlerts: "Arifa za Hali ya Hewa",
    cropAlerts: "Arifa za Afya ya Mazao",
    systemUpdates: "Sasisho za Mfumo",
    language: "Lugha",
    english: "Kiingereza",
    swahili: "Kiswahili",
    theme: "Mandhari",
    light: "Nuru",
    dark: "Giza",
    system: "Mfumo",
    currency: "Sarafu",
    kenyanShilling: "Shilingi ya Kenya (KES)",
    usDollar: "Dola ya Marekani (USD)",
    timezone: "Ukanda wa Saa",
    eastAfrica: "Saa za Afrika Mashariki (EAT)",
    subscription: "Usajili",
    currentPlan: "Mpango wa Sasa",
    freePlan: "Mpango wa Bure",
    premiumPlan: "Mpango wa Premium",
    upgrade: "Boresha",
    billingHistory: "Historia ya Malipo",
    paymentMethods: "Njia za Malipo",
    addPaymentMethod: "Ongeza Njia ya Malipo",
    recentActivity: "Shughuli za Hivi Karibuni",
    viewedResource: "Iliangalia rasilimali",
    bookmarkedResource: "Iliweka alama rasilimali",
    completedCourse: "Imemaliza kozi",
    madePurchase: "Imefanya ununuzi",
    updatedProfile: "Imesasisha wasifu",
    loggedIn: "Imeingia",
    accountStats: "Takwimu za Akaunti",
    totalViews: "Jumla ya Maoni ya Rasilimali",
    bookmarks: "Alama",
    completedCourses: "Kozi Zilizomalizika",
    forumPosts: "Machapisho ya Jukwaa",
    achievements: "Mafanikio",
    badges: "Beji Zilizopatikana",
    streak: "Mfululizo wa Kujifunza",
    days: "siku",
    exportData: "Hamisha Data",
    deleteAccount: "Futa Akaunti",
    confirmDelete: "Je, una uhakika unataka kufuta akaunti yako? Kitendo hiki hakiwezi kutenduliwa.",
    delete: "Futa Akaunti",
    privacySettings: "Mipangilio ya Faragha",
    profileVisibility: "Mwonekano wa Wasifu",
    public: "Umma",
    private: "Binafsi",
    dataSharing: "Ugawaji wa Data",
    analytics: "Takwimu",
    marketing: "Mawasiliano ya Uuzaji",
    thirdParty: "Miunganisho ya Watu Wengine",
    connectedAccounts: "Akaunti Zilizounganishwa",
    connect: "Unganisha",
    disconnect: "Tenganisha",
    helpSupport: "Msaada",
    faq: "Maswali Yanayoulizwa Mara Kwa Mara",
    contactSupport: "Wasiliana na Msaada",
    userGuide: "Mwongozo wa Mtumiaji",
    feedback: "Tuma Maoni"
  }
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [preferredLang, setPreferredLang] = useState<"en" | "sw">("sw");
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: user?.user_metadata?.full_name || "John Doe",
    email: user?.email || "john.doe@example.com",
    phone: "+254 700 123 456",
    location: "Nairobi, Kenya",
    farmSize: "5",
    crops: "Maize, Beans, Tomatoes",
    experience: "5 years"
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const [preferences, setPreferences] = useState({
    language: "sw",
    theme: "system",
    currency: "kes",
    timezone: "eat",
    emailNotifications: {
      marketAlerts: true,
      weatherAlerts: true,
      cropAlerts: false,
      systemUpdates: true
    },
    pushNotifications: {
      marketAlerts: true,
      weatherAlerts: true,
      cropAlerts: false,
      systemUpdates: false
    },
    smsNotifications: {
      marketAlerts: false,
      weatherAlerts: true,
      cropAlerts: false,
      systemUpdates: false
    }
  });

  const t = translations[preferredLang];

  // Mock activity data
  const recentActivity = [
    { id: 1, type: "viewedResource", title: "Sustainable Maize Farming", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: 2, type: "bookmarkedResource", title: "Soil Health Management", timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) },
    { id: 3, type: "completedCourse", title: "Basic Pest Control", timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    { id: 4, type: "loggedIn", title: "Logged into account", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { id: 5, type: "updatedProfile", title: "Updated profile information", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }
  ];

  const accountStats = {
    totalViews: 1247,
    bookmarks: 23,
    completedCourses: 8,
    forumPosts: 15,
    badges: 5,
    streak: 12
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "viewedResource":
        return <Eye className="w-4 h-4 text-blue-500" />;
      case "bookmarkedResource":
        return <Bookmark className="w-4 h-4 text-yellow-500" />;
      case "completedCourse":
        return <Award className="w-4 h-4 text-green-500" />;
      case "madePurchase":
        return <DollarSign className="w-4 h-4 text-purple-500" />;
      case "updatedProfile":
        return <User className="w-4 h-4 text-indigo-500" />;
      case "loggedIn":
        return <LogOut className="w-4 h-4 text-gray-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityText = (activity: any) => {
    switch (activity.type) {
      case "viewedResource":
        return `${t.viewedResource}: ${activity.title}`;
      case "bookmarkedResource":
        return `${t.bookmarkedResource}: ${activity.title}`;
      case "completedCourse":
        return `${t.completedCourse}: ${activity.title}`;
      case "madePurchase":
        return `${t.madePurchase}`;
      case "updatedProfile":
        return t.updatedProfile;
      case "loggedIn":
        return t.loggedIn;
      default:
        return activity.title;
    }
  };

  const handleSaveProfile = () => {
    // Mock save logic
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handlePasswordChange = () => {
    if (passwordData.new !== passwordData.confirm) {
      alert("New passwords don't match!");
      return;
    }
    // Mock password change logic
    alert("Password updated successfully!");
    setShowPasswordForm(false);
    setPasswordData({ current: "", new: "", confirm: "" });
  };

  const handleDeleteAccount = () => {
    // Mock delete logic
    alert("Account deletion initiated. You will receive a confirmation email.");
    setShowDeleteConfirm(false);
  };

  return (
    <Protected>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        {/* Header */}
        <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/')}
                  className="w-8 h-8 rounded-lg bg-green-700 flex items-center justify-center text-white font-bold text-sm"
                >
                  A
                </button>
                <h1 className="text-lg font-black tracking-tight text-green-900 dark:text-green-400">
                  AgriLink
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPreferredLang(prev => prev === "en" ? "sw" : "en")}
                  className="px-3 py-1 text-xs font-bold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 uppercase"
                >
                  {preferredLang}
                </button>
                <ThemeToggle />
                <HamburgerNav
                  activeTab="profile"
                  t={t}
                  farmerName={user?.user_metadata?.full_name || "Farmer"}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Profile Header */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {profileData.fullName.charAt(0).toUpperCase()}
                  </div>
                  <button className="absolute bottom-0 right-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white hover:bg-green-700 transition-all">
                    <Camera size={12} />
                  </button>
                </div>
                <div>
                  <h1 className="text-2xl font-black text-neutral-900 dark:text-neutral-100">
                    {profileData.fullName}
                  </h1>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {profileData.email}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {profileData.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {t.joinDate}: Jan 2024
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:ml-auto flex gap-3">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
                >
                  <Edit size={16} />
                  {t.editProfile}
                </button>
                <button
                  onClick={async () => {
                    await signOut();
                    router.push('/auth/login');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {[
              { label: t.totalViews, value: accountStats.totalViews, icon: Eye },
              { label: t.bookmarks, value: accountStats.bookmarks, icon: Bookmark },
              { label: t.completedCourses, value: accountStats.completedCourses, icon: Award },
              { label: t.forumPosts, value: accountStats.forumPosts, icon: MessageCircle },
              { label: t.badges, value: accountStats.badges, icon: Star },
              { label: `${t.streak} ${t.days}`, value: accountStats.streak, icon: Zap }
            ].map((stat, index) => (
              <div key={index} className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 text-center">
                <stat.icon className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-black text-neutral-900 dark:text-neutral-100">
                  {stat.value}
                </div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 overflow-x-auto">
            {[
              { id: "personal", label: t.personalInfo, icon: User },
              { id: "security", label: t.security, icon: Shield },
              { id: "notifications", label: t.notifications, icon: Bell },
              { id: "preferences", label: t.preferences, icon: Settings },
              { id: "billing", label: t.billing, icon: CreditCard },
              { id: "activity", label: t.activity, icon: Activity }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
            {activeTab === "personal" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                    {t.personalInfo}
                  </h2>
                  {isEditing && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1 text-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700"
                      >
                        {t.cancel}
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        {t.saveChanges}
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      {t.fullName}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    ) : (
                      <p className="text-neutral-900 dark:text-neutral-100">{profileData.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      {t.email}
                    </label>
                    <p className="text-neutral-900 dark:text-neutral-100">{profileData.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      {t.phone}
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    ) : (
                      <p className="text-neutral-900 dark:text-neutral-100">{profileData.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      {t.location}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    ) : (
                      <p className="text-neutral-900 dark:text-neutral-100">{profileData.location}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      {t.farmSize}
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={profileData.farmSize}
                        onChange={(e) => setProfileData(prev => ({ ...prev, farmSize: e.target.value }))}
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    ) : (
                      <p className="text-neutral-900 dark:text-neutral-100">{profileData.farmSize} acres</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      {t.crops}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.crops}
                        onChange={(e) => setProfileData(prev => ({ ...prev, crops: e.target.value }))}
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    ) : (
                      <p className="text-neutral-900 dark:text-neutral-100">{profileData.crops}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  {t.security}
                </h2>

                {/* Change Password */}
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                      {t.changePassword}
                    </h3>
                    <button
                      onClick={() => setShowPasswordForm(!showPasswordForm)}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      {showPasswordForm ? "Cancel" : t.changePassword}
                    </button>
                  </div>

                  {showPasswordForm && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          {t.currentPassword}
                        </label>
                        <input
                          type="password"
                          value={passwordData.current}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          {t.newPassword}
                        </label>
                        <input
                          type="password"
                          value={passwordData.new}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          {t.confirmPassword}
                        </label>
                        <input
                          type="password"
                          value={passwordData.confirm}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={handlePasswordChange}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        {t.updatePassword}
                      </button>
                    </div>
                  )}
                </div>

                {/* Two-Factor Authentication */}
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                        {t.twoFactorAuth}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      {t.enable2FA}
                    </button>
                  </div>
                </div>

                {/* Delete Account */}
                <div className="border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-red-900 dark:text-red-100">
                        {t.deleteAccount}
                      </h3>
                      <p className="text-sm text-red-600 dark:text-red-400">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      {t.delete}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  {t.notifications}
                </h2>

                {/* Email Notifications */}
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                    {t.emailNotifications}
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(preferences.emailNotifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-neutral-900 dark:text-neutral-100 capitalize">
                          {t[key as keyof typeof t]}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setPreferences(prev => ({
                              ...prev,
                              emailNotifications: {
                                ...prev.emailNotifications,
                                [key]: e.target.checked
                              }
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Push Notifications */}
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                    {t.pushNotifications}
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(preferences.pushNotifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-neutral-900 dark:text-neutral-100 capitalize">
                          {t[key as keyof typeof t]}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setPreferences(prev => ({
                              ...prev,
                              pushNotifications: {
                                ...prev.pushNotifications,
                                [key]: e.target.checked
                              }
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  {t.preferences}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      {t.language}
                    </label>
                    <select
                      value={preferences.language}
                      onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    >
                      <option value="en">{t.english}</option>
                      <option value="sw">{t.swahili}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      {t.theme}
                    </label>
                    <select
                      value={preferences.theme}
                      onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    >
                      <option value="light">{t.light}</option>
                      <option value="dark">{t.dark}</option>
                      <option value="system">{t.system}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      {t.currency}
                    </label>
                    <select
                      value={preferences.currency}
                      onChange={(e) => setPreferences(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    >
                      <option value="kes">{t.kenyanShilling}</option>
                      <option value="usd">{t.usDollar}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      {t.timezone}
                    </label>
                    <select
                      value={preferences.timezone}
                      onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    >
                      <option value="eat">{t.eastAfrica}</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "billing" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  {t.billing}
                </h2>

                {/* Current Plan */}
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                        {t.currentPlan}: {t.freePlan}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Free access to basic features
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      {t.upgrade}
                    </button>
                  </div>
                </div>

                {/* Billing History */}
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                    {t.billingHistory}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    No billing history available
                  </p>
                </div>
              </div>
            )}

            {activeTab === "activity" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  {t.recentActivity}
                </h2>

                <div className="space-y-4">
                  {recentActivity.map(activity => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                      <div className="w-8 h-8 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-neutral-900 dark:text-neutral-100">
                          {getActivityText(activity)}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {activity.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delete Account Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  {t.deleteAccount}
                </h3>
              </div>

              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                {t.confirmDelete}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                >
                  {t.delete}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Protected>
  );
}