// ...existing code...
"use client";
import React, { useRef } from "react";
import styles from "../page.module.css";

const STORE_NAME = "Simran Store";
const STORE_PLACE = "Manmohan Chowk";
const STORE_MOBILE = "8409713511";

function vendorLabelText(vendor) {
  const name = vendor?.name || "";
  const hindi =
    vendor?.hindi ||
    vendor?.name_hi ||
    vendor?.name_hindi ||
    vendor?.vendor_hindi ||
    "";
  return name + (hindi ? ` (${hindi})` : "");
}

export default function BillPreview({ vendor = {}, items = [] }) {

  const previewRef = useRef(null);

  const downloadPdf = async() => {
    // dynamic import to avoid SSR / bundler issues
    const pdfMakeModule = await import("pdfmake/build/pdfmake");
    const vfsModule = await import("pdfmake/build/vfs_fonts").catch(() => null);

    const pdfMake = pdfMakeModule?.default || pdfMakeModule;
    // prefer vfs at pdfMake key, fallback to direct vfs
    const vfs =
      vfsModule && (vfsModule?.default?.pdfMake?.vfs || vfsModule?.pdfMake?.vfs || vfsModule?.default?.vfs || vfsModule?.vfs);

    if (!pdfMake) return alert("Failed to load pdfmake.");
    if (vfs) pdfMake.vfs = vfs;

    const total = items.reduce((s, it) => s + (parseFloat(it.lineTotal) || 0), 0);
    const tableBody = [
      ["#", "Product", "Price", "Qty", "Total"],
      ...items.map((it, i) => [
        String(i + 1),
        String(it.name || ""),
        String(`₹${it.price}` || "0"),
        String(it.qty || "0"),
        String(`₹${it.lineTotal}` || "0"),
      ]),
    ];

    const docDefinition = {
      pageSize: "A4",
      pageMargins: [14, 18, 14, 18],
      defaultStyle: { fontSize: 10 },
      content: [
        { text: STORE_NAME, style: "title", alignment: "center" },
        {
          columns: [
            {
              stack: [
                { text: STORE_PLACE, style: "sub" },
                { text: `Mob: ${STORE_MOBILE}`, style: "sub" },
              ],
              width: "50%",
            },
            {
              stack: [
                { text: `Vendor: ${vendorLabelText(vendor) || "—"}`, alignment: "right" },
                { text: `Mobile: ${vendor.mobile || "—"}`, alignment: "right" },
                { text: `Address: ${vendor.address || "—"}`, alignment: "right" },
              ],
              width: "50%",
            },
          ],
          margin: [0, 8, 0, 6],
        },

        // thin separator line
        {
          canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: "#cccccc" }],
          margin: [0, 4, 0, 8],
        },

        {
          table: {
            headerRows: 1,
            widths: [24, "*", 60, 40, 60],
            body: tableBody,
          },
          layout: {
            fillColor: function (rowIndex) {
              return rowIndex === 0 ? "#f3f3f3" : null;
            },
            hLineWidth: function (i, node) {
              return i === 0 || i === node.table.body.length ? 0.6 : 0.3;
            },
            vLineWidth: function () {
              return 0.3;
            },
            hLineColor: function () {
              return "#e0e0e0";
            },
            vLineColor: function () {
              return "#e0e0e0";
            },
            paddingLeft: function () { return 6; },
            paddingRight: function () { return 6; },
            paddingTop: function () { return 6; },
            paddingBottom: function () { return 6; },
          },
        },

        {
          columns: [
            { width: "*", text: "" },
            {
              width: "auto",
              table: {
                body: [
                  [{ text: "Grand Total", bold: true, alignment: "right" }, { text: `₹${Math.round(total * 100) / 100}`, bold: true, alignment: "right" }],
                ],
              },
              layout: "noBorders",
              margin: [0, 8, 0, 0],
            },
          ],
        },
      ],
      styles: {
        title: { fontSize: 16, bold: true, margin: [0, 0, 0, 6] },
        sub: { fontSize: 10, color: "#555" },
      },
      defaultStyle: { columnGap: 8 },
    };

    const filename = `${(vendor.name || "bill").replace(/\s+/g, "-")}-${Date.now()}.pdf`;
    pdfMake.createPdf(docDefinition).download(filename);
  };

  const openPrint = () => {
    // fallback: open simple HTML print view
    const html = `
      <!doctype html>
      <html><head><meta charset="utf-8"><title>Bill</title>
      <style>
        body{font-family:Arial,Helvetica,sans-serif;color:#000;padding:16px}
        h2{margin:0 0 6px 0}
        .meta{display:flex;justify-content:space-between;margin:8px 0 12px 0}
        table{width:100%;border-collapse:collapse;margin-top:12px}
        th,td{border:1px solid #ddd;padding:6px;text-align:left;font-size:13px}
        th{background:#f6f6f6}
        .total{font-weight:800;text-align:right;margin-top:8px}
      </style>
      </head><body>
      <h2>${STORE_NAME}</h2>
      <div class="meta">
        <div>${STORE_PLACE}<br/>Mob: ${STORE_MOBILE}</div>
        <div style="text-align:right">Vendor: ${vendorLabelText(vendor) || "—"}<br/>Mob: ${vendor.mobile || "—"}<br/>${vendor.address || "—"}</div>
      </div>
      <table><thead><tr><th>#</th><th>Product</th><th>Price</th><th>Qty</th><th>Total</th></tr></thead>
      <tbody>
      ${items
        .map(
          (it, i) =>
            `<tr><td>${i + 1}</td><td>${(it.name || "").replace(/</g, "&lt;")}</td><td style="text-align:right">₹${it.price || 0}</td><td style="text-align:right">${it.qty ||
              0}</td><td style="text-align:right">₹${it.lineTotal || 0}</td></tr>`
        )
        .join("")}
      </tbody></table>
      <div class="total">Grand Total: ₹${Math.round(total * 100) / 100}</div>
      </body></html>
    `;
    const w = window.open("", "_blank");
    if (!w) return alert("Popup blocked");
    w.document.open();
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 400);
  };

  const total = items.reduce((s, it) => s + (parseFloat(it.lineTotal) || 0), 0);

  return (
    <div>
      <div className={styles.previewActions}>
        <button type="button" className={styles.btnPrimary} onClick={downloadPdf}>
          Download PDF
        </button>
        <button type="button" className={styles.btnSecondary} onClick={openPrint}>
          Print / Save as PDF
        </button>
      </div>

      <div className={styles.previewBox} ref={previewRef}>
        <div className={styles.previewHeader}>
          <div>
            <h2 className={styles.previewTitle}>{STORE_NAME}</h2>
            <div className={styles.previewSub}>{STORE_PLACE} • Mob: {STORE_MOBILE}</div>
          </div>
          <div className={styles.previewVendor}>
            <div><strong>Vendor:</strong> {vendorLabelText(vendor) || "—"}</div>
            <div><strong>Mobile:</strong> {vendor.mobile || "—"}</div>
            <div><strong>Address:</strong> {vendor.address || "—"}</div>
          </div>
        </div>

        <table className={styles.previewTable} aria-label="Bill preview">
          <thead>
            <tr>
              <th style={{ width: 32 }}>#</th>
              <th>Product</th>
              <th style={{ width: 80, textAlign: "right" }}>Price</th>
              <th style={{ width: 60, textAlign: "right" }}>Qty</th>
              <th style={{ width: 90, textAlign: "right" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={it.id || i}>
                <td>{i + 1}</td>
                <td className={styles.productCell}>{it.name}</td>
                <td style={{ textAlign: "right" }}>₹{it.price || 0}</td>
                <td style={{ textAlign: "right" }}>{it.qty || 0}</td>
                <td style={{ textAlign: "right" }}>₹{it.lineTotal || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.previewFooter}>
          <div className={styles.grandTotal}>Grand Total: ₹{Math.round(total * 100) / 100}</div>
        </div>
      </div>
    </div>
  );
}