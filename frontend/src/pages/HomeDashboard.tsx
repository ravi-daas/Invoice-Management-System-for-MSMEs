import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export function HomeDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 p-6 mx-12">
      {/* <Invoice /> */}
      <div>
        <h1 className="text-3xl font-bold text-[#67338a] dark:text-[#bb6cef]">
          Getting Started
        </h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-bold text-[#67338a] dark:text-[#bb6cef]">
              Invoice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">
              Generate, manage, and send invoices to streamline your billing
              process efficiently.
            </p>
            <div
              className="aspect-video rounded-lg bg-muted relative"
              style={{
                backgroundImage: "url('/InvoiceImage.jpeg')",
                backgroundSize: "cover",
                backgroundPosition: "top",
              }}
            >
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/80 to-transparent" />
              <div className="absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-white/80 to-transparent" />
              <div className="absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-white/80 to-transparent" />{" "}
            </div>{" "}
            <Button
              className="w-full hover:bg-[#9b79b3] hover:text-white"
              variant="outline"
              onClick={() => navigate("/InvoiceDashboard/CreateInvoiceGST")}
            >
              <Plus className="mr-2 size-4" />
              Create New Invoice
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-bold text-[#67338a] dark:text-[#bb6cef]">
              Quotation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">
              Quickly create and send professional quotations to potential
              clients.
            </p>
            <div
              className="aspect-video rounded-lg bg-muted relative"
              style={{
                backgroundImage: "url('/QuotationImage.png')",
                backgroundSize: "cover",
                backgroundPosition: "top",
              }}
            >
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/80 to-transparent" />
              <div className="absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-white/80 to-transparent" />
              <div className="absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-white/80 to-transparent" />{" "}
            </div>{" "}
            <Button
              className="w-full hover:bg-[#9b79b3] hover:text-white"
              variant="outline"
              onClick={() => navigate("/QuotationDashboard/CreateQuotation")}
            >
              <Plus className="mr-2 size-4" />
              Create New Quotation
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-bold text-[#67338a] dark:text-[#bb6cef]">
              Inventory
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">
              Keep track of your inventory levels, stock, and purchases
              efficiently.
            </p>
            <div
              className="aspect-video rounded-lg bg-muted relative"
              style={{
                backgroundImage: "url('/InventoryImage.webp')",
                backgroundSize: "cover",
                backgroundPosition: "top",
              }}
            >
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/80 to-transparent" />
              <div className="absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-white/80 to-transparent" />
              <div className="absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-white/80 to-transparent" />{" "}
            </div>{" "}
            <Button
              className="w-full hover:bg-[#9b79b3] hover:text-white"
              variant="outline"
              onClick={() => navigate("/InventoryDashboard")}
            >
              <Plus className="mr-2 size-4" />
              Add New Item
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="font-bold text-[#67338a] dark:text-[#bb6cef]">
              Clients
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">
              Manage your client database and maintain customer relationships.
            </p>
            <div
              className="aspect-video rounded-lg bg-muted relative"
              style={{
                backgroundImage: "url('/ClientsPage.webp')",
                backgroundSize: "cover",
                backgroundPosition: "top",
              }}
            >
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/80 to-transparent" />
              <div className="absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-white/80 to-transparent" />
              <div className="absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-white/80 to-transparent" />{" "}
            </div>{" "}
            <Button
              className="w-full hover:bg-[#9b79b3] hover:text-white"
              variant="outline"
              onClick={() => navigate("/ClientDashboard/CreateClient")}
            >
              <Plus className="mr-2 size-4" />
              Add New Client
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
