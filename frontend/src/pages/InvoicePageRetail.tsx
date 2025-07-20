import Invoice, { InvoiceComponent } from "@/components/InvoiceGenerateGST";
import InvoiceGenerateRetail from "@/components/InvoiceGenerateRetail";
import { useInvoice } from "@/contexts/InvoiceContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";

const InvoicePage = () => {
  const { invoiceData: data } = useInvoice();
  const invoiceRef = useRef<InvoiceComponent>(null);

  const handleGenerateEInvoice = () => {
    if (invoiceRef.current) {
      invoiceRef.current.downloadPDF();
    }
  };

  const handlePrint = () => {
    generateInvoice();
  };

  const generateInvoice = () => {
    const invoiceElement = document.getElementById("invoice");
    if (!invoiceElement) return;

    html2canvas(invoiceElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 190;
      const pageHeight = 297; // A4 page height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = 10;

      if (imgHeight > pageHeight) {
        // If the invoice is longer than 1 page
        let heightLeft = imgHeight;

        while (heightLeft > 0) {
          pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
          if (heightLeft > 0) {
            pdf.addPage();
          }
        }
      } else {
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      }

      pdf.save(`Invoice_${data?.billedTo.businessName || "Customer"}.pdf`);
    });
  };

  const sendEmail = (pdfUrl: string) => {
    const recipient = "recipient@example.com";
    const subject = "Your Invoice is Ready";
    const body = `Hello,\n\nYour invoice is ready. You can download it from here: ${pdfUrl}\n\nBest Regards.`;

    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.open(mailtoLink, "_blank");
  };

  const sendWhatsApp = (pdfUrl: string) => {
    const phoneNumber = prompt(
      "Enter recipient's WhatsApp number (with country code):"
    );

    if (!phoneNumber) {
      alert("Phone number is required!");
      return;
    }

    const message = `Hello, your invoice is ready. You can download it from here: ${pdfUrl}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    // Open WhatsApp with prefilled message
    window.open(whatsappUrl, "_blank");
  };

  const handleDownload = () => {
    generateInvoice();
  };

  const handleSendWhatsapp = async () => {
    const invoiceElement = document.getElementById("invoice");
    if (!invoiceElement) return;

    const canvas = await html2canvas(invoiceElement, { scale: 4 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    const pdfFileName = `Invoice-${Date.now()}.pdf`;

    const pdfBlob = pdf.output("blob");

    const pdfUrl = URL.createObjectURL(pdfBlob);

    sendWhatsApp(pdfUrl);
  };

  const handleSendEmail = async () => {
    // Replace with your logic to send via Email / WhatsApp
    const invoiceElement = document.getElementById("invoice");
    if (!invoiceElement) return;

    const canvas = await html2canvas(invoiceElement, { scale: 4 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    const pdfFileName = `Invoice-${Date.now()}.pdf`;

    // Convert PDF to Blob
    const pdfBlob = pdf.output("blob");

    // Create a URL for the Blob
    const pdfUrl = URL.createObjectURL(pdfBlob);

    sendEmail(pdfUrl);

    // Send WhatsApp message with invoice link
    // sendWhatsApp(pdfUrl);
  };

  if (!data) {
    return (
      <div>
        <p>No invoice data available.</p>
      </div>
    );
  }

  return (
    <>
      <InvoiceGenerateRetail data={data} ref={invoiceRef} />
      <div
        className="p-6 bg-white dark:bg-black border-white border"
        id="invoice"
      >
        <h1 className="text-3xl text-[#67338a] font-bold px-4 text-center">
          Invoice
        </h1>
        <div className=" flex flex-col my-4 px-4">
          <div className=" w-72 p-1 flex justify-between">
            <span>Invoice No: </span>
            <strong>{data.invoiceNo}</strong>
          </div>
          <div className=" w-72 p-1 flex justify-between">
            <span>Invoice Date:</span> <strong>{data.invoiceDate}</strong>
          </div>
          <div className=" w-72 p-1 flex justify-between">
            <span>Payment Mode:</span> <strong>{data.termOfPayment}</strong>
          </div>
          <div className=" w-72 p-1 flex justify-between">
            <span>Invoice Time:</span> <strong>{data.invoiceTime}</strong>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 bg-white dark:bg-black  p-4 rounded-lg">
          <div>
            <h2 className="text-[#67338a] text-xl font-semibold">Billed By</h2>
            <p>
              <strong className=" text-xl">{data.billedBy.businessName}</strong>
            </p>
            <p>{data.billedBy.address}</p>
          </div>
        </div>

        <table className="w-full mt-4 border-collapse border border-[#67338a] text-center rounded-md">
          <thead>
            <tr className="bg-[#67338a] text-white">
              <th className="p-2 border-r border-white w-12">S. No.</th>
              <th className="p-2 border-r border-white w-64 text-left">Item</th>
              <th className="p-2 border-r border-white w-16">Quantity</th>
              <th className="p-2 border-r border-white w-20">Rate</th>
              <th className="p-2 w-20">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={index} className="border-b border-[#67338a]">
                <td className="p-2 border-r border-[#67338a] w-12">
                  {index + 1}
                </td>
                <td className="p-2 border-r border-[#67338a] w-64 text-left">
                  {item.name}
                </td>
                {data.billedTo.type === "Organization" && (
                  <td className="p-2 border-r border-[#67338a]">
                    {item.hsnCode}
                  </td>
                )}
                <td className="p-2 border-r border-[#67338a] w-16">
                  {item.quantity}
                </td>
                <td className="p-2 border-r border-[#67338a] w-20">
                  {data.currencySymbol}
                  {Number(item.rate).toFixed(2)}
                </td>
                {data.gstType && (
                  <td className="p-2 border-r border-[#67338a]">
                    {item.gstRate}%
                  </td>
                )}
                {data.gstType === "CGST_SGST" && (
                  <>
                    <td className="p-2 border-r border-[#67338a]">
                      {data.currencySymbol}
                      {Number(item.cgstRate).toFixed(2)}
                    </td>
                    <td className="p-2 border-r border-[#67338a]">
                      {data.currencySymbol}
                      {Number(item.sgstRate).toFixed(2)}
                    </td>
                  </>
                )}
                {data.gstType === "IGST" && (
                  <td className="p-2 border-r border-[#67338a]">
                    {data.currencySymbol}
                    {Number(item.igstRate).toFixed(2)}
                  </td>
                )}
                <td className="p-2 w-20">
                  {data.currencySymbol}
                  {Number(item.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className=" mt-16 justify-end text-right font-bold text-lg flex flex-col items-end">
          <div
            className={`text-lg flex justify-between font-semibold w-36
            `}
          >
            <span className=" text-xl">Total</span>
            <span className="text-gray-500">
              <div className="text-lg font-semibold">
                {data.currencySymbol}
                {data.total.toFixed(2)}
              </div>{" "}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-4 no-print p-6">
        <button
          onClick={handleGenerateEInvoice}
          className="border p-2 rounded-md"
        >
          🧾 Generate E-Invoice
        </button>

        <button onClick={handlePrint} className="border p-2 rounded-md">
          🖨️ Print
        </button>

        <button onClick={handleDownload} className="border p-2 rounded-md">
          ⬇️ Download
        </button>

        <button onClick={handleSendEmail} className="border p-2 rounded-md">
          ✉️ Email
        </button>
        <button onClick={handleSendWhatsapp} className="border p-2 rounded-md">
          ✉️ WhatsApp
        </button>
      </div>
    </>
  );
};

export default InvoicePage;
