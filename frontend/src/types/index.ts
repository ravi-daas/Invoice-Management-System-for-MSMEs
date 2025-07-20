export type InvoiceItem = {
  id: string;
  invoiceId: string;
  name: string;
  quantity: number;
  rate: number;
  amount: number;
  gstRate: number;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  hsnCode: string | null;
};

export type InvoiceData = {
  id?: string;
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  invoiceTime?: string;
  termOfPayment?: string;
  phoneNo?: string;
  RefNo?: string;
  OtherRef?: string;
  DispatchDocNo?: string;
  deliveryNoteDate?: string;
  deliveryNote?: string;
  deliveryDate?: string;
  DispatchedThrough?: string;
  Destination?: string;
  BuyerOrderNo?: string;
  billedBy: {
    type: "Individual" | "Organization";
    businessName: string;
    industry?: string;
    address?: string;
    logo?: string;
    taxId?: string;
    gstIn?: string;
  };
  billedTo: {
    type: "Individual" | "Organization";
    businessName: string;
    industry?: string;
    address?: string;
    logo?: string;
    taxId?: string;
    gstIn?: string;
  };
  items: InvoiceItem[];
  gstType: string;
  currencySymbol: string;
  currency: string;
  totalSGST: number;
  totalCGST: number;
  totalIGST: number;
  total: number;
  taxableAmount: number;
  totalTax: number;
  paid: boolean;
};

export type ClientData = {
  id?: string;
  type: "Individual" | "Organization";
  businessName: string;
  industry?: string;
  address?: string;
  logo?: string;
  taxId?: string;
  gstIn?: string;
};

export type QuotationItem = {
  id: string;
  quotationId: string;
  name: string;
  quantity: number;
  rate: number;
  amount: number;
  gstRate: number;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  hsnCode: string | null;
};

export type QuotationData = {
  id?: string;
  quotationNo: string;
  quotationDate: string;
  dueDate: string;
  billedBy: {
    id?: string;
    type: "Individual" | "Organization";
    businessName: string;
    industry?: string;
    address?: string;
    logo?: string;
    taxId?: string;
    gstIn?: string;
  };
  billedTo: {
    id?: string;
    type: "Individual" | "Organization";
    businessName: string;
    industry?: string;
    address?: string;
    logo?: string;
    taxId?: string;
    gstIn?: string;
  };
  items: QuotationItem[];
  gstType: string;
  currencySymbol: string;
  currency: string;
  totalSGST: number;
  totalCGST: number;
  totalIGST: number;
  total: number;
  taxableAmount: number;
  totalTax: number;
  paid: boolean;
};

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  price: number;
  status: string;
  hsnCode: string;
}

export interface InventoryState {
  totalProducts: number;
  lowStockItems: number;
  outOfStockItems: number;
  products: Product[];
}

export type Profile = {
  fullName: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  bio?: string;
  profileImage: string;
};

export type GSTData = {
  id?: string;
  gstNumber: string;
  companyName: string;
  address: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
};

export type GSTRequest = {
  sessionId: string;
  GSTIN: string;
  captcha: string;
};
