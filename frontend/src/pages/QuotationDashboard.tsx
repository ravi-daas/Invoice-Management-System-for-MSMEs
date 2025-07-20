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
import { useNavigate } from "react-router-dom";
import { useQuotation } from "@/contexts/QuotationContext";
import GSTPopup from "@/components/Popups/AddGST";
import EditBilledBy from "@/components/Popups/EditBilledBy";
import { useQuotations } from "@/contexts/QuotationStoreContext";
import { ClientData, QuotationData, QuotationItem } from "@/types";
import { quotationSchema } from "@/schemas/schema";
import AddClientModal from "@/components/Popups/AddClient";
import { getCurrencySymbol } from "@/utils/methods";
import { fetchClients } from "@/apis/clients";
import { getHSNCodeData } from "@/apis/hsn";

export default function QuotationForm() {
  const [quotationDate, setquotationDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [quatationNo, setQuatationNo] = useState("A000001");
  const [dueDate, setDueDate] = useState("2025-03-10");
  const [logo, setLogo] = useState<string | null>(null);
  const [openAddClientPopup, setOpenAddClientPopup] = useState(false);
  const { addQuotation, quotations } = useQuotations();
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [showSignatureUpload, setSignatureShowUpload] = useState(false);
  const [openEditBilledBy, setOpenEditBilledBy] = useState(false);
  const [openAddGST, setOpenAddGST] = useState(false);
  const [gstType, setGstType] = useState("");
  const [currency, setCurrency] = useState("inr");
  const [signature, setSignature] = useState<string | null>(null);
  const { setQuotationData } = useQuotation();
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<ClientData[]>([
    {
      type: "Organization",
      businessName: "Mahindra & Mahindra",
      address: "Chakan Industrial Area, Pune - 410501",
      gstIn: "27AAECR2973J1Z5",
      taxId: "874562319",
    },
  ]);
  const [hsnInput, setHsnInput] = useState<{ [key: string]: string }>({});

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

  const [items, setItems] = useState<QuotationItem[]>([
    {
      quotationId: "1",
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
      address: "India",

      gstIn: "06BZAPK6587L1Z3",
      taxId: "562987431",
    },
  ]);

  const toggleEditBilledBy = () => {
    setOpenEditBilledBy(!openEditBilledBy);
  };

  const addNewItem = () => {
    setItems((prevItems) => [
      ...prevItems,
      {
        quotationId: "",
        id: "1",
        name: "",
        quantity: 1,
        rate: 1,
        amount: 1.0,
        sgstRate: 0,
        cgstRate: 0,
        igstRate: 0,
        gstRate: 0,
        hsnCode: hsnInput["1"] || "",
      },
    ]);
  };

  const handleAddClient = (clientData: ClientData): void => {
    setClients((prevClients) => [...prevClients, clientData]);
    console.log("Added Client:", clientData);
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

  const fetchHSNData = async (item: any, hsnCode: string) => {
    if (hsnCode.length > 2) {
      try {
        const hsnData = await getHSNCodeData({ code: hsnCode });

        //@ts-ignore
        if (hsnData && hsnData.gstRate) {
          //@ts-ignore
          updateItem(item.id, "gstRate", hsnData.gstRate);
        }
      } catch (error) {
        console.error("Error fetching GST Rate:", error);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      Object.entries(hsnInput).forEach(([id, hsnCode]) => {
        fetchHSNData(
          items.find((item) => item.id === id),
          hsnCode
        );
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [hsnInput]);

  const updateItem = (
    id: string,
    field: keyof QuotationItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          if (field === "hsnCode") {
            setHsnInput((prev) => ({ ...prev, [id]: value as string })); // ✅ Store in local state
          }

          if (field === "quantity" || field === "rate") {
            updatedItem.amount = calculateAmount(
              field === "quantity" ? Number(value) : item.quantity,
              field === "rate" ? Number(value) : item.rate
            );
          }

          // Reset the amount to the base amount before adding GST
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
    const lastInvoice =
      quotations[quotations.length - 1]?.quotationNo || "A00000";
    const nextInvoiceNumber = generateInvoiceNumber(lastInvoice, items.length);
    setQuatationNo(nextInvoiceNumber);
  }, []);

  useEffect(() => {
    const fetchAllClients = async () => {
      try {
        const clients = await fetchClients();
        setClients(clients);
      } catch (error) {
        console.error("Error fetching quotations: ", error);
      }
    };
    fetchAllClients();
  }, []);

  const handleSaveAndContinue = () => {
    if (!selectedClient) {
      alert("Please select a client to continue.");
      return;
    }

    const formData = {
      quotationNumber: (
        document.getElementById("quotation-no") as HTMLInputElement
      )?.value.trim(),
      selectedClient: Array.isArray(selectedClient)
        ? selectedClient
        : [selectedClient],
      items: items.map((item) => ({ name: item.name.trim() })),
    };

    const validationResult = quotationSchema.safeParse(formData);

    if (!validationResult.success) {
      alert(validationResult.error.errors.map((err) => err.message).join("\n"));
      return;
    }


    const data: QuotationData = {
      quotationNo: (
        document.getElementById("quotation-no") as HTMLInputElement
      )?.value.trim(),
      quotationDate: quotationDate,
      dueDate: dueDate,
      billedBy: {
        type: "Organization",
        businessName: businesses[0]?.businessName || "",
        gstIn: businesses[0]?.gstIn || "",
        address: businesses[0]?.address || "",
        taxId: businesses[0]?.taxId || "",
      },
      billedTo: {
        type: selectedClient?.type,
        businessName: selectedClient?.businessName || "",
        address: selectedClient?.address || "",
        gstIn: selectedClient?.gstIn || "",
        taxId: selectedClient?.taxId || "",
      },
      items: items.map((item) => ({
        id: item.id,
        quotationId: item.quotationId,
        name: item.name.trim(),
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount,
        sgstRate: item.sgstRate,
        cgstRate: item.cgstRate,
        igstRate: item.igstRate,
        gstRate: item.gstRate,
        hsnCode: item.hsnCode,
      })),
      total: items.reduce((sum, item) => sum + item.amount, 0),
      paid: false,
      gstType: gstType,
      currencySymbol: getCurrencySymbol(currency),
      currency: currency,
      totalSGST: items.reduce((sum, item) => sum + item.sgstRate, 0),
      totalCGST: items.reduce((sum, item) => sum + item.cgstRate, 0),
      totalIGST: items.reduce((sum, item) => sum + item.igstRate, 0),
      taxableAmount: items.reduce(
        (sum, item) => sum + item.quantity * item.rate,
        0
      ),
      totalTax: items.reduce((sum, item) => {
        let baseTax = (item.quantity * item.rate * item.gstRate) / 100;
        if (gstType === "CGST_SGST") {
          return sum + baseTax;
        } else if (gstType === "IGST") {
          return sum + baseTax;
        }
        return sum;
      }, 0),
    };

    addQuotation(data);
    setQuotationData(data);
    navigate("/quotationDashboard/quotation");
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fa] dark:bg-black p-6 relative">
      <div className="mx-auto max-w-5xl space-y-8  border border-gray-200 rounded-lg p-4 bg-white dark:bg-black">
        {/* Header */}
        <div className="space-y-2 flex flex-col items-center justify-center align-middle">
          <h1 className="text-3xl font-semibold text-[#67338a]">Quotation</h1>
          {/* <Button variant="ghost" className="h-8 text-blue-500 px-0">
            <Plus className="h-4 w-4 mr-2" />
            Add Sub Title
          </Button> */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* quotation Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="quotation-no">Quotation No*</Label>
                <Input id="quotation-no" value={quatationNo} disabled />
              </div>

              <div>
                <Label htmlFor="quotation-date">Quotation Date*</Label>
                <div className="relative">
                  <Input
                    id="quotation-date"
                    type="date"
                    value={quotationDate}
                    onChange={(e) => setquotationDate(e.target.value)}
                  />
                  <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-500" />
                </div>
              </div>

              <div>
                <Label htmlFor="due-date">Due Date</Label>
                <div className="relative flex items-center">
                  <Input
                    id="due-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                  <Calendar className="absolute right-10 top-2.5 h-5 w-5 text-gray-500" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add More Fields
            </Button> */}

            {/* Billed By Section */}
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-semibold">Quotation From</h2>
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
                      className="text-[#67338a]-500"
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

              {/* <Button variant="outline" className="w-full">
                Add Shipping Details
              </Button> */}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Logo Upload */}
            <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-2 relative">
              {logo ? (
                <div className="relative">
                  <img
                    src={logo}
                    alt="Uploaded Logo"
                    className="mx-auto w-24 h-24 rounded-full object-cover"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label htmlFor="logo-upload" className="cursor-pointer">
                  <div className="mx-auto w-12 h-12 rounded-full bg-[#67338a] flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-medium">Add Business Logo</h3>
                  <p className="text-sm text-muted-foreground">
                    Resolution up to 1080×1080px.
                    <br />
                    PNG or JPEG file.
                  </p>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/png, image/jpeg"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>

            {/* Billed To Section */}
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-semibold">Buyer</h2>
                <span className="text-sm text-muted-foreground">
                  (Client's Details)
                </span>
              </div>

              <Select
                value={selectedClient?.businessName || ""}
                onValueChange={(value) => {
                  if (value === "new") {
                    setOpenAddClientPopup(true);
                  } else {
                    const client = clients.find(
                      (client) => client.businessName === value
                    );
                    setSelectedClient(client || null);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a Client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="abcd">Select a Client</SelectItem>
                  {clients.length > 0 &&
                    clients.map((client, index) => (
                      <SelectItem key={index} value={client.businessName}>
                        <div className="flex justify-between gap-64 w-full">
                          <span>{client.businessName}</span>
                          <span className="text-gray-400 text-sm">
                            {client.type}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  <SelectItem
                    value="new"
                    className="text-[#67338a] dark:text-[#bb6cef] font-medium"
                  >
                    <Plus className="h-4 w-4 mr-2 inline bg-[white] " />
                    Add New Client
                  </SelectItem>
                </SelectContent>
              </Select>

              {selectedClient == null ? (
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Select a Client/Business from list
                  </p>
                  <p className="text-sm text-muted-foreground">Or</p>
                  <Button
                    variant="secondary"
                    className="bg-[#67338a] text-white hover:bg-[#3a54ff]"
                    onClick={() => setOpenAddClientPopup(true)}
                  >
                    <Plus className="h-4 w-4 mr-2 text-white" />
                    Add New Client
                  </Button>
                </div>
              ) : (
                <div className="border rounded-lg p-4 bg-white dark:bg-black shadow-sm flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">Business details</h3>
                    <div className="mt-2 flex justify-start ">
                      <p className="text-sm text-muted-foreground w-32">
                        Business Name
                      </p>
                      <p className="text-gray-600 dark:text-white text-sm">
                        {selectedClient?.businessName}
                      </p>
                    </div>
                    <div className="mt-2 flex justify-start">
                      <p className="text-sm text-muted-foreground min-w-32">
                        Address
                      </p>
                      <p className="text-gray-600 dark:text-white text-sm">
                        {capitalizeFirstLetter(selectedClient?.address || "")}
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
          {selectedClient?.type === "Organization" && (
            <div className="flex-1 text-center">HSN Code</div>
          )}
          <div className="flex-1 text-center">Quantity</div>
          <div className="flex-1 text-center">Rate</div>
          {gstType && <div className="flex-1 text-center">GST Rate (%)</div>}
          {gstType === "CGST_SGST" && (
            <>
              <div className="flex-1 text-center">CGST</div>
              <div className="flex-1 text-center">SGST</div>
            </>
          )}
          {gstType === "IGST" && <div className="flex-1 text-center">IGST</div>}
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
              {selectedClient?.type === "Organization" && (
                <div className="flex-1">
                  <Input
                    placeholder="HSN Code"
                    value={item.hsnCode || ""}
                    onChange={(e) =>
                      updateItem(item.id, "hsnCode", e.target.value)
                    }
                  />
                </div>
              )}
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
              {gstType && (
                <div className="flex-1">
                  <Input
                    type="number"
                    value={item.gstRate}
                    placeholder="GST Rate (%)"
                    onChange={(e) =>
                      updateItem(item.id, "gstRate", e.target.value)
                    }
                    prefix={getCurrencySymbol(currency)}
                  />
                </div>
              )}
              {gstType === "CGST_SGST" && (
                <>
                  <div className="flex-1 flex justify-center items-center">
                    {getCurrencySymbol(currency)}
                    {item.sgstRate}
                  </div>
                  <div className="flex-1 flex justify-center items-center">
                    {getCurrencySymbol(currency)}
                    {item.cgstRate}
                  </div>
                </>
              )}
              {gstType === "IGST" && (
                <div className="flex-1 flex justify-center items-center">
                  {getCurrencySymbol(currency)}
                  {item.igstRate.toFixed(2)}
                </div>
              )}
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
          {gstType == "CGST_SGST" && (
            <>
              {" "}
              <div className="flex justify-end gap-10 items-center pt-4 border-t">
                <div className="text-lg font-semibold">
                  SGST{" "}
                  <span className="text-gray-500">
                    ({currency.toUpperCase()})
                  </span>
                </div>
                <div className="text-lg font-semibold">
                  {getCurrencySymbol(currency)}
                  {items
                    .reduce((sum, item) => sum + item.sgstRate, 0)
                    .toFixed(2)}
                </div>
              </div>{" "}
              <div className="flex justify-end gap-10 items-center pt-4">
                <div className="text-lg font-semibold">
                  CGST{" "}
                  <span className="text-gray-500">
                    ({currency.toUpperCase()})
                  </span>
                </div>
                <div className="text-lg font-semibold">
                  {getCurrencySymbol(currency)}
                  {items
                    .reduce((sum, item) => sum + item.cgstRate, 0)
                    .toFixed(2)}
                </div>
              </div>
            </>
          )}
          {gstType === "IGST" && (
            <div className="flex justify-end gap-10 items-center pt-4">
              <div className="text-lg font-semibold">
                IGST{" "}
                <span className="text-gray-500">
                  ({currency.toUpperCase()})
                </span>
              </div>
              <div className="text-lg font-semibold">
                {getCurrencySymbol(currency)}
                {items.reduce((sum, item) => sum + item.igstRate, 0).toFixed(2)}
              </div>
            </div>
          )}
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
          {/* <div className="flex justify-end gap-10 items-center pt-4">
            <div className="text-lg font-semibold">In Words : </div>
            <div className="text-lg font-semibold">
              {" "}
              {convertToWords(
                Math.round(items.reduce((sum, item) => sum + item.amount, 0))
              )}
            </div>{" "}
          </div> */}
        </div>

        {/* Footer Actions */}
        <div className="space-y-2">
          {/* <Button
            variant="ghost"
            className="text-blue-600 w-full justify-start"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add More Fields
          </Button> */}
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
          className="w-full bg-[#67338a] hover:bg-[#3752ff] text-white"
        >
          Save and Continue
        </Button>
      </div>

      {openAddClientPopup && (
        <AddClientModal
          type="Organization"
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
