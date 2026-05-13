"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Book,
  Video,
  FileText,
  Download,
  Search,
  Filter,
  Star,
  Clock,
  User,
  Calendar,
  Tag,
  ExternalLink,
  Play,
  Eye,
  Heart,
  Share2,
  Bookmark,
  ChevronRight,
  Grid,
  List,
  Award,
  TrendingUp,
  Leaf,
  Droplets,
  Thermometer,
  Bug,
  Sprout
} from "lucide-react";
import { Protected } from "@/components/Protected";
import { ThemeToggle } from "@/components/ThemeToggle";
import HamburgerNav from "@/components/navigation/HamburgerNav";
import { useAuth } from "@/hooks/use-auth";

const translations = {
  en: {
    resourceLibrary: "Resource Library",
    farmingKnowledge: "Farming Knowledge & Resources",
    searchResources: "Search resources...",
    filterBy: "Filter by",
    category: "Category",
    allCategories: "All Categories",
    contentType: "Content Type",
    allTypes: "All Types",
    sortBy: "Sort by",
    newest: "Newest",
    popular: "Most Popular",
    rating: "Highest Rated",
    articles: "Articles",
    videos: "Videos",
    guides: "Guides",
    webinars: "Webinars",
    ebooks: "eBooks",
    tools: "Tools",
    readMore: "Read More",
    watchNow: "Watch Now",
    download: "Download",
    share: "Share",
    bookmark: "Bookmark",
    bookmarked: "Bookmarked",
    views: "views",
    likes: "likes",
    duration: "Duration",
    author: "Author",
    published: "Published",
    tags: "Tags",
    relatedResources: "Related Resources",
    featuredContent: "Featured Content",
    quickGuides: "Quick Guides",
    expertInsights: "Expert Insights",
    seasonalTips: "Seasonal Farming Tips",
    cropManagement: "Crop Management",
    soilHealth: "Soil Health",
    pestControl: "Pest Control",
    irrigation: "Irrigation",
    harvesting: "Harvesting",
    marketing: "Marketing",
    finance: "Finance",
    technology: "Technology",
    sustainability: "Sustainability",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    free: "Free",
    premium: "Premium",
    minutes: "minutes",
    hours: "hours",
    today: "today",
    day: "day",
    days: "days",
    ago: "ago",
    noResourcesFound: "No resources found",
    noResourcesFoundDesc: "Try adjusting your search or filters to find what you're looking for.",
    resourceOfTheDay: "Resource of the Day",
    trendingTopics: "Trending Topics",
    recommendedForYou: "Recommended for You",
    recentlyViewed: "Recently Viewed",
    myBookmarks: "My Bookmarks",
    learningPaths: "Learning Paths",
    certifications: "Certifications",
    communityDiscussions: "Community Discussions",
    expertQASessions: "Expert Q&A Sessions"
  },
  sw: {
    resourceLibrary: "Maktaba ya Rasilimali",
    farmingKnowledge: "Maarifa ya Kilimo na Rasilimali",
    searchResources: "Tafuta rasilimali...",
    filterBy: "Chuja kwa",
    category: "Kategoria",
    allCategories: "Kategoria Zote",
    contentType: "Aina ya Maudhui",
    allTypes: "Aina Zote",
    sortBy: "Panga kwa",
    newest: "Mpya Zaidi",
    popular: "Maarufu Zaidi",
    rating: "Zenye Ukadiriaji wa Juu",
    articles: "Makala",
    videos: "Video",
    guides: "Miongozo",
    webinars: "Semina za Mtandaoni",
    ebooks: "Vitabu vya Kielektroniki",
    tools: "Zana",
    readMore: "Soma Zaidi",
    watchNow: "Tazama Sasa",
    download: "Pakua",
    share: "Shiriki",
    bookmark: "Weka Alama",
    bookmarked: "Imewekwa Alama",
    views: "maoni",
    likes: "kupenda",
    duration: "Muda",
    author: "Mwandishi",
    published: "Imechapishwa",
    tags: "Lebo",
    relatedResources: "Rasilimali Zinazohusiana",
    featuredContent: "Maudhui Maarufu",
    quickGuides: "Miongozo ya Haraka",
    expertInsights: "Maarifa ya Wataalam",
    seasonalTips: "Vidokezo vya Kilimo vya Msimu",
    cropManagement: "Usimamizi wa Mazao",
    soilHealth: "Afya ya Udongo",
    pestControl: "Udhibiti wa Wadudu",
    irrigation: "Umwagiliaji",
    harvesting: "Uvuvi",
    marketing: "Uuzaji",
    finance: "Fedha",
    technology: "Teknolojia",
    sustainability: "Uendelevu",
    beginner: "Mwanzo",
    intermediate: "Wastani",
    advanced: "Waendelea",
    free: "Bure",
    premium: "Premium",
    minutes: "dakika",
    hours: "saa",
    today: "leo",
    day: "siku",
    days: "siku",
    ago: "iliyopita",
    noResourcesFound: "Hakuna rasilimali zilizopatikana",
    noResourcesFoundDesc: "Jaribu kubadilisha utafutaji au vichujio ili kupata unachotafuta.",
    resourceOfTheDay: "Rasilimali ya Siku",
    trendingTopics: "Mada Zinazoendelea",
    recommendedForYou: "Inapendekezwa Kwa Ajili Yako",
    recentlyViewed: "Zilizotazamwa Hivi Karibuni",
    myBookmarks: "Alama Zangu",
    learningPaths: "Njia za Kujifunza",
    certifications: "Vyeti",
    communityDiscussions: "Majadiliano ya Jamii",
    expertQASessions: "Vipindi vya Maswali na Majibu vya Wataalam"
  }
};

// Mock data for resources
const mockResources = [
  {
    id: 1,
    title: "Sustainable Maize Farming Practices",
    description: "Comprehensive guide to implementing sustainable farming techniques for maize cultivation in Kenya.",
    type: "guide",
    category: "cropManagement",
    level: "intermediate",
    access: "free",
    author: "Dr. Sarah Wanjiku",
    publishedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    duration: 45,
    views: 1250,
    likes: 89,
    rating: 4.8,
    tags: ["maize", "sustainability", "kenya"],
    thumbnail: "/api/placeholder/400/250",
    content: "Full guide content...",
    featured: true
  },
  {
    id: 2,
    title: "Soil Health Management Workshop",
    description: "Recorded webinar on maintaining soil fertility and implementing regenerative agriculture practices.",
    type: "video",
    category: "soilHealth",
    level: "advanced",
    access: "free",
    author: "Prof. James Kiprop",
    publishedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    duration: 90,
    views: 2100,
    likes: 156,
    rating: 4.9,
    tags: ["soil", "fertility", "regenerative"],
    thumbnail: "/api/placeholder/400/250",
    content: "Video content...",
    featured: true
  },
  {
    id: 3,
    title: "Pest Control Strategies for Smallholder Farmers",
    description: "Practical pest management techniques using integrated pest management (IPM) approaches.",
    type: "article",
    category: "pestControl",
    level: "beginner",
    access: "free",
    author: "Dr. Michael Oduya",
    publishedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    duration: 25,
    views: 890,
    likes: 67,
    rating: 4.6,
    tags: ["pests", "ipm", "smallholder"],
    thumbnail: "/api/placeholder/400/250",
    content: "Article content...",
    featured: false
  },
  {
    id: 4,
    title: "Irrigation System Planning Guide",
    description: "Step-by-step guide to planning and implementing efficient irrigation systems for different crop types.",
    type: "ebook",
    category: "irrigation",
    level: "intermediate",
    access: "premium",
    author: "Eng. Grace Mutua",
    publishedDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    duration: 120,
    views: 650,
    likes: 43,
    rating: 4.7,
    tags: ["irrigation", "water", "planning"],
    thumbnail: "/api/placeholder/400/250",
    content: "eBook content...",
    featured: false
  },
  {
    id: 5,
    title: "Market Linkages for Farmers",
    description: "Strategies for connecting with buyers and improving market access for agricultural produce.",
    type: "webinar",
    category: "marketing",
    level: "intermediate",
    access: "free",
    author: "Ms. Ann Wairimu",
    publishedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    duration: 75,
    views: 1800,
    likes: 134,
    rating: 4.8,
    tags: ["marketing", "buyers", "market access"],
    thumbnail: "/api/placeholder/400/250",
    content: "Webinar content...",
    featured: true
  }
];

const categories = [
  { id: "cropManagement", label: "cropManagement", icon: Sprout },
  { id: "soilHealth", label: "soilHealth", icon: Leaf },
  { id: "pestControl", label: "pestControl", icon: Bug },
  { id: "irrigation", label: "irrigation", icon: Droplets },
  { id: "harvesting", label: "harvesting", icon: Sprout },
  { id: "marketing", label: "marketing", icon: TrendingUp },
  { id: "finance", label: "finance", icon: Award },
  { id: "technology", label: "technology", icon: Book },
  { id: "sustainability", label: "sustainability", icon: Leaf }
];

const contentTypes = [
  { id: "articles", label: "articles", icon: FileText },
  { id: "videos", label: "videos", icon: Video },
  { id: "guides", label: "guides", icon: Book },
  { id: "webinars", label: "webinars", icon: Video },
  { id: "ebooks", label: "ebooks", icon: Book },
  { id: "tools", label: "tools", icon: Grid }
];

export default function LibraryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [preferredLang, setPreferredLang] = useState<"en" | "sw">("sw");
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    contentType: "all",
    level: "all",
    sortBy: "newest"
  });
  const [bookmarkedResources, setBookmarkedResources] = useState<number[]>([1, 3]);

  const t = translations[preferredLang];

  // Filter and sort resources
  const filteredResources = mockResources
    .filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = filters.category === "all" || resource.category === filters.category;
      const matchesType = filters.contentType === "all" || resource.type === filters.contentType;
      const matchesLevel = filters.level === "all" || resource.level === filters.level;
      const matchesTab = activeTab === "all" || (activeTab === "featured" && resource.featured) ||
                        (activeTab === "bookmarks" && bookmarkedResources.includes(resource.id));

      return matchesSearch && matchesCategory && matchesType && matchesLevel && matchesTab;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "popular":
          return b.views - a.views;
        case "rating":
          return b.rating - a.rating;
        default:
          return b.publishedDate.getTime() - a.publishedDate.getTime();
      }
    });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />;
      case "article":
        return <FileText className="w-4 h-4" />;
      case "guide":
        return <Book className="w-4 h-4" />;
      case "webinar":
        return <Video className="w-4 h-4" />;
      case "ebook":
        return <Book className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(cat => cat.id === category);
    if (categoryData) {
      const IconComponent = categoryData.icon;
      return <IconComponent className="w-4 h-4" />;
    }
    return <Book className="w-4 h-4" />;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400";
      case "intermediate":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400";
      case "advanced":
        return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400";
      default:
        return "bg-neutral-100 dark:bg-neutral-900/20 text-neutral-800 dark:text-neutral-400";
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return t.today;
    if (days === 1) return `1 ${t.day}`;
    if (days < 7) return `${days} ${t.days}`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  const toggleBookmark = (resourceId: number) => {
    setBookmarkedResources(prev =>
      prev.includes(resourceId)
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const getActionButton = (resource: any) => {
    switch (resource.type) {
      case "video":
      case "webinar":
        return (
          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all">
            <Play size={16} />
            {t.watchNow}
          </button>
        );
      case "ebook":
      case "guide":
        return (
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
            <Download size={16} />
            {t.download}
          </button>
        );
      default:
        return (
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all">
            <FileText size={16} />
            {t.readMore}
          </button>
        );
    }
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
                  activeTab="library"
                  t={t}
                  farmerName={user?.user_metadata?.full_name || "Farmer"}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-black text-neutral-900 dark:text-neutral-100 mb-2">
              {t.resourceLibrary}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              {t.farmingKnowledge}
            </p>
          </div>

          {/* Featured Resource */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              {t.resourceOfTheDay}
            </h2>
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    Sustainable Maize Farming Practices
                  </h3>
                  <p className="text-green-100 mb-4">
                    Comprehensive guide to implementing sustainable farming techniques for maize cultivation in Kenya.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-green-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      45 {t.minutes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      1,250 {t.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      4.8
                    </span>
                  </div>
                </div>
                <div className="lg:flex-shrink-0">
                  <button className="flex items-center gap-2 px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-all font-bold">
                    <Book className="w-5 h-5" />
                    {t.readMore}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 overflow-x-auto">
            {[
              { id: "all", label: "All Resources" },
              { id: "featured", label: t.featuredContent },
              { id: "bookmarks", label: t.myBookmarks }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder={t.searchResources}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="px-3 py-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  <option value="all">{t.allCategories}</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{t[cat.label as keyof typeof t]}</option>
                  ))}
                </select>

                <select
                  value={filters.contentType}
                  onChange={(e) => setFilters(prev => ({ ...prev, contentType: e.target.value }))}
                  className="px-3 py-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  <option value="all">{t.allTypes}</option>
                  {contentTypes.map(type => (
                    <option key={type.id} value={type.id}>{t[type.label as keyof typeof t]}</option>
                  ))}
                </select>

                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                  className="px-3 py-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  <option value="newest">{t.newest}</option>
                  <option value="popular">{t.popular}</option>
                  <option value="rating">{t.rating}</option>
                </select>

                <div className="flex border border-neutral-300 dark:border-neutral-700 rounded-xl">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-3 rounded-l-xl transition-all ${
                      viewMode === "grid"
                        ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-3 rounded-r-xl transition-all ${
                      viewMode === "list"
                        ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Resources Grid/List */}
          {filteredResources.length === 0 ? (
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 text-center">
              <Book className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                {t.noResourcesFound}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                {t.noResourcesFoundDesc}
              </p>
            </div>
          ) : (
            <div className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }>
              {filteredResources.map(resource => (
                <div
                  key={resource.id}
                  className={`bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg transition-all ${
                    viewMode === "list" ? "flex" : ""
                  }`}
                >
                  {/* Thumbnail */}
                  <div className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : "aspect-video"}`}>
                    <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 flex items-center justify-center">
                      {getTypeIcon(resource.type)}
                    </div>
                    <div className="absolute top-2 left-2 flex gap-1">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${getLevelColor(resource.level)}`}>
                        {t[resource.level as keyof typeof t]}
                      </span>
                      {resource.access === "premium" && (
                        <span className="px-2 py-1 rounded text-xs font-bold bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400">
                          {t.premium}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => toggleBookmark(resource.id)}
                      className="absolute top-2 right-2 p-2 bg-white/80 dark:bg-neutral-900/80 rounded-full hover:bg-white dark:hover:bg-neutral-900 transition-all"
                    >
                      <Bookmark
                        size={16}
                        className={bookmarkedResources.includes(resource.id) ? "text-yellow-500 fill-current" : "text-neutral-600"}
                      />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon(resource.type)}
                        <span className="text-xs text-neutral-500 uppercase font-bold">
                          {t[resource.type as keyof typeof t]}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">
                          {resource.rating}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2 line-clamp-2">
                      {resource.title}
                    </h3>

                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
                      {resource.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-neutral-500 mb-3">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {resource.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {resource.duration} {t.minutes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {resource.views}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(resource.category)}
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">
                          {t[resource.category as keyof typeof t]}
                        </span>
                      </div>
                      {getActionButton(resource)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Trending Topics */}
          <div className="mt-8 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              {t.trendingTopics}
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Sustainable Farming",
                "Climate Smart Agriculture",
                "Organic Farming",
                "Precision Agriculture",
                "AgriTech Innovation",
                "Farm Management",
                "Crop Rotation",
                "Water Conservation"
              ].map(topic => (
                <button
                  key={topic}
                  className="px-3 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/20 hover:text-green-800 dark:hover:text-green-400 transition-all text-sm"
                >
                  #{topic.toLowerCase().replace(/\s+/g, '')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Protected>
  );
}