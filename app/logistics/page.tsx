"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Truck,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  CheckCircle,
  XCircle,
  X,
  AlertCircle,
  Package,
  Calendar,
  DollarSign,
  User,
  Navigation,
  Route,
  Fuel,
  Weight,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { Protected } from "@/components/Protected";
import { ThemeToggle } from "@/components/ThemeToggle";
import HamburgerNav from "@/components/navigation/HamburgerNav";
import { useAuth } from "@/hooks/use-auth";

const translations = {
  en: {
    logistics: "Logistics",
    transportLogistics: "Transport & Logistics",
    bookTransport: "Book Transport",
    activeShipments: "Active Shipments",
    shipmentHistory: "Shipment History",
    findTrucks: "Find Available Trucks",
    coordinateWith: "Coordinate with aggregators",
    bookCollection: "Book Collection",
    shipmentId: "Shipment ID",
    status: "Status",
    origin: "Origin",
    destination: "Destination",
    driver: "Driver",
    vehicle: "Vehicle",
    estimatedArrival: "Est. Arrival",
    contactDriver: "Contact Driver",
    trackShipment: "Track Shipment",
    viewDetails: "View Details",
    pending: "Pending",
    inTransit: "In Transit",
    delivered: "Delivered",
    cancelled: "Cancelled",
    pickupLocation: "Pickup Location",
    deliveryLocation: "Delivery Location",
    cargoType: "Cargo Type",
    weight: "Weight",
    cost: "Cost",
    date: "Date",
    time: "Time",
    notes: "Notes",
    bookNewShipment: "Book New Shipment",
    selectOrigin: "Select origin...",
    selectDestination: "Select destination...",
    selectCargoType: "Select cargo type...",
    enterWeight: "Enter weight (kg)",
    estimatedCost: "Estimated Cost",
    confirmBooking: "Confirm Booking",
    cancel: "Cancel",
    bookingConfirmed: "Booking confirmed successfully!",
    bookingError: "Booking failed. Please try again.",
    noActiveShipments: "No active shipments",
    noActiveShipmentsDesc: "You have no shipments currently in transit.",
    searchShipments: "Search shipments...",
    filterByStatus: "Filter by status",
    allStatuses: "All Statuses",
    availableTrucks: "Available Trucks",
    truckType: "Truck Type",
    capacity: "Capacity",
    rate: "Rate per km",
    availability: "Availability",
    bookNow: "Book Now",
    contactAggregator: "Contact Aggregator",
    logisticsPartners: "Logistics Partners",
    trustedPartners: "Trusted logistics partners in your area",
    partnerName: "Partner Name",
    services: "Services",
    rating: "Rating",
    reviews: "reviews",
    callNow: "Call Now",
    message: "Message",
    logisticsTips: "Logistics Tips",
    tip1: "Book transport 2-3 days in advance for better rates",
    tip2: "Ensure proper packaging to prevent cargo damage",
    tip3: "Track your shipments regularly for updates",
    tip4: "Have all necessary documents ready for customs",
    tip5: "Consider weather conditions for delivery scheduling"
  },
  sw: {
    logistics: "Usafirishaji",
    transportLogistics: "Usafirishaji na Vifaa",
    bookTransport: "Tafuta Usafirishaji",
    activeShipments: "Mizigo Hai",
    shipmentHistory: "Historia ya Mizigo",
    findTrucks: "Tafuta Malori",
    coordinateWith: "Shiriki na wakusanyaji",
    bookCollection: "Tafuta Ukusanyaji",
    shipmentId: "Nambari ya Mzigo",
    status: "Hali",
    origin: "Chanzo",
    destination: "Mahali pa Kufika",
    driver: "Dereva",
    vehicle: "Gari",
    estimatedArrival: "Muda wa Kufika",
    contactDriver: "Wasiliana na Dereva",
    trackShipment: "Fuatilia Mzigo",
    viewDetails: "Angalia Maelezo",
    pending: "Inasubiri",
    inTransit: "Safarini",
    delivered: "Imefika",
    cancelled: "Imegairiwa",
    pickupLocation: "Mahali pa Kuchukua",
    deliveryLocation: "Mahali pa Kufika",
    cargoType: "Aina ya Mzigo",
    weight: "Uzito",
    cost: "Gharama",
    date: "Tarehe",
    time: "Muda",
    notes: "Maelezo",
    bookNewShipment: "Tafuta Usafirishaji Mpya",
    selectOrigin: "Chagua chanzo...",
    selectDestination: "Chagua mahali pa kufika...",
    selectCargoType: "Chagua aina ya mzigo...",
    enterWeight: "Ingiza uzito (kg)",
    estimatedCost: "Gharama Inayokadiriwa",
    confirmBooking: "Thibitisha Utafutaji",
    cancel: "Ghairi",
    bookingConfirmed: "Utafutaji umethibitishwa!",
    bookingError: "Utafutaji umeshindikana. Jaribu tena.",
    noActiveShipments: "Hakuna mizigo hai",
    noActiveShipmentsDesc: "Huna mizigo yoyote inayosafirishwa sasa.",
    searchShipments: "Tafuta mizigo...",
    filterByStatus: "Chuja kwa hali",
    allStatuses: "Hali Zote",
    availableTrucks: "Malori Yanayopatikana",
    truckType: "Aina ya Lori",
    capacity: "Uwezo",
    rate: "Kiwango kwa km",
    availability: "Upatikanaji",
    bookNow: "Tafuta Sasa",
    contactAggregator: "Wasiliana na Mkusanyaji",
    logisticsPartners: "Washirika wa Usafirishaji",
    trustedPartners: "Washirika wa kuaminika katika eneo lako",
    partnerName: "Jina la Shirika",
    services: "Huduma",
    rating: "Ukadiriaji",
    reviews: "maoni",
    callNow: "Piga Sasa",
    message: "Ujumbe",
    logisticsTips: "Vidokezo vya Usafirishaji",
    tip1: "Tafuta usafirishaji siku 2-3 mapema kwa bei nzuri",
    tip2: "Hakikisha ufungaji mzuri ili kuepuka uharibifu",
    tip3: "Fuatilia mizigo yako mara kwa mara",
    tip4: "Kuwa na hati zote muhimu tayari",
    tip5: "Zingatia hali ya hewa wakati wa kupanga"
  }
};

// Mock data for shipments
const mockShipments = [
  {
    id: "SHP-2024-001",
    status: "inTransit",
    origin: "Nairobi Farm",
    destination: "Nairobi Market",
    driver: "John Mwangi",
    driverPhone: "+254 700 123 456",
    vehicle: "Truck - KCA 123B",
    cargoType: "Maize",
    weight: 2500,
    cost: 15000,
    estimatedArrival: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    pickupDate: new Date(Date.now() - 4 * 60 * 60 * 1000),
    notes: "Handle with care - premium quality maize"
  },
  {
    id: "SHP-2024-002",
    status: "pending",
    origin: "Nakuru Farm",
    destination: "Eldoret Market",
    driver: "Pending Assignment",
    driverPhone: "",
    vehicle: "To be assigned",
    cargoType: "Beans",
    weight: 1200,
    cost: 22000,
    estimatedArrival: new Date(Date.now() + 6 * 60 * 60 * 1000),
    pickupDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
    notes: "Requires refrigerated transport"
  },
  {
    id: "SHP-2024-003",
    status: "delivered",
    origin: "Thika Farm",
    destination: "Mombasa Port",
    driver: "Peter Kiprop",
    driverPhone: "+254 722 987 654",
    vehicle: "Truck - KCB 456C",
    cargoType: "Avocado",
    weight: 800,
    cost: 35000,
    estimatedArrival: new Date(Date.now() - 1 * 60 * 60 * 1000),
    pickupDate: new Date(Date.now() - 8 * 60 * 60 * 1000),
    notes: "Delivered successfully"
  }
];

// Mock data for available trucks
const availableTrucks = [
  {
    id: 1,
    type: "Flatbed Truck",
    capacity: "5 tons",
    rate: 25,
    availability: "Available now",
    location: "Nairobi",
    driver: "James Oduya",
    contact: "+254 733 111 222"
  },
  {
    id: 2,
    type: "Refrigerated Truck",
    capacity: "3 tons",
    rate: 35,
    availability: "Available in 2 hours",
    location: "Nakuru",
    driver: "Sarah Wanjiku",
    contact: "+254 722 333 444"
  },
  {
    id: 3,
    type: "Box Truck",
    capacity: "2 tons",
    rate: 20,
    availability: "Available tomorrow",
    location: "Thika",
    driver: "David Kiprop",
    contact: "+254 700 555 666"
  }
];

// Mock data for logistics partners
const logisticsPartners = [
  {
    id: 1,
    name: "AgroTrans Kenya Ltd",
    services: ["Road Transport", "Warehousing", "Customs Clearance"],
    rating: 4.8,
    reviews: 156,
    contact: "+254 20 123 4567",
    location: "Nairobi"
  },
  {
    id: 2,
    name: "FarmLink Logistics",
    services: ["Local Delivery", "Cold Chain", "Export Services"],
    rating: 4.6,
    reviews: 89,
    contact: "+254 20 987 6543",
    location: "Nakuru"
  },
  {
    id: 3,
    name: "Green Cargo Solutions",
    services: ["Bulk Transport", "Container Services", "Insurance"],
    rating: 4.9,
    reviews: 203,
    contact: "+254 20 555 7890",
    location: "Mombasa"
  }
];

const kenyaLocations = [
  "Nairobi", "Nakuru", "Thika", "Eldoret", "Kisumu", "Mombasa", "Naivasha", "Nyeri", "Meru", "Embu"
];

const cargoTypes = [
  "Maize", "Beans", "Avocado", "Coffee", "Potatoes", "Tomatoes", "Cabbage", "Carrots", "Onions", "Other"
];

export default function LogisticsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [preferredLang, setPreferredLang] = useState<"en" | "sw">("sw");
  const [activeTab, setActiveTab] = useState("active");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showTruckModal, setShowTruckModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [bookingForm, setBookingForm] = useState({
    origin: "",
    destination: "",
    cargoType: "",
    weight: "",
    notes: ""
  });

  const t = translations[preferredLang];

  // Filter shipments
  const filteredShipments = mockShipments.filter(shipment => {
    const matchesSearch = shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shipment.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shipment.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || shipment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400";
      case "inTransit":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400";
      case "delivered":
        return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400";
      default:
        return "bg-neutral-100 dark:bg-neutral-900/20 text-neutral-800 dark:text-neutral-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return t.pending;
      case "inTransit":
        return t.inTransit;
      case "delivered":
        return t.delivered;
      case "cancelled":
        return t.cancelled;
      default:
        return status;
    }
  };

  const handleBookShipment = () => {
    // Mock booking logic
    alert(t.bookingConfirmed);
    setShowBookingModal(false);
    setBookingForm({ origin: "", destination: "", cargoType: "", weight: "", notes: "" });
  };

  const calculateEstimatedCost = () => {
    if (!bookingForm.origin || !bookingForm.destination || !bookingForm.weight) return 0;

    // Mock calculation based on distance and weight
    const baseRate = 20; // KES per km
    const distance = 150; // Mock distance in km
    const weightRate = parseFloat(bookingForm.weight) * 5; // KES per kg

    return (distance * baseRate) + weightRate;
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
                  activeTab="logistics"
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
              {t.logistics}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              {t.transportLogistics}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => setShowBookingModal(true)}
              className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-green-600">
                <Plus size={20} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {t.bookTransport}
                </p>
                <p className="text-xs text-neutral-500">
                  {preferredLang === 'sw' ? 'Tafuta usafirishaji' : 'Find transportation'}
                </p>
              </div>
            </button>

            <button
              onClick={() => setShowTruckModal(true)}
              className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600">
                <Truck size={20} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {t.findTrucks}
                </p>
                <p className="text-xs text-neutral-500">
                  {preferredLang === 'sw' ? 'Tafuta malori' : 'Available vehicles'}
                </p>
              </div>
            </button>

            <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-600">
                <MapPin size={20} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {t.coordinateWith}
                </p>
                <p className="text-xs text-neutral-500">
                  {preferredLang === 'sw' ? 'Shiriki na wakusanyaji' : 'Local aggregators'}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs and Filters */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 mb-6">
            {/* Tabs */}
            <div className="flex gap-4 mb-6">
              {[
                { id: "active", label: t.activeShipments },
                { id: "history", label: t.shipmentHistory },
                { id: "partners", label: t.logisticsPartners }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    activeTab === tab.id
                      ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Filters */}
            {activeTab !== "partners" && (
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder={t.searchShipments}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  <option value="all">{t.allStatuses}</option>
                  <option value="pending">{t.pending}</option>
                  <option value="inTransit">{t.inTransit}</option>
                  <option value="delivered">{t.delivered}</option>
                  <option value="cancelled">{t.cancelled}</option>
                </select>
              </div>
            )}
          </div>

          {/* Content based on active tab */}
          {activeTab === "active" || activeTab === "history" ? (
            <div className="space-y-4">
              {filteredShipments.length === 0 ? (
                <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 text-center">
                  <Truck className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                    {t.noActiveShipments}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {t.noActiveShipmentsDesc}
                  </p>
                </div>
              ) : (
                filteredShipments.map(shipment => (
                  <div key={shipment.id} className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                              {shipment.id}
                            </h3>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(shipment.status)}`}>
                              {getStatusText(shipment.status)}
                            </span>
                          </div>
                          <p className="text-lg font-black text-green-600">
                            KES {shipment.cost.toLocaleString()}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-neutral-400" />
                            <div>
                              <p className="text-xs text-neutral-500">{t.origin}</p>
                              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{shipment.origin}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Route className="w-4 h-4 text-neutral-400" />
                            <div>
                              <p className="text-xs text-neutral-500">{t.destination}</p>
                              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{shipment.destination}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-neutral-400" />
                            <div>
                              <p className="text-xs text-neutral-500">{t.cargoType}</p>
                              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{shipment.cargoType}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Weight className="w-4 h-4 text-neutral-400" />
                            <div>
                              <p className="text-xs text-neutral-500">{t.weight}</p>
                              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{shipment.weight}kg</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                          <span>{t.driver}: {shipment.driver}</span>
                          <span>{t.vehicle}: {shipment.vehicle}</span>
                          <span>{t.estimatedArrival}: {shipment.estimatedArrival.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {shipment.driverPhone && (
                          <button className="flex items-center gap-2 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all">
                            <Phone size={16} />
                            {t.contactDriver}
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedShipment(shipment)}
                          className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                        >
                          <Eye size={16} />
                          {t.viewDetails}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : activeTab === "partners" ? (
            <div className="space-y-4">
              <div className="mb-4">
                <p className="text-neutral-600 dark:text-neutral-400">
                  {t.trustedPartners}
                </p>
              </div>

              {logisticsPartners.map(partner => (
                <div key={partner.id} className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                            {partner.name}
                          </h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            📍 {partner.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                              ⭐ {partner.rating}
                            </span>
                            <span className="text-xs text-neutral-500">
                              ({partner.reviews} {t.reviews})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          {t.services}:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {partner.services.map(service => (
                            <span
                              key={service}
                              className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded text-xs"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all">
                        <Phone size={16} />
                        {t.callNow}
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all">
                        <MessageCircle size={16} />
                        {t.message}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {/* Logistics Tips */}
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4">
              {t.logisticsTips}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <p className="text-sm text-blue-800 dark:text-blue-200">{t.tip1}</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <p className="text-sm text-blue-800 dark:text-blue-200">{t.tip2}</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <p className="text-sm text-blue-800 dark:text-blue-200">{t.tip3}</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <p className="text-sm text-blue-800 dark:text-blue-200">{t.tip4}</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <p className="text-sm text-blue-800 dark:text-blue-200">{t.tip5}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                {t.bookNewShipment}
              </h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    {t.origin}
                  </label>
                  <select
                    value={bookingForm.origin}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, origin: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  >
                    <option value="">{t.selectOrigin}</option>
                    {kenyaLocations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    {t.destination}
                  </label>
                  <select
                    value={bookingForm.destination}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, destination: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  >
                    <option value="">{t.selectDestination}</option>
                    {kenyaLocations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    {t.cargoType}
                  </label>
                  <select
                    value={bookingForm.cargoType}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, cargoType: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  >
                    <option value="">{t.selectCargoType}</option>
                    {cargoTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    {t.weight}
                  </label>
                  <input
                    type="number"
                    value={bookingForm.weight}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, weight: e.target.value }))}
                    placeholder={t.enterWeight}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    {t.notes}
                  </label>
                  <textarea
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    placeholder="Any special requirements..."
                  />
                </div>

                {bookingForm.origin && bookingForm.destination && bookingForm.weight && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      {t.estimatedCost}: KES {calculateEstimatedCost().toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleBookShipment}
                  disabled={!bookingForm.origin || !bookingForm.destination || !bookingForm.cargoType || !bookingForm.weight}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-neutral-400 transition-all"
                >
                  {t.confirmBooking}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Available Trucks Modal */}
        {showTruckModal && (
          <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-4xl w-full p-6 max-h-[80vh] overflow-y-auto">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                {t.availableTrucks}
              </h3>

              <div className="space-y-4">
                {availableTrucks.map(truck => (
                  <div key={truck.id} className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                              {truck.type}
                            </h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                              📍 {truck.location} • 👤 {truck.driver}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-black text-green-600">
                              KES {truck.rate}/km
                            </p>
                            <p className="text-xs text-neutral-500">
                              {truck.availability}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-neutral-400" />
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">
                              {t.capacity}: {truck.capacity}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-neutral-400" />
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">
                              {truck.contact}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all">
                          <Phone size={16} />
                          {t.callNow}
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all">
                          <Truck size={16} />
                          {t.bookNow}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowTruckModal(false)}
                  className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Shipment Details Modal */}
        {selectedShipment && (
          <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  {t.shipmentId}: {selectedShipment.id}
                </h3>
                <button
                  onClick={() => setSelectedShipment(null)}
                  className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-neutral-500 mb-1">{t.status}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedShipment.status)}`}>
                      {getStatusText(selectedShipment.status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-500 mb-1">{t.cost}</p>
                    <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                      KES {selectedShipment.cost.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-neutral-500 mb-1">{t.pickupLocation}</p>
                    <p className="text-sm text-neutral-900 dark:text-neutral-100">{selectedShipment.origin}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-500 mb-1">{t.deliveryLocation}</p>
                    <p className="text-sm text-neutral-900 dark:text-neutral-100">{selectedShipment.destination}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-500 mb-1">{t.cargoType}</p>
                    <p className="text-sm text-neutral-900 dark:text-neutral-100">{selectedShipment.cargoType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-500 mb-1">{t.weight}</p>
                    <p className="text-sm text-neutral-900 dark:text-neutral-100">{selectedShipment.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-500 mb-1">{t.driver}</p>
                    <p className="text-sm text-neutral-900 dark:text-neutral-100">{selectedShipment.driver}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-500 mb-1">{t.vehicle}</p>
                    <p className="text-sm text-neutral-900 dark:text-neutral-100">{selectedShipment.vehicle}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-neutral-500 mb-1">{t.estimatedArrival}</p>
                  <p className="text-sm text-neutral-900 dark:text-neutral-100">
                    {selectedShipment.estimatedArrival.toLocaleString()}
                  </p>
                </div>

                {selectedShipment.notes && (
                  <div>
                    <p className="text-sm font-medium text-neutral-500 mb-1">{t.notes}</p>
                    <p className="text-sm text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg">
                      {selectedShipment.notes}
                    </p>
                  </div>
                )}

                {selectedShipment.driverPhone && (
                  <div className="flex gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all">
                      <Phone size={16} />
                      {t.contactDriver}
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all">
                      <Navigation size={16} />
                      {t.trackShipment}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Protected>
  );
}