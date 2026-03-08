// import SearchBar from "@/Components/comp-25";
// import { ThemeToggle } from "@/components/ui/theme-toggle";
// import NotificationDropdown from "@/components/popover-standard-12";
// import DropdownMenuProfile from "@/components/dropdown-menu-profile-1";
// import PopUpActions from "@/components/command-dialog-6";
// import LanguageSwitcher from "@/Components/LanguageSwitcher";
// import CurrencyToggle from "@/Components/CurrencyToggle";

// export default function Header() {
//   return (
//     <header className="sticky top-0 z-50 w-full bg-sidebar backdrop-blur border-b border-sidebar-border">
//       <div className="flex items-center px-4 py-3 lg:px-6">
//         <div className="flex-1"></div>
//         <div className="w-[30%] mr-4">
//           <SearchBar />
//         </div>

//         <div className="flex items-center gap-4 flex-1 justify-end">
//           <LanguageSwitcher />
//           <CurrencyToggle />
//           <PopUpActions />
//           <ThemeToggle />
//           <NotificationDropdown />
//           <DropdownMenuProfile />
//         </div>
//       </div>
//     </header>
//   );
// }


import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import NotificationDropdown from "@/components/popover-standard-12";
import DropdownMenuProfile from "@/components/dropdown-menu-profile-1";
import PopUpActions from "@/components/command-dialog-6";
import LanguageSwitcher from "@/Components/LanguageSwitcher";
import CurrencyToggle from "@/Components/CurrencyToggle";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const desktopSearchRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (window.innerWidth >= 768) {
          desktopSearchRef.current?.focus();
        } else {
          setSearchOpen(true);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    } else if (!searchOpen) {
      setSearchQuery("");
    }
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      setSearchOpen(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    } else if (desktopSearchRef.current) {
      desktopSearchRef.current.focus();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container flex items-center justify-between h-16 px-4 lg:px-6 gap-4 ">
        <div className="flex-shrink-0">
        </div>

        <div className="hidden md:flex flex-1 max-w-md ">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            
            <Input
              ref={desktopSearchRef}
              type="search"
              placeholder="Search..."
              className="pl-10 pr-20 h-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-accent"
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
              
              <kbd className="inline-flex h-6 items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </form>
        </div>

        <nav className="flex items-center justify-between flex-1 md:flex-initial gap-2 sm:gap-2 min-w-0 " aria-label="Header navigation">
          <Button
            variant="outline"
            size="icon"
            className="md:hidden shrink-0 h-9 w-9 hover:bg-accent transition-colors"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
          >
            <Search className="h-2 w-2" />
          </Button>

          <div className="hidden sm:flex items-center gap-2">
            <LanguageSwitcher />
            <CurrencyToggle />
          </div>

          <PopUpActions />
          <ThemeToggle />
          <NotificationDropdown />
          <DropdownMenuProfile />
        </nav>
      </div>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-2xl p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-lg font-semibold">
              Search
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSearch} className="px-6 pb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              
              <Input
                ref={searchInputRef}
                type="search"
                placeholder="Search anything..."
                className="pl-10 pr-20 h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setSearchOpen(false);
                  }
                }}
              />

              <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
                {searchQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-accent"
                    onClick={clearSearch}
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
                
                <kbd className="hidden sm:inline-flex h-6 items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </div>

            {searchQuery && (
              <div className="mt-4 text-sm text-muted-foreground">
                Press <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">Enter</kbd> to search
              </div>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </header>
  );
}