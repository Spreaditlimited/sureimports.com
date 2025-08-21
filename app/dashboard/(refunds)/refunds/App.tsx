import svgPaths from "./imports/svg-yux5hd1wil";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Filter, ChevronDown, Plus, CheckCircle, X, Wallet } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./components/ui/dialog";

// Using Lucide icons for better reliability

const refundData = [
  {
    id: "#REF-2025-001",
    orderId: "#ORD-2025-001",
    amount: "₦150.00",
    status: "Approved",
    statusColor: "green",
    serviceType: "Buy from Chinese Websites"
  },
  {
    id: "#REF-2025-002",
    orderId: "#ORD-2025-002",
    amount: "₦200.00",
    status: "Pending",
    statusColor: "yellow",
    serviceType: "Buy Phones & Laptops"
  },
  {
    id: "#REF-2025-003",
    orderId: "#ORD-2025-003",
    amount: "₦75.00",
    status: "Rejected",
    statusColor: "red",
    serviceType: "Special Sourcing"
  },
  {
    id: "#REF-2025-004",
    orderId: "#ORD-2025-004",
    amount: "₦300.00",
    status: "Approved",
    statusColor: "green",
    serviceType: "Buy from Chinese Websites"
  },
  {
    id: "#REF-2025-005",
    orderId: "#ORD-2025-005",
    amount: "₦125.00",
    status: "Pending",
    statusColor: "yellow",
    serviceType: "Buy Phones & Laptops"
  },
  {
    id: "#REF-2025-006",
    orderId: "#ORD-2025-006",
    amount: "₦100.00",
    status: "Rejected",
    statusColor: "red",
    serviceType: "Buy Phones & Laptops"
  },
  {
    id: "#REF-2025-007",
    orderId: "#ORD-2025-007",
    amount: "₦250.00",
    status: "Approved",
    statusColor: "green",
    serviceType: "Special Sourcing"
  },
  {
    id: "#REF-2025-008",
    orderId: "#ORD-2025-008",
    amount: "₦180.00",
    status: "Pending",
    statusColor: "yellow",
    serviceType: "Buy from Chinese Websites"
  },
  {
    id: "#REF-2025-009",
    orderId: "#ORD-2025-009",
    amount: "₦90.00",
    status: "Rejected",
    statusColor: "red",
    serviceType: "Buy Phones & Laptops"
  },
  {
    id: "#REF-2025-010",
    orderId: "#ORD-2025-010",
    amount: "₦400.00",
    status: "Approved",
    statusColor: "green",
    serviceType: "Special Sourcing"
  },
  {
    id: "#REF-2025-011",
    orderId: "#ORD-2025-011",
    amount: "₦0.00",
    status: "Cancelled",
    statusColor: "red",
    serviceType: "Buy from Chinese Websites"
  },
  {
    id: "#REF-2025-012",
    orderId: "#ORD-2025-012",
    amount: "₦0.00",
    status: "Rejected",
    statusColor: "red",
    serviceType: "Buy Phones & Laptops"
  }
];

function StatusTag({ status, color }: { status: string; color: string }) {
  const getStatusColors = () => {
    switch (color) {
      case "green":
        return "bg-green-500/10 text-green-600 dark:bg-green-400/10 dark:text-green-400";
      case "yellow":
        return "bg-yellow-500/10 text-yellow-600 dark:bg-yellow-400/10 dark:text-yellow-400";
      case "red":
        return "bg-red-500/10 text-red-600 dark:bg-red-400/10 dark:text-red-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div
      className={`${getStatusColors()} inline-flex items-center px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap`}
    >
      {status}
    </div>
  );
}



export default function App() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showRefundDestinationModal, setShowRefundDestinationModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const filterOptions = ["All", "Pending", "Approved", "Rejected"];
  const itemsPerPage = 5;

  // Initialize theme from localStorage (default to light)
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const shouldBeDark = savedTheme === 'dark'; // Only dark if explicitly set to dark
    
    setIsDarkMode(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  // Handle theme toggle
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRequestRefund = () => {
    setShowRefundDestinationModal(true);
  };

  const handleRefundToBankAccount = () => {
    setShowRefundDestinationModal(false);
    setShowRefundModal(true);
  };

  const handleRefundToWallet = () => {
    setShowRefundDestinationModal(false);
    setShowWalletModal(true);
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    setShowFilterDropdown(false);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const filteredData = selectedFilter === "All" 
    ? refundData 
    : refundData.filter(item => item.status === selectedFilter);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = filteredData.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate total amount for filtered data
  const totalAmount = filteredData.reduce((sum, item) => {
    return sum + parseFloat(item.amount.replace('₦', ''));
  }, 0);

  // Check if there are any refunds with amounts greater than ₦0
  const hasRefundableAmounts = filteredData.some(item => parseFloat(item.amount.replace('₦', '')) > 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground leading-tight">
                    Refunds
                  </h1>
                  <span className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Refunds (Transactions)
                  </span>
                </div>
                <p className="text-base sm:text-lg text-foreground leading-relaxed">
                  Track Refunds & Requests across all services
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={handleRequestRefund}
                  disabled={!hasRefundableAmounts}
                  className={`transition-colors duration-200 flex items-center justify-center gap-2 px-4 sm:px-6 lg:px-8 py-3 rounded-[10px] shadow-sm ${
                    hasRefundableAmounts
                      ? 'bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground'
                      : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                  }`}
                >
                  <Plus className="size-5 sm:size-6 flex-shrink-0" />
                  <span className="text-sm sm:text-base lg:text-lg font-medium">Request Refund</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats and Filter Card */}
          <div className="bg-card rounded-[20px] border border-border shadow-sm mb-6 sm:mb-8">
            <div className="p-6 sm:p-8">
              <div className="flex flex-row items-center justify-between gap-4 lg:gap-6">
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base text-muted-foreground mb-1 sm:mb-2">
                    Total Amount {selectedFilter !== "All" && `(${selectedFilter})`}
                  </p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground">
                    ₦{totalAmount.toFixed(2)}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 lg:gap-4">
                  <span className="text-sm sm:text-base lg:text-lg text-foreground font-medium hidden sm:block">Filter By</span>
                  <div className="relative z-50" ref={dropdownRef}>
                    <button
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                      className={`bg-muted hover:bg-accent active:bg-accent/80 transition-all duration-200 border border-border flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-[10px] min-w-[140px] shadow-sm ${
                        showFilterDropdown ? 'ring-2 ring-ring border-primary/50' : ''
                      }`}
                    >
                      <Filter className="size-4 sm:size-5 flex-shrink-0 text-muted-foreground" />
                      <span className="text-base sm:text-lg font-medium text-foreground flex-1 text-left">{selectedFilter}</span>
                      <ChevronDown className={`size-4 sm:size-5 flex-shrink-0 text-muted-foreground transition-transform duration-200 ${
                        showFilterDropdown ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    {showFilterDropdown && (
                      <>
                        {/* Backdrop to catch clicks */}
                        <div 
                          className="fixed inset-0 z-40"
                          onClick={() => setShowFilterDropdown(false)}
                        />
                        
                        {/* Dropdown menu */}
                        <div className="absolute top-full left-0 mt-2 bg-popover border border-border rounded-[10px] shadow-2xl z-50 overflow-hidden min-w-full w-max">
                          {filterOptions.map((option) => (
                            <button
                              key={option}
                              onClick={() => handleFilterChange(option)}
                              className={`w-full text-left px-4 sm:px-5 py-2.5 hover:bg-accent active:bg-accent/80 transition-colors duration-150 flex items-center justify-between gap-3 ${
                                selectedFilter === option ? 'bg-accent text-accent-foreground font-semibold' : 'text-popover-foreground'
                              }`}
                            >
                              <span className="text-base sm:text-lg whitespace-nowrap">{option}</span>
                              {selectedFilter === option && (
                                <div className="size-4 rounded-full bg-primary flex items-center justify-center">
                                  <div className="size-1.5 rounded-full bg-primary-foreground"></div>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-card rounded-[20px] border border-border shadow-sm">
            {/* Table Header */}
            <div className="bg-muted/50 border-b border-border rounded-t-[20px] p-4 sm:p-6">
              <div className="font-semibold text-foreground">Refunds</div>
            </div>

            {/* Scrollable Table Container */}
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <div className="min-w-[800px]">
                {/* Table Header Row */}
                <div className="grid grid-cols-5 gap-4 lg:gap-6 xl:gap-8 p-4 sm:p-6 xl:p-8 bg-muted/20 border-b border-border">
                  <div className="font-semibold text-foreground">Refund ID</div>
                  <div className="font-semibold text-foreground">Order ID</div>
                  <div className="font-semibold text-foreground">Amount (NGN)</div>
                  <div className="font-semibold text-foreground">Status</div>
                  <div className="font-semibold text-foreground">Service Type</div>
                </div>

                {/* Table Content */}
                <div className="divide-y divide-border">
                  {currentPageData.length > 0 ? (
                    currentPageData.map((item, index) => (
                      <div key={item.id} className="grid grid-cols-5 gap-4 lg:gap-6 xl:gap-8 p-4 sm:p-6 xl:p-8 hover:bg-muted/30 transition-colors duration-150 items-center">
                        <div className="text-foreground font-medium break-all">{item.id}</div>
                        <div className="text-foreground break-all">{item.orderId}</div>
                        <div className="font-medium text-foreground">{item.amount}</div>
                        <div className="flex items-center">
                          <StatusTag status={item.status} color={item.statusColor} />
                        </div>
                        <div className="text-foreground">{item.serviceType}</div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground col-span-5">
                      No refunds found for the selected filter.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pagination */}
            {filteredData.length > 0 && (
              <div className="bg-muted/50 border-t border-border p-6 xl:p-8 rounded-b-[20px]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-sm sm:text-base text-foreground">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of {filteredData.length} Refunds
                  </div>
                  
                  <div className="flex items-center justify-center sm:justify-end">
                    <div className="bg-card border border-border rounded-[10px] flex items-center divide-x divide-border shadow-sm">
                      <button 
                        onClick={handlePrevPage}
                        className="p-2 sm:p-3 hover:bg-accent active:bg-accent/80 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="size-4 text-primary" />
                      </button>
                      
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageClick(pageNum)}
                            className={`px-3 sm:px-4 py-2 transition-colors duration-200 ${
                              currentPage === pageNum
                                ? 'font-medium text-primary bg-accent'
                                : 'text-muted-foreground hover:text-primary hover:bg-accent'
                            }`}
                          >
                            <span className="text-sm sm:text-base">
                              {pageNum.toString().padStart(2, '0')}
                            </span>
                          </button>
                        );
                      })}
                      
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <div className="px-2 sm:px-4 py-2">
                          <span className="text-muted-foreground text-sm sm:text-base">...</span>
                        </div>
                      )}
                      
                      <button 
                        onClick={handleNextPage}
                        className="p-2 sm:p-3 hover:bg-accent active:bg-accent/80 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="size-4 text-primary" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Refund Destination Selection Modal */}
      <Dialog open={showRefundDestinationModal} onOpenChange={setShowRefundDestinationModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-semibold text-center">
              Choose Refund Destination
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Select where you would like to receive your refund
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <p className="text-center text-muted-foreground leading-relaxed">
              Would you want this refund amount sent to your bank account or your wallet?
            </p>
            
            <div className="grid grid-cols-1 gap-3 pt-4">
              <button
                onClick={handleRefundToBankAccount}
                className="w-full bg-primary hover:bg-primary/90 active:bg-primary/80 transition-colors duration-200 flex items-center justify-center gap-2 px-6 py-4 rounded-[10px] text-primary-foreground font-medium"
              >
                My bank account
              </button>
              <button
                onClick={handleRefundToWallet}
                className="w-full bg-green-600 hover:bg-green-600/90 active:bg-green-600/80 transition-colors duration-200 flex items-center justify-center gap-2 px-6 py-4 rounded-[10px] text-white font-medium"
              >
                My Wallet
              </button>
            </div>
          </div>
          
          <button
            onClick={() => setShowRefundDestinationModal(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogContent>
      </Dialog>

      {/* Bank Account Refund Confirmation Modal */}
      <Dialog open={showRefundModal} onOpenChange={setShowRefundModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircle className="size-8 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-xl font-semibold text-center">
              Bank Account Refund Processing
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Bank refund processing confirmation
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <p className="text-center text-muted-foreground leading-relaxed">
              Your refund request has been received. Your refund will be credited to the bank account in your Sure Imports account within <span className="font-medium text-foreground">7 business days</span>.
            </p>
            
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground text-center">
                If your bank account is not there, kindly update your account.
              </p>
            </div>
            
            <div className="pt-4">
              <button
                onClick={() => setShowRefundModal(false)}
                className="w-full bg-primary hover:bg-primary/90 active:bg-primary/80 transition-colors duration-200 flex items-center justify-center gap-2 px-6 py-3 rounded-[10px] text-primary-foreground font-medium"
              >
                Got it
              </button>
            </div>
          </div>
          
          <button
            onClick={() => setShowRefundModal(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogContent>
      </Dialog>

      {/* Wallet Refund Confirmation Modal */}
      <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <Wallet className="size-8 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-xl font-semibold text-center">
              Wallet Refund Successful
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Wallet refund transaction completed
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <p className="text-center text-muted-foreground leading-relaxed">
              Your refund amount has been successfully added to your wallet balance. Thank you.
            </p>
            
            <div className="pt-4">
              <button
                onClick={() => setShowWalletModal(false)}
                className="w-full bg-primary hover:bg-primary/90 active:bg-primary/80 transition-colors duration-200 flex items-center justify-center gap-2 px-6 py-3 rounded-[10px] text-primary-foreground font-medium"
              >
                Got it
              </button>
            </div>
          </div>
          
          <button
            onClick={() => setShowWalletModal(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}