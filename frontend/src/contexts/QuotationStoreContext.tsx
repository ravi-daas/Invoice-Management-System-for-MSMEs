import { createQuotation, deleteQuotation, updateQuotationById } from "@/apis/quotations";
import { QuotationData } from "@/types";
import { createContext, useState, useContext, ReactNode } from "react";

// Define Context Type
type QuotationsContextType = {
  quotations: QuotationData[];
  selectedQuotation: QuotationData | null;
  addQuotation: (quotation: QuotationData) => void;
  updateQuotation: (
    quotationNo: string,
    updatedQuotation: QuotationData
  ) => void;
  removeQuotation: (quotationNo: string, quotationId: string) => void;
  addQuotations: (quotations: QuotationData[]) => void;
  selectQuotation: (quotationNo: string) => void;
  clearSelectedQuotation: () => void;
};

// Create Context
const QuotationsContext = createContext<QuotationsContextType | undefined>(
  undefined
);

// Provider Component
export const QuotationsProvider = ({ children }: { children: ReactNode }) => {
  const [quotations, setQuotations] = useState<QuotationData[]>([]);
  const [selectedQuotation, setSelectedQuotation] =
    useState<QuotationData | null>(null);

  // Function to add a new quotation
  const addQuotation = (quotation: QuotationData) => {
    createQuotation(quotation);
    setQuotations((prevQuotations) => [...prevQuotations, quotation]);
  };

  // Function to add multiple quotations
  const addQuotations = (newQuotations: QuotationData[]) => {
    setQuotations(newQuotations);
  };

  // Function to update an existing quotation
  const updateQuotation = (
    quotationNo: string,
    updatedQuotation: QuotationData
  ) => {
    updateQuotationById(quotationNo, updatedQuotation);
    setQuotations((prevQuotations) =>
      prevQuotations.map((quotation) =>
        quotation.quotationNo === quotationNo ? updatedQuotation : quotation
      )
    );
  };

  // Function to remove a quotation
  const removeQuotation = (quotationNo: string, quotationId: string) => {
    deleteQuotation(quotationId);
    setQuotations((prevQuotations) =>
      prevQuotations.filter(
        (quotation) => quotation.quotationNo !== quotationNo
      )
    );

    // If the selected quotation is deleted, clear it
    if (selectedQuotation?.quotationNo === quotationNo) {
      setSelectedQuotation(null);
    }
  };

  // Function to select a quotation
  const selectQuotation = (quotationNo: string) => {
    const quotation = quotations.find((q) => q.quotationNo === quotationNo);
    setSelectedQuotation(quotation || null);
  };

  // Function to clear the selected quotation
  const clearSelectedQuotation = () => {
    setSelectedQuotation(null);
  };

  return (
    <QuotationsContext.Provider
      value={{
        quotations,
        selectedQuotation,
        addQuotation,
        updateQuotation,
        removeQuotation,
        addQuotations,
        selectQuotation,
        clearSelectedQuotation,
      }}
    >
      {children}
    </QuotationsContext.Provider>
  );
};

// Custom Hook for Using Quotations Context
export const useQuotations = () => {
  const context = useContext(QuotationsContext);
  if (!context) {
    throw new Error("useQuotations must be used within a QuotationsProvider");
  }
  return context;
};
