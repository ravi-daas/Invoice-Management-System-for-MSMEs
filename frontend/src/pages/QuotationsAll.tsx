
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, ExternalLink, Trash, CheckCircle } from "lucide-react";
import { useQuotation } from "@/contexts/QuotationContext";
import { useNavigate } from "react-router-dom";
import { useQuotations } from "@/contexts/QuotationStoreContext";
import { QuotationData } from "@/types";
import { getCurrencySymbol } from "@/utils/methods";
import { useEffect } from "react";
import { fetchQuotations } from "@/apis/quotations";

export default function AllQuotationsPage() {
  const {
    quotations,
    removeQuotation,
    updateQuotation,
    addQuotations,
    selectQuotation,
  } = useQuotations();
  const { setQuotationData } = useQuotation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllQuotations = async () => {
      try {
        const quotations = await fetchQuotations();
        console.log(quotations);
        addQuotations(quotations);
      } catch (error) {
        console.error("Error fetching quotations: ", error);
      }
    };
    fetchAllQuotations();
  }, []);

  const handleQuotationClick = (quotation: QuotationData) => {
    setQuotationData(quotation);
    navigate("/QuotationDashboard/Quotation");
  };

  const handleModifyQuotation = (quotation: QuotationData) => {
    setQuotationData(quotation);
    selectQuotation(quotation.quotationNo);
    navigate("/QuotationDashboard/ModifyQuotation");
  };

  const handleDeleteQuotation = (quotation: QuotationData) => {
    removeQuotation(quotation.quotationNo, quotation?.id || "");
  };

  const handleQuotationPaid = (quotation: QuotationData) => {
    updateQuotation(quotation.quotationNo, { ...quotation, paid: true });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Quotations</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Date#</TableHead>
            <TableHead className="text-left">Quotation#</TableHead>
            <TableHead className="text-left">Billed To</TableHead>
            <TableHead className="text-left">Client Type</TableHead>
            <TableHead className="text-left">Amount</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotations.length > 0 ? (
            quotations.map((quotation) => (
              <TableRow key={quotation.quotationNo}>
                <TableCell className="text-left">
                  {new Date(quotation.quotationDate).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    }
                  )}
                </TableCell>
                <TableCell className="text-left">
                  {quotation.quotationNo}
                </TableCell>
                <TableCell className="text-left">
                  {quotation.billedTo.businessName}
                </TableCell>
                <TableCell className="text-left">
                  {quotation.billedTo.type}
                </TableCell>
                <TableCell className="text-left">
                  {getCurrencySymbol(quotation.currency)}
                  {quotation.total.toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  {!quotation.paid ? (
                    <>
                      <Badge
                        variant="outline"
                        className="bg-yellow-200 text-yellow-800"
                      >
                        Unpaid
                      </Badge>
                      <span className="text-sm text-gray-500 block">
                        Due on{" "}
                        {new Date(quotation.dueDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-green-200 text-green-600"
                    >
                      Paid
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuotationClick(quotation)}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleModifyQuotation(quotation)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuotationPaid(quotation)}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteQuotation(quotation)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                No Quotations Created!!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
