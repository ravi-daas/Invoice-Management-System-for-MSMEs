import {
  createInvoice,
  deleteInvoice,
  updateInvoiceById,
} from "@/apis/invoices";
import { InvoiceData } from "@/types";
import { createContext, useState, useContext, ReactNode } from "react";

// Define Context Type
type InvoicesContextType = {
  invoices: InvoiceData[];
  selectedInvoice: InvoiceData | null;
  addInvoice: (invoice: InvoiceData) => void;
  addInvoices: (invoices: InvoiceData[]) => void;
  updateInvoice: (invoiceNo: string, updatedInvoice: InvoiceData) => void;
  removeInvoice: (invoiceNo: string, invoiceId: string) => void;
  selectInvoice: (invoiceNo: string) => void;
  clearSelectedInvoice: () => void;
};

// Create Context
const InvoicesContext = createContext<InvoicesContextType | undefined>(
  undefined
);

// Provider Component
export const InvoicesProvider = ({ children }: { children: ReactNode }) => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(
    null
  );

  // Function to add a new invoice
  const addInvoice = (invoice: InvoiceData) => {
    createInvoice(invoice);
    setInvoices((prevInvoices) => [...prevInvoices, invoice]);
  };

  // Function to add multiple invoices
  const addInvoices = (newInvoices: InvoiceData[]) => {
    setInvoices(newInvoices);
  };

  // Function to update an existing invoice
  const updateInvoice = (invoiceNo: string, updatedInvoice: InvoiceData) => {
    console.log("Updated Invoice: ", updatedInvoice);
    
    updateInvoiceById(updatedInvoice?.id || "", updatedInvoice);
    setInvoices((prevInvoices) =>
      prevInvoices.map((invoice) =>
        invoice.invoiceNo === invoiceNo ? updatedInvoice : invoice
      )
    );
  };

  // Function to remove an invoice
  const removeInvoice = (invoiceNo: string, invoiceId: string) => {
    deleteInvoice(invoiceId);
    setInvoices((prevInvoices) =>
      prevInvoices.filter((invoice) => invoice.invoiceNo !== invoiceNo)
    );

    // If the selected invoice is deleted, clear it
    if (selectedInvoice?.invoiceNo === invoiceNo) {
      setSelectedInvoice(null);
    }
  };

  // Function to select an invoice
  const selectInvoice = (invoiceNo: string) => {
    const invoice = invoices.find((inv) => inv.invoiceNo === invoiceNo);
    setSelectedInvoice(invoice || null);
  };

  // Function to clear the selected invoice
  const clearSelectedInvoice = () => {
    setSelectedInvoice(null);
  };

  return (
    <InvoicesContext.Provider
      value={{
        invoices,
        selectedInvoice,
        addInvoice,
        addInvoices,
        updateInvoice,
        removeInvoice,
        selectInvoice,
        clearSelectedInvoice,
      }}
    >
      {children}
    </InvoicesContext.Provider>
  );
};

// Custom Hook for Using Invoices Context
export const useInvoices = () => {
  const context = useContext(InvoicesContext);
  if (!context) {
    throw new Error("useInvoices must be used within an InvoicesProvider");
  }
  return context;
};
