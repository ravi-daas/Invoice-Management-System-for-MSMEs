import { InvoiceData } from "@/types";
import { createContext, useState, useContext, ReactNode } from "react";

// Define Context Type
type InvoiceContextType = {
  invoiceData: InvoiceData | null;
  setInvoiceData: (data: InvoiceData) => void;
};

// Create Context
const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

// Provider Component
export const InvoiceProvider = ({ children }: { children: ReactNode }) => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

  return (
    <InvoiceContext.Provider value={{ invoiceData, setInvoiceData }}>
      {children}
    </InvoiceContext.Provider>
  );
};

// Custom Hook for Using Invoice Context
export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error("useInvoice must be used within an InvoiceProvider");
  }
  return context;
};
