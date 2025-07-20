import { useEffect, useState } from "react";
import {
  Calendar,
  Edit,
  ImageIcon,
  Plus,
  Upload,
  X,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInvoice } from "@/contexts/InvoiceContext";
import { useNavigate } from "react-router-dom";
import EditBilledBy from "@/components/Popups/EditBilledBy";
import GSTPopup from "@/components/Popups/AddGST";
import { useInvoices } from "@/contexts/InvoicesStoreContext";
import { ClientData, InvoiceData, InvoiceItem } from "@/types";
import { invoiceSchemaRetail } from "@/schemas/schema";
import AddClientModal from "@/components/Popups/AddClient";
import { getCurrencySymbol } from "@/utils/methods";

export default function InvoiceFormRetail() {
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [paymentMode, setPaymentMode] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("A00001");
  const [dueDate, setDueDate] = useState("2025-03-10");
  const [logo, setLogo] = useState<string | null>(null);
  const [openAddClientPopup, setOpenAddClientPopup] = useState(false);
  const [openEditBilledBy, setOpenEditBilledBy] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [showSignatureUpload, setSignatureShowUpload] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [currency, setCurrency] = useState("inr");
  const [businesses, setBusinesses] = useState<ClientData[]>([
    {
      type: "Organization",
      businessName: "Mahindra & Mahindra",
      address: "Chakan Industrial Area, Pune - 410501",
      gstIn: "27AAECR2973J1Z5",
      taxId: "874562319",
    },
  ]);
  const [openAddGST, setOpenAddGST] = useState(false);
  const [gstType, setGstType] = useState("");
  const { addInvoice, invoices } = useInvoices();

  const { setInvoiceData } = useInvoice();
  const navigate = useNavigate();

  const handleSignatureFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSignature(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleOpenGST = () => {
    setOpenAddGST((prev) => !prev);
  };

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      invoiceId: "1",
      id: "1",
      name: "",
      quantity: 1,
      rate: 1,
      amount: 1.0,
      sgstRate: 0,
      cgstRate: 0,
      igstRate: 0,
      gstRate: 0,
      hsnCode: "",
    },
  ]);

  const [clients, setClients] = useState<ClientData[]>([
    {
      type: "Organization",
      businessName: "Bajaj Finserv",
      industry: "Finance",
      address: "asd",
      gstIn: "06BZAPK6587L1Z3",
      taxId: "562987431",
    },
  ]);

  const addNewItem = () => {
    setItems((prevItems) => [
      ...prevItems,
      {
        invoiceId: "",
        id: "1",
        name: "",
        quantity: 1,
        rate: 1,
        amount: 1.0,
        sgstRate: 0,
        cgstRate: 0,
        igstRate: 0,
        gstRate: 0,
        hsnCode: "",
      },
    ]);
  };

  const handleAddClient = (clientData: ClientData): void => {
    setClients((prevClients) => [...prevClients, clientData]);
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a PNG or JPEG image.");
    }
  };

  const removeImage = () => setLogo(null);

  const calculateAmount = (quantity: number, rate: number) => {
    return Number((quantity * rate).toFixed(2));
  };

  const toggleEditBilledBy = () => {
    setOpenEditBilledBy(!openEditBilledBy);
  };

  const updateItem = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          if (field === "quantity" || field === "rate") {
            updatedItem.amount = calculateAmount(
              field === "quantity" ? Number(value) : item.quantity,
              field === "rate" ? Number(value) : item.rate
            );
          }

          let baseAmount = calculateAmount(
            updatedItem.quantity,
            updatedItem.rate
          );

          const gstAmount = (baseAmount * updatedItem.gstRate) / 100;
          if (gstType === "CGST_SGST") {
            updatedItem.cgstRate = gstAmount / 2;
            updatedItem.sgstRate = gstAmount / 2;
            updatedItem.amount =
              baseAmount + updatedItem.cgstRate + updatedItem.sgstRate;
          } else if (gstType === "IGST") {
            updatedItem.igstRate = gstAmount;
            updatedItem.amount = baseAmount + updatedItem.igstRate;
          } else {
            updatedItem.amount = baseAmount;
          }

          return updatedItem;
        }
        return item;
      })
    );
  };

  const generateInvoiceNumber = (lastInvoice: any, itemsLength: any) => {
    const prefix = lastInvoice.slice(0, 1); // Extract the "A" prefix
    const numberPart = parseInt(lastInvoice.slice(1), 10); // Extract number and convert to integer

    const nextNumber = numberPart + itemsLength; // Increment based on items length
    const nextInvoiceNumber = `${prefix}${String(nextNumber).padStart(5, "0")}`; // Format with leading zeros

    return nextInvoiceNumber;
  };

  useEffect(() => {
    const lastInvoice = invoices[invoices.length - 1]?.invoiceNo || "A00000";
    const nextInvoiceNumber = generateInvoiceNumber(lastInvoice, items.length);
    setInvoiceNumber(nextInvoiceNumber);
  }, []);

  const currentTime = new Date().toLocaleTimeString();

  const handleSaveAndContinue = () => {
    if (paymentMode === "") {
      alert("Please enter payment mode.");
      return;
    }

    if (phoneNo === "") {
      alert("Please enter phone number.");
      return;
    }

    const formData = {
      invoiceNumber: (
        document.getElementById("invoice-no") as HTMLInputElement
      )?.value.trim(),
      selectedClient: Array.isArray(selectedClient)
        ? selectedClient
        : [selectedClient],
      items: items.map((item) => ({ name: item.name.trim() })),
    };

    const validationResult = invoiceSchemaRetail.safeParse(formData);

    if (!validationResult.success) {
      alert(validationResult.error.errors.map((err) => err.message).join("\n"));
      return;
    }

    const data: InvoiceData = {
      invoiceNo: (
        document.getElementById("invoice-no") as HTMLInputElement
      )?.value.trim(),
      invoiceDate: invoiceDate,
      dueDate: dueDate,
      phoneNo: phoneNo,
      termOfPayment: paymentMode,
      invoiceTime: currentTime,
      billedBy: {
        type: "Organization",
        businessName: businesses[0]?.businessName || "",
        gstIn: "",
        address: businesses[0]?.address || "",
        taxId: "",
      },
      billedTo: {
        type: "Individual",
        businessName: "",
        address: "",
        gstIn: "",
        taxId: "",
      },
      gstType: gstType,
      currencySymbol: getCurrencySymbol(currency),
      currency: currency,
      items: items.map((item) => ({
        id: item.id,
        invoiceId: item.invoiceId,
        name: item.name.trim(),
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount,
        sgstRate: 0,
        cgstRate: 0,
        igstRate: 0,
        gstRate: 0,
        hsnCode: "",
      })),
      totalSGST: 0,
      totalCGST: 0,
      totalIGST: 0,
      total: items.reduce((sum, item) => sum + item.amount, 0),
      taxableAmount: 0,
      totalTax: 0,
      paid: false,
    };

    setInvoiceData(data);
    addInvoice(data);
    console.log(data);
    navigate("/InvoiceDashboard/InvoiceRetail");
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fa] dark:bg-black p-6 relative">
      <div className="mx-auto max-w-5xl space-y-8  border border-gray-200 rounded-lg p-4 bg-white dark:bg-black">
        {/* Header */}
        <div className="space-y-2 flex flex-col items-center justify-center align-middle">
          <h1 className="text-3xl font-semibold text-[#67338a] dark:text-[#bb6cef]">
            Retail Invoice
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="invoice-no">Invoice No*</Label>
                <Input id="invoice-no" value={invoiceNumber} disabled />
              </div>

              <div>
                <Label htmlFor="invoice-date">Invoice Date*</Label>
                <div className="relative">
                  <Input
                    id="invoice-date"
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                  />
                  <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-500" />
                </div>
              </div>
              <div>
                <Label htmlFor="invoice-date">Payment Mode*</Label>
                <div className="relative">
                  <Input
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    placeholder="Payment Mode"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="invoice-date">Phone Number*</Label>
                <div className="relative">
                  <Input
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value)}
                    placeholder="Phone Number"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {/* Billed To Section */}
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-semibold">Seller</h2>
                <span className="text-sm text-muted-foreground">
                  Your Details
                </span>
              </div>

              <Select defaultValue="nayan">
                <SelectTrigger>
                  <SelectValue placeholder="Select business" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nayan">Saumya Bansal</SelectItem>
                </SelectContent>
              </Select>

              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Business details</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#67338a] dark:text-[#bb6cef]"
                      onClick={() => toggleEditBilledBy()}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <p>
                      <span className="text-muted-foreground">
                        Business Name:
                      </span>{" "}
                      {businesses[0].businessName}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Address:</span>{" "}
                      {businesses[0].address}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        {/* Bottom Controls */}
        <div className="flex items-end gap-4 pt-4 justify-start">
          <div className="w-96">
            <Label>Currency*</Label>
            <Select defaultValue="inr" onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inr">Indian Rupee (INR, ₹)</SelectItem>
                <SelectItem value="usd">US Dollar (USD, $)</SelectItem>
                <SelectItem value="eur">Euro (EUR, €)</SelectItem>
                <SelectItem value="gbp">British Pound (GBP, £)</SelectItem>
                <SelectItem value="jpy">Japanese Yen (JPY, ¥)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedClient?.type === "Organization" && (
            <Button variant="outline" className="w-96" onClick={toggleOpenGST}>
              Add GST
            </Button>
          )}
        </div>
        <div className={`flex gap-4 bg-[#67338a]  text-white p-4 rounded-t-lg`}>
          <div className="flex-1 text-center">Item</div>
          <div className="flex-1 text-center">Quantity</div>
          <div className="flex-1 text-center">Rate</div>
          <div className="flex-1 text-center">Total Amount</div>
        </div>

        {items.map((item) => (
          <div className=" flex flex-col bg-purple-50 dark:bg-black dark:border dark:border-white dark:rounded p-2">
            <div
              key={item.id}
              className="flex gap-4 bg-purple-50 p-4 dark:bg-black rounded-lg"
            >
              <div className="flex-1">
                <Input
                  placeholder="Name/SKU Id (Required)"
                  value={item.name}
                  onChange={(e) => updateItem(item.id, "name", e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(item.id, "quantity", e.target.value)
                  }
                  className="text-start"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  value={item.rate}
                  onChange={(e) => updateItem(item.id, "rate", e.target.value)}
                  className="text-start"
                  prefix={getCurrencySymbol(currency)}
                />
              </div>
              <div className="flex-1 flex  justify-between items-center">
                <div className="text-center flex-1">
                  {getCurrencySymbol(currency)}
                  {item.amount.toFixed(2)}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 "
                  onClick={() => removeItem(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                className="text-[#67338a] dark:text-[#bb6cef]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Description
              </Button>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          className="border-dashed border-blue-200"
          onClick={addNewItem}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Line
        </Button>

        <div className=" flex flex-col ">
          <div className="flex justify-end gap-10 items-center pt-4">
            <div className="text-lg font-semibold">
              Total{" "}
              <span className="text-gray-500">({currency.toUpperCase()})</span>
            </div>
            <div className="text-lg font-semibold">
              {getCurrencySymbol(currency)}
              {items.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {!signature ? (
            <>
              <Button
                variant="outline"
                className="w-full border-dashed border-blue-200"
                onClick={() => setSignatureShowUpload(!showSignatureUpload)}
              >
                Add Signature
              </Button>

              {showSignatureUpload && (
                <div className="border border-blue-200 p-4 rounded-lg">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSignatureFileChange}
                    className="hidden"
                    id="signatureUpload"
                  />
                  <label
                    htmlFor="signatureUpload"
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-blue-300 rounded-md bg-purple-50 hover:bg-purple-100 transition"
                  >
                    <Upload className="w-4 h-4 text-gray-500" />
                    Upload Signature
                  </label>
                </div>
              )}
            </>
          ) : (
            <div className="border border-blue-300 p-4 rounded-lg flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-2">Uploaded Signature:</p>
              <img
                src={signature}
                alt="Signature"
                className="h-20 object-contain"
              />
              <Button
                variant="destructive"
                className="mt-2"
                onClick={() => {
                  setSignature(null);
                  setSignatureShowUpload(false);
                }}
              >
                Remove Signature
              </Button>
            </div>
          )}
        </div>
        <Button
          onClick={handleSaveAndContinue}
          className="w-full bg-[#67338a] hover:bg-[#532671] dark:text-white text-white"
        >
          Save and Continue
        </Button>
      </div>

      {openAddClientPopup && (
        <AddClientModal
          type="Individual"
          setOpen={setOpenAddClientPopup}
          open={openAddClientPopup}
          handleAddClient={handleAddClient}
        />
      )}
      {openEditBilledBy && (
        <EditBilledBy
          toggleEditBilledBy={toggleEditBilledBy}
          businesses={businesses}
          setBusinesses={setBusinesses}
        />
      )}
      {openAddGST && (
        <GSTPopup
          toggleOpenGST={toggleOpenGST}
          gstType={gstType}
          setGstType={setGstType}
        />
      )}
    </div>
  );
}
