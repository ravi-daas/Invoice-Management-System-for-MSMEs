import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  LifeBuoy,
  ChevronDown,
  PlusCircle,
  List,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { Switch } from "../ui/switch";

const navigation = [
  { name: "Dashboard", href: "/", image: "/DashboardIcon.png" },
  {
    name: "Invoices",
    image: "/Invoice.png",
    subMenu: [
      {
        name: "All Invoices",
        href: "/InvoiceDashboard/AllInvoices",
        icon: List,
      },
      {
        name: "Retail Invoice",
        href: "/InvoiceDashboard/CreateInvoiceRetail",
        icon: PlusCircle,
      },
      {
        name: "GST Invoice",
        href: "/InvoiceDashboard/CreateInvoiceGST",
        icon: PlusCircle,
      },
    ],
  },
  {
    name: "Quotations",
    image: "/Quotations.png",
    subMenu: [
      {
        name: "All Quotations",
        href: "/QuotationDashboard/AllQuotations",
        icon: List,
      },
      {
        name: "Create Quotation",
        href: "/QuotationDashboard/CreateQuotation",
        icon: PlusCircle,
      },
    ],
  },
  {
    name: "Clients",
    image: "/Client.png",
    subMenu: [
      { name: "All Clients", href: "/ClientDashboard/AllClients", icon: List },
      {
        name: "Add Client",
        href: "/ClientDashboard/CreateClient",
        icon: PlusCircle,
      },
    ],
  },
  {
    name: "Inventory",
    image: "/Inventory.png",
    subMenu: [
      { name: "All Inventory", href: "/InventoryDashboard", icon: List },
    ],
  },
];

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [openSettings, setOpenSettings] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="bg-black dark:bg-black">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className=" p-1 py-2">
                  {/* <SidebarMenuButton size="lg" asChild className=" bg-black"> */}
                  <Link
                    to="/"
                    className="flex items-center gap-2 min-w-[230px]"
                  >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg border border-white text-[#67338a] dark:text-[#bb6cef] hover:bg-black">
                      <LayoutDashboard className="size-5 text-white" />
                    </div>
                    <span className="font-semibold text-white">
                      Invoicing Management
                    </span>
                  </Link>
                  {/* </SidebarMenuButton> */}
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  {item.subMenu ? (
                    <div className="w-full">
                      <SidebarMenuButton
                        className="w-full flex justify-between items-center p-5 text-white"
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === item.name ? null : item.name
                          )
                        }
                        // isActive={openDropdown === item.name}
                      >
                        <div className="flex items-center gap-2">
                          {item?.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-8 h-6"
                            />
                          ) : (
                            // @ts-ignore
                            <item.icon className="size-5" />
                          )}{" "}
                          {item.name}
                        </div>
                        <ChevronDown
                          className={`size-4 transition-transform ${
                            openDropdown === item.name ? "rotate-180" : ""
                          }`}
                        />
                      </SidebarMenuButton>
                      {openDropdown === item.name && (
                        <div className="ml-6">
                          {item.subMenu.map((subItem) => (
                            <SidebarMenuButton
                              key={subItem.name}
                              asChild
                              isActive={location.pathname === subItem.href}
                              className="py-2 px-5 flex items-center gap-2 my-1"
                            >
                              <Link to={subItem.href}>
                                <subItem.icon className="size-4" />
                                {subItem.name}
                              </Link>
                            </SidebarMenuButton>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.href}
                      className="p-5"
                    >
                      <Link to={item.href}>
                        {item?.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-6 h-6"
                          />
                        ) : (
                          // @ts-ignore
                          <item.icon className="size-5" />
                        )}{" "}
                        {item.name}
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <div className="flex-1 w-full">
          <header className="sticky top-0 z-1 flex w-full h-16 items-center gap-4 border-b bg-white dark:bg-black px-6">
            <SidebarTrigger />
            <div className="ml-auto flex items-center gap-4">
              {/* <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button> */}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <img
                    src="/BlankPerson.webp"
                    className="rounded-full size-8 cursor-pointer"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={() => navigate("/ProfileDashboard  ")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOpenSettings(true)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </DropdownMenuContent>
              </DropdownMenu>{" "}
            </div>
            <Dialog open={openSettings} onOpenChange={setOpenSettings}>
              <DialogContent className="max-w-md dark:border dark:border-white">
                <DialogHeader>
                  <DialogTitle>Settings</DialogTitle>
                  <DialogDescription>
                    Manage your account preferences
                  </DialogDescription>
                </DialogHeader>
                <div className="p-4">
                  {/* Dark Mode Toggle Inside Settings */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Dark Mode</p>
                    <Switch
                      checked={theme === "dark"}
                      onCheckedChange={(checked) =>
                        setTheme(checked ? "dark" : "light")
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center justify-between gap-5">
                  <Button className="text-sm font-medium w-full mt-4">
                    Help
                  </Button>

                  <DialogClose asChild>
                    <Button variant="outline" className="w-full">
                      Close
                    </Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          </header>
          <main className="flex-1 p-6 dark:bg-[#000000] bg-[#f7f9fa]">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
