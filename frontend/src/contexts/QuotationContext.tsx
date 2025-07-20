import { QuotationData } from "@/types";
import React, { createContext, useState, useContext, ReactNode } from "react";
// Define Context Type
type QuotationContextType = {
  quotationData: QuotationData | null;
  setQuotationData: (data: QuotationData) => void;
};

// Create Context
const QuotationContext = createContext<QuotationContextType | undefined>(
  undefined
);

// Provider Component
export const QuotationProvider = ({ children }: { children: ReactNode }) => {
  const [quotationData, setQuotationData] = useState<QuotationData | null>(null);

  return (
    <QuotationContext.Provider value={{ quotationData, setQuotationData }}>
      {children}
    </QuotationContext.Provider>
  );
};

// Custom Hook for Using Quotation Context
export const useQuotation = () => {
  const context = useContext(QuotationContext);
  if (!context) {
    throw new Error("useQuotation must be used within an QuotationProvider");
  }
  return context;
};
