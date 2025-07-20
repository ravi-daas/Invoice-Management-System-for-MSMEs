import React, {
  useRef,
  useMemo,
  useEffect,
  forwardRef,
  Ref,
  useImperativeHandle,
} from "react";
import { useTable, Column } from "react-table";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { InvoiceData } from "@/types";
import { convertToWords } from "react-number-to-words";

interface InvoiceProps {
  data: InvoiceData;
}

const TaxTable: React.FC<InvoiceProps> = ({ data }) => {
  const { taxData, totalTaxSum } = useMemo(() => {
    const taxData = data.items.map((item) => {
      const taxableValue = item.rate * item.quantity;

      if (data.gstType === "CGST_SGST") {
        return {
          hsn: item.hsnCode,
          taxableValue,
          centralTaxRate: item.gstRate / 2,
          centralTaxAmount: taxableValue * (item.gstRate / 2 / 100),
          stateTaxRate: item.gstRate / 2,
          stateTaxAmount: taxableValue * (item.gstRate / 2 / 100),
          totalTax: taxableValue * (item.gstRate / 100),
        };
      } else {
        // IGST Calculation
        return {
          hsn: item.hsnCode,
          taxableValue,
          igstRate: item.igstRate,
          igstAmount: taxableValue * (item.igstRate / 100),
          totalTax: taxableValue * (item.igstRate / 100),
        };
      }
    });

    const totalTaxSum = taxData.reduce((sum, tax) => sum + tax.totalTax, 0);

    return { taxData, totalTaxSum };
  }, [data.items, data.gstType]);

  // Define columns conditionally based on gstType
  const columns: Column[] = useMemo(() => {
    const baseColumns = [
      { Header: "HSN/SAC", accessor: "hsn" },
      {
        Header: "Taxable Value",
        accessor: "taxableValue",
        //@ts-ignore
        Cell: ({ value }) => `${data.currencySymbol}${value.toFixed(2)}`,
      },
    ];

    if (data.gstType === "CGST_SGST") {
      return [
        ...baseColumns,
        {
          Header: "Central Tax Rate",
          accessor: "centralTaxRate",
          Cell: ({ value }) => `${value}%`,
        },
        {
          Header: "Central Tax Amount",
          accessor: "centralTaxAmount",
          Cell: ({ value }) => `${data.currencySymbol}${value.toFixed(2)}`,
        },
        {
          Header: "State Tax Rate",
          accessor: "stateTaxRate",
          Cell: ({ value }) => `${value}%`,
        },
        {
          Header: "State Tax Amount",
          accessor: "stateTaxAmount",
          Cell: ({ value }) => `${data.currencySymbol}${value.toFixed(2)}`,
        },
        {
          Header: "Total Tax Amount",
          accessor: "totalTax",
          Cell: ({ value }) => `${data.currencySymbol}${value}`,
        },
      ];
    } else {
      return [
        ...baseColumns,
        {
          Header: "IGST Rate",
          accessor: "igstRate",
          Cell: ({ value }) => `${value}%`,
        },
        {
          Header: "IGST Amount",
          accessor: "igstAmount",
          Cell: ({ value }) => `${data.currencySymbol}${value.toFixed(2)}`,
        },
        {
          Header: "Total Tax Amount",
          accessor: "totalTax",
          Cell: ({ value }) => `${data.currencySymbol}${value}`,
        },
      ];
    }
  }, [data.currencySymbol, data.gstType]);

  const tableInstance = useTable({ columns, data: taxData });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <table
      {...getTableProps()}
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "10px",
        border: "0.5px solid #000",
        fontSize: "12px",
      }}
    >
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                key={column.id}
                style={{
                  border: "0.5px solid #000",
                  padding: "4px",
                  textAlign: "center",
                  background: "#f0f0f0",
                  fontSize: "11px",
                }}
              >
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={row.id}>
              {row.cells.map((cell) => (
                <td
                  {...cell.getCellProps()}
                  key={cell.column.id}
                  style={{
                    border: "0.5px solid #000",
                    padding: "4px",
                    textAlign: "center",
                    fontSize: "11px",
                  }}
                >
                  {cell.render("Cell")}
                </td>
              ))}
            </tr>
          );
        })}
        <tr>
          <td
            colSpan={data.gstType === "CGST_SGST" ? 6 : 3} // Adjust based on column count
            style={{
              textAlign: "right",
              fontWeight: "bold",
              border: "0.5px solid #000",
              paddingRight: "5px",
            }}
          >
            Total Tax
          </td>
          <td style={{ fontWeight: "bold", padding: "6px" }}>
            {data.currencySymbol}
            {totalTaxSum.toFixed(2)}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const InvoiceTable: React.FC<{ data: InvoiceData }> = ({ data }) => {
  const baseData = useMemo(
    () =>
      data.items.map((item, index) => ({
        slNo: index + 1,
        description: item.name,
        hsn: item.hsnCode,
        quantity: `${item.quantity} No`,
        rate: item.rate,
        amount: item.quantity * item.rate,
      })),
    [data.items]
  );

  const totalQuantity = useMemo(
    () => data.items.reduce((sum, item) => sum + item.quantity, 0),
    [data.items]
  );

  const extraRowsCount = Math.max(20 - baseData.length, 0);
  const extraRows = useMemo(() => {
    return Array.from({ length: extraRowsCount }, (_, i) => ({
      slNo: "",
      description: "",
      hsn: "",
      quantity: "",
      rate: "",
      amount: "",
    }));
  }, [extraRowsCount, baseData]);

  const tableData = useMemo(
    () => [...baseData, ...extraRows],
    [baseData, extraRows]
  );
  // const totalAmount = baseData.reduce((sum, row) => sum + row.amount, 0);

  const columns: Column[] = useMemo(
    () => [
      { Header: "Sl No.", accessor: "slNo", style: { width: "6%" } },
      { Header: "Description of Goods", accessor: "description" },
      { Header: "HSN/SAC", accessor: "hsn", style: { width: "10%" } },
      { Header: "Quantity", accessor: "quantity", style: { width: "10%" } },
      {
        Header: "Rate",
        accessor: "rate",
        style: { width: "10%" },
        Cell: ({ value }) => `${value}${value ? "%" : ""}`, // Add percentage symbol
      },
      {
        Header: "Amount",
        accessor: "amount",
        style: { width: "10%" },
        Cell: ({ value }) =>
          `${value ? data.currencySymbol : ""}${value ? value.toFixed(2) : ""}`, // Add currency symbol
      },
    ],
    [data.currencySymbol]
  );

  const tableInstance = useTable({ columns, data: tableData });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <table
      {...getTableProps()}
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "10px",
        border: "0.5px solid #000",
        fontSize: "12px",
      }}
    >
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                key={column.id}
                style={{
                  border: "0.5px solid #000",
                  padding: "4px",
                  textAlign: "center",
                  background: "#f0f0f0",
                  fontSize: "11px",
                  // @ts-ignore
                  ...(column.style || {}),
                }}
              >
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()} style={{ border: "0.5px solid #000" }}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={row.id}>
              {row.cells.map((cell) => (
                <td
                  {...cell.getCellProps()}
                  key={cell.column.id}
                  style={{
                    borderLeft: "0.5px solid #000",
                    padding: "4px",
                    textAlign: "left",
                    fontSize: "11px",
                    minHeight: "20px",
                    // @ts-ignore
                    ...(cell.column.style || {}),
                  }}
                >
                  {cell.render("Cell")}
                </td>
              ))}
            </tr>
          );
        })}
        <tr>
          <td
            style={{
              textAlign: "right",
              fontWeight: "bold",
              border: "0.5px solid #000",
            }}
          ></td>
          <td
            style={{
              textAlign: "right",
              fontWeight: "bold",
              border: "0.5px solid #000",
            }}
          >
            Total
          </td>
          <td
            style={{
              textAlign: "right",
              fontWeight: "bold",
              border: "0.5px solid #000",
            }}
          ></td>
          <td style={{ fontWeight: "bold", border: "0.5px solid #000" }}>
            {totalQuantity} No
          </td>
          <td
            style={{
              textAlign: "right",
              fontWeight: "bold",
              border: "0.5px solid #000",
            }}
          ></td>
          <td
            style={{
              fontWeight: "bold",
              border: "0.5px solid #000",
              textAlign: "center",
              padding: "6px",
            }}
          >
            {data.currencySymbol}
            {data.total.toFixed(2)}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export interface InvoiceComponent {
  downloadPDF: () => void;
}

const Invoice = forwardRef<InvoiceComponent, InvoiceProps>(
  ({ data }, ref: Ref<InvoiceComponent>) => {
    const invoiceRef = useRef<HTMLDivElement>(null);

    const generatePDF = () => {
      console.log("Generating PDF");

      const input = invoiceRef.current;
      if (!input) return;
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = 210;
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("invoice.pdf");
      });
    };

    useImperativeHandle(ref, () => ({
      downloadPDF: generatePDF,
    }));

    const totalAmountInWords = convertToWords(Math.round(data.total));

    return (
      <div className="absolute -left-[9999px] -top-[9999px] w-[600px] bg-white p-6 border border-gray-300 shadow-md">
        <div
          ref={invoiceRef}
          style={{
            padding: "20px",
            fontFamily: "Arial",
            fontSize: "13px",
            width: "210mm",
            minHeight: "297mm",
            margin: "auto",
            border: "1px solid #000",
            backgroundColor: "#ffffff",
          }}
        >
          <h2 style={{ textAlign: "center", padding: "10px" }}>Tax Invoice</h2>

          {/* Invoice Header Details */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "0.5px solid none",
              marginBottom: "10px",
            }}
          >
            <tbody>
              <tr>
                {/* Seller Information */}
                <td
                  style={{
                    border: "0.5px solid #000",
                    padding: 5,
                    width: "50%",
                    verticalAlign: "top",
                  }}
                >
                  <strong>{data.billedBy.businessName || "N/A"}</strong>
                  <br />
                  {data.billedBy.address || "N/A"}
                  <br />
                  GSTIN/UIN: {data.billedBy.gstIn || "N/A"}
                  <br />
                  TAX ID: {data.billedBy.taxId || "N/A"}
                  <br />
                  State: Karnataka, Code: 29
                </td>

                {/* Invoice & Date */}
                <td
                  style={{
                    border: "0.5px solid #000",
                    padding: 5,
                    width: "50%",
                    verticalAlign: "top",
                  }}
                >
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      <tr>
                        <td
                          style={{ border: "none", padding: 5, width: "395px" }}
                        >
                          <strong>Invoice No:</strong>
                        </td>
                        <td
                          style={{ border: "none", padding: 5, width: "175px" }}
                        >
                          {data.invoiceNo || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{ border: "none", padding: 5, width: "395px" }}
                        >
                          <strong>Dated:</strong>
                        </td>
                        <td
                          style={{ border: "none", padding: 5, width: "175px" }}
                        >
                          {data.invoiceDate || "N/A"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              <tr>
                {/* Buyer Information */}
                <td style={{ border: "0.5px solid #000", padding: 5 }}>
                  <strong>Buyer:</strong>
                  <br />
                  {data.billedTo.businessName || "N/A"}
                  <br />
                  {data.billedTo.address || "N/A"}
                  <br />
                  GSTIN/UIN: {data.billedTo.gstIn || "N/A"}
                  <br />
                  TAX ID: {data.billedTo.taxId || "N/A"}
                  <br />
                  State: Karnataka, Code: 29
                </td>

                {/* Additional Invoice Fields */}
                <td style={{ border: "0.5px solid #000", padding: 5 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      <tr>
                        <td
                          style={{ border: "none", padding: 5, width: "395px" }}
                        >
                          <strong>Delivery Note:</strong>
                        </td>
                        <td
                          style={{ border: "none", padding: 5, width: "195px" }}
                        >
                          {data.deliveryNote || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ border: "none", padding: 5 }}>
                          <strong>Mode/Terms of Payment:</strong>
                        </td>
                        <td
                          style={{ border: "none", padding: 5, width: "195px" }}
                        >
                          {data.termOfPayment || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{ border: "none", padding: 5, width: "395px" }}
                        >
                          <strong>Reference No.:</strong>
                        </td>
                        <td
                          style={{ border: "none", padding: 5, width: "195px" }}
                        >
                          {data.RefNo || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{ border: "none", padding: 5, width: "395px" }}
                        >
                          <strong>Other References:</strong>
                        </td>
                        <td
                          style={{ border: "none", padding: 5, width: "195px" }}
                        >
                          {data.OtherRef || "N/A"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              <tr>
                {/* Dispatch Information */}
                <td style={{ border: "0.5px solid #000", padding: 5 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      <tr>
                        <td style={{ border: "none", padding: 5 }}>
                          <strong>Buyer's Order No.:</strong>
                        </td>
                        <td style={{ border: "none", padding: 5 }}>
                          {data.BuyerOrderNo || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ border: "none", padding: 5 }}>
                          <strong>Dated:</strong>
                        </td>
                        <td style={{ border: "none", padding: 5 }}>
                          {data.invoiceDate || "N/A"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>

                {/* Dispatch Document Details */}
                <td style={{ border: "0.5px solid #000", padding: 5 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      <tr>
                        <td
                          style={{ border: "none", padding: 5, width: "395px" }}
                        >
                          <strong>Dispatch Doc No.:</strong>
                        </td>
                        <td
                          style={{ border: "none", padding: 5, width: "195px" }}
                        >
                          {data.DispatchDocNo || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{ border: "none", padding: 5, width: "395px" }}
                        >
                          <strong>Delivery Note Date:</strong>
                        </td>
                        <td
                          style={{ border: "none", padding: 5, width: "195px" }}
                        >
                          {data.deliveryNoteDate || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{ border: "none", padding: 5, width: "395px" }}
                        >
                          <strong>Dispatched Through:</strong>
                        </td>
                        <td
                          style={{ border: "none", padding: 5, width: "195px" }}
                        >
                          {data.DispatchedThrough || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{ border: "none", padding: 5, width: "395px" }}
                        >
                          <strong>Destination:</strong>
                        </td>
                        <td
                          style={{ border: "none", padding: 5, width: "195px" }}
                        >
                          {data.Destination || "N/A"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Invoice Items Table */}
          <InvoiceTable data={data} />
          <h3 style={{ textAlign: "right", marginTop: "30px" }}>
            SubTotal: {data.currencySymbol} {data.taxableAmount.toFixed(2)}
          </h3>
          <h3 style={{ textAlign: "right" }}>
            Tax : {data.currencySymbol} {data.totalTax.toFixed(2)}
          </h3>
          <h3 style={{ textAlign: "right" }}>
            Grand Total: {data.currencySymbol} {data.total.toFixed(2)}
          </h3>
          <p style={{ textAlign: "right", marginBottom: "30px" }}>
            <strong>Amount Chargeable (in words):</strong> {totalAmountInWords}{" "}
            only
          </p>
          <TaxTable data={data} />
          <div style={{ display: "flex", justifyContent: "start" }}>
            {" "}
            <p style={{ textAlign: "right", marginTop: "30px" }}>
              <strong>Tax Amount (in words):</strong>{" "}
              {convertToWords(Math.round(data?.totalTax))} only
            </p>
          </div>
        </div>
      </div>
    );
  }
);

export default Invoice;
