import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useQuotation } from "@/contexts/QuotationContext";

const QuoatationPage = () => {
  const { quotationData: data } = useQuotation();
  const navigate = useNavigate();

  console.log(data);
  const handleGenerateEInvoice = () => {
    alert("E-Quotation generated!");
  };

  const handlePrint = () => {
    window.print(); // Opens the browser print dialog
  };

  const handleDownload = async () => {
    const quotationElement = document.getElementById("quotation"); // Get the quotation div

    if (!quotationElement) return;

    const canvas = await html2canvas(quotationElement, { scale: 4 }); // Capture as an image
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4"); // Create a new PDF
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Quotation-${Date.now()}.pdf`); // Save the PDF file
  };

  const handleSendEmailWhatsApp = () => {
    // Replace with your logic to send via Email / WhatsApp
    alert("Sending via Email / WhatsApp...");
  };

  if (!data) {
    return (
      <div>
        <p>No quotation data available.</p>
      </div>
    );
  }

  return (
    <>
      <div
        className="p-6 bg-white dark:bg-black border-white border"
        id="quotation"
      >
        <h1 className="text-3xl text-[#67338a] font-bold">Quotation</h1>
        <div className=" flex flex-col gap-1 my-4 px-4">
          <div className=" w-72 p-1 flex justify-between">
            <span>Quotation No: </span>
            <strong>{data.quotationNo}</strong>
          </div>
          <div className=" w-72 p-1 flex justify-between">
            <span>Quotation Date:</span> <strong>{data.quotationDate}</strong>
          </div>
          <div className="w-72 p-1 flex justify-between">
            <span>Due Date: </span>
            <strong>{data.dueDate}</strong>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 bg-white dark:bg-black  p-4 rounded-lg">
          <div>
            <h2 className="text-[#67338a] text-lg font-semibold">Billed By</h2>
            <p>
              <strong>{data.billedBy.businessName}</strong>
            </p>
            <p>Plot No. 45, Sector 44</p>
            <p>Near HUDA City Centre Metro Station</p>
            <p>Gurugram, Haryana 122003</p>
            <p>{data.billedBy.address}</p>
            {data.billedTo.type === "Organization" && (
              <>
                {" "}
                <p>GSTIN: {data.billedBy.gstIn}</p>
                <p>TaxID : {data.billedBy.taxId}</p>
              </>
            )}
          </div>
          <div>
            <h2 className="text-[#67338a] font-semibold">Billed To</h2>
            <p>
              <strong>{data.billedTo.businessName}</strong>
            </p>
            <p>3rd Floor, Prestige Tech Park</p>
            <p>Marathahalli - Sarjapur Outer Ring Road</p>
            <p>Bengaluru, Karnataka 560103</p>
            <p>{data.billedTo.address}</p>
            {data.billedTo.type === "Organization" && (
              <>
                {" "}
                <p>GSTIN: {data.billedTo.gstIn}</p>
                <p>TaxID : {data.billedTo.taxId}</p>
              </>
            )}
          </div>
        </div>

        <table className="w-full mt-4 border-collapse border border-[#67338a] text-center rounded-md">
          <thead>
            <tr className="bg-[#67338a] text-white">
              <th className="p-2 border-r border-white">S. No.</th>
              <th className="p-2 border-r border-white">Item</th>
              {data.billedTo.type === "Organization" && (
                <th className="p-2 border-r border-white">HSN/SAC</th>
              )}
              <th className="p-2 border-r border-white">Quantity</th>
              <th className="p-2 border-r border-white">Rate</th>
              {data.gstType && (
                <th className="p-2 border-r border-white">GST Rate (%)</th>
              )}
              {data.gstType === "CGST_SGST" && (
                <>
                  <th className="p-2 border-r border-white">CGST</th>
                  <th className="p-2 border-r border-white">SGST</th>
                </>
              )}
              {data.gstType === "IGST" && (
                <th className="p-2 border-r border-white">IGST</th>
              )}
              <th className="p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={index} className="border-b border-[#67338a]">
                <td className="p-2 border-r border-[#67338a] w-24">
                  {index + 1}
                </td>
                <td className="p-2 border-r border-[#67338a]">{item.name}</td>
                {data.billedTo.type === "Organization" && (
                  <td className="p-2 border-r border-[#67338a]">
                    {item.hsnCode}
                  </td>
                )}
                <td className="p-2 border-r border-[#67338a]">
                  {item.quantity}
                </td>
                <td className="p-2 border-r border-[#67338a]">
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
                <td className="p-2">
                  {data.currencySymbol}
                  {Number(item.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className=" mt-24 justify-end text-right font-bold text-lg flex flex-col items-end">
          {data.billedTo.type === "Organization" && (
            <>
              {" "}
              <div className="text-lg font-semibold flex w-96 justify-between">
                <span>Subtotal</span>
                <span className="text-gray-500">
                  {" "}
                  {data.currencySymbol}
                  {data.taxableAmount}
                </span>
              </div>{" "}
              <div className="text-lg flex w-96 justify-between gap-40 font-semibold">
                <span>Total Tax</span>
                <span className="text-gray-500">
                  {" "}
                  {data.currencySymbol}
                  {data.totalTax}
                </span>
              </div>
            </>
          )}
          <div
            className={`text-lg flex justify-between font-semibold ${
              data.billedTo.type === "Organization" ? "w-96" : "w-48"
            }`}
          >
            <span>Total</span>
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
        <button onClick={handleDownload} className="border p-2 rounded-md">
          ⬇️ Download
        </button>
      </div>{" "}
    </>
  );
};

export default QuoatationPage;
