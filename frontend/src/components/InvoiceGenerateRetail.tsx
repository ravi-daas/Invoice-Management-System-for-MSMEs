import { InvoiceData } from "@/types";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { forwardRef, Ref, useImperativeHandle, useRef } from "react";

interface InvoiceProps {
  data: InvoiceData;
}

export interface InvoiceComponent {
  downloadPDF: () => void;
}

const InvoiceGenerateRetail = forwardRef<InvoiceComponent, InvoiceProps>(
  ({ data }, ref: Ref<InvoiceComponent>) => {
    const invoiceRef = useRef<HTMLDivElement>(null);

    const generatePDF = () => {
      console.log("Generating PDF");

      const input = invoiceRef.current;
      if (!input) return;

      html2canvas(input, {
        scale: 3, 
        useCORS: true, 
        backgroundColor: "#ffffff", 
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const receiptWidth = 58; 
        const receiptHeight = (canvas.height * receiptWidth) / canvas.width;
        const pdf = new jsPDF({
          orientation: "p",
          unit: "mm",
          format: [receiptWidth, receiptHeight], 
        });

        pdf.addImage(imgData, "PNG", 0, 0, receiptWidth, receiptHeight);
        pdf.save("invoice.pdf");
      });
    };

    useImperativeHandle(ref, () => ({
      downloadPDF: generatePDF,
    }));

    return (
      <div className="absolute -left-[9999px] -top-[9999px] flex justify-center items-center min-h-screen">
        <div
          className="p-6 bg-white  text-[12px] font-mono w-[350px] mx-auto"
          ref={invoiceRef}
          style={{
            width: "58mm", 
            minHeight: "85mm", 
            maxHeight: "300mm", 
            padding: "10px",
            fontSize: "8px",
            margin: "auto",
            backgroundColor: "#ffffff",
            overflow: "hidden", 
          }}
        >
          <div className="text-center font-bold">
            <p>{data.billedBy.businessName}</p>
            <p>{data.billedBy.address}</p>
            <p>Phone: {data.phoneNo}</p>
          </div>
          <hr className="border-t border-black my-1" />

          {/* Invoice Details */}
          <div className="flex flex-col">
            <div className="flex justify-between">
              <span>Date: {data.invoiceDate}</span>
              <span>Time: {data.invoiceTime}</span>
            </div>
            <div className="flex justify-between">
              <span>Invoice No:</span> <strong>{data.invoiceNo}</strong>
            </div>
          </div>
          <hr className="border-t border-black my-1" />

          {/* Table Header */}
          <div className="font-bold text-center">
            <div className="flex justify-between">
              <span className="w-32 text-left">Item</span>
              <span className="w-12">QTY</span>
              <span className="w-14">Rate</span>
              <span className="w-16 text-right">Total</span>
            </div>
            <hr className="border-t border-black my-1" />
          </div>

          {/* Items List */}
          {data.items.map((item, index) => (
            <div key={index} className="flex justify-between text-center text-[8px]">
              <span className="w-32 text-left">{item.name}</span>
              <span className="w-12">{item.quantity}</span>
              <span className="w-14">
                {data.currencySymbol}
                {Number(item.rate).toFixed(2)}
              </span>
              <span className="w-16 text-right">
                {data.currencySymbol}
                {Number(item.amount).toFixed(2)}
              </span>
            </div>
          ))}
          <hr className="border-t border-black my-1" />

          {/* Totals Section */}
          <div className="flex flex-col text-right">
            {/* <div className="flex justify-between">
            <span>Discount:</span>
            <span>{data.currencySymbol}{data.discount || "0.00"}</span>
          </div> */}
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>
                {data.currencySymbol}
                {data.total.toFixed(2)}
              </span>
            </div>
          </div>
          <hr className="border-t border-black my-1" />

          {/* Payment Details */}
          <div className="text-left">
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <span>{data.termOfPayment || "Cash/Card"}</span>
            </div>
            {/* <div className="flex justify-between">
            <span>Amount Paid:</span>
            <span>{data.currencySymbol}{data.amountPaid}</span>
          </div>
          <div className="flex justify-between">
            <span>Change Due:</span>
            <span>{data.currencySymbol}{data.changeDue}</span>
          </div> */}
          </div>
          <hr className="border-t border-black my-1" />

          {/* Footer Message */}
          <div className="text-center font-bold mt-2">
            <p>Thank You! Visit Again</p>
          </div>
        </div>
      </div>
    );
  }
);

export default InvoiceGenerateRetail;
