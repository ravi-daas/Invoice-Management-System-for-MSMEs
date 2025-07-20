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
import { Pencil, CheckCircle, ExternalLink, Trash } from "lucide-react";
import { useInvoices } from "@/contexts/InvoicesStoreContext";
import { useInvoice } from "@/contexts/InvoiceContext";
import { useNavigate } from "react-router-dom";
import { InvoiceData } from "@/types";
import { useEffect } from "react";
import { fetchInvoices } from "@/apis/invoices";
import { getCurrencySymbol } from "@/utils/methods";

export default function AllInvoicesPage() {
  const { invoices, updateInvoice, removeInvoice, selectInvoice, addInvoices } =
    useInvoices();
  const { setInvoiceData } = useInvoice();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllInvoices = async () => {
      try {
        const invoices = await fetchInvoices();
        console.log("Fetched Invoices: ", invoices);
        addInvoices(invoices);
      } catch (error) {
        console.error("Error fetching invoices: ", error);
      }
    };
    fetchAllInvoices();
  }, []);

  const handleInvoiceClick = (invoice: InvoiceData) => {
    setInvoiceData(invoice);
    if (invoice.billedTo.type === "Organization") {
      navigate("/InvoiceDashboard/InvoiceGST");
    } else {
      navigate("/InvoiceDashboard/InvoiceRetail");
    }
  };

  const handleModifyInvoice = (invoice: InvoiceData) => {
    setInvoiceData(invoice);
    selectInvoice(invoice.invoiceNo);
    if (invoice.billedTo.type === "Individual") {
      navigate("/InvoiceDashboard/ModifyInvoiceRetail");
    } else {
      navigate("/InvoiceDashboard/ModifyInvoiceGST");
    }
  };

  const handleInvoicePaid = (invoice: InvoiceData) => {
    updateInvoice(invoice.invoiceNo, { ...invoice, paid: true });
  };

  const handleDeleteInvoice = (invoice: InvoiceData) => {
    removeInvoice(invoice.invoiceNo, invoice?.id || "");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Invoices</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Date#</TableHead>
            <TableHead className="text-left">Invoice#</TableHead>
            <TableHead className="text-left">Type</TableHead>
            <TableHead className="text-left">Amount</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices && invoices.length > 0 ? (
            invoices.map((invoice) => (
              <TableRow key={invoice.invoiceNo}>
                <TableCell className="text-left">
                  {new Date(invoice.invoiceDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-left">{invoice.invoiceNo}</TableCell>
                <TableCell className="text-left">
                  {invoice.billedTo.type === "Individual" ? "Retail" : "GST"}
                </TableCell>
                <TableCell className="text-left">
                  {getCurrencySymbol(invoice.currency)}
                  {invoice.total.toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  {!invoice.paid ? (
                    <>
                      <Badge
                        variant="outline"
                        className="bg-yellow-200 text-yellow-800"
                      >
                        Unpaid
                      </Badge>
                      <span className="text-sm text-gray-500 block">
                        Due on{" "}
                        {new Date(invoice.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}
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
                    onClick={() => handleInvoiceClick(invoice)}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleModifyInvoice(invoice)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleInvoicePaid(invoice)}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteInvoice(invoice)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                No Invoices Created !!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
