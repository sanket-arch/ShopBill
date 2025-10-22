"use client";
import React from "react";

function buildHtml(vendor, items) {
  const total = items.reduce((s, it) => s + (parseFloat(it.lineTotal) || 0), 0);
  const rows = items
    .map(
      (it, i) => `<tr>
      <td style="padding:6px;border:1px solid #ddd">${i + 1}</td>
      <td style="padding:6px;border:1px solid #ddd">${escapeHtml(it.name)}</td>
      <td style="padding:6px;border:1px solid #ddd">₹${it.price || 0}</td>
      <td style="padding:6px;border:1px solid #ddd">${it.qty || 0}</td>
      <td style="padding:6px;border:1px solid #ddd">₹${it.lineTotal || 0}</td>
    </tr>`
    )
    .join("");

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Bill</title>
</head>
<body style="color:#000;background:#fff;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:800px;margin:0 auto;color:#000;">
    <h2 style="color:#000">Shop Bill</h2>
    <div style="color:#000">
      <strong>Vendor:</strong> ${escapeHtml(vendor.name)}<br/>
      <strong>Mobile:</strong> ${escapeHtml(vendor.mobile)}<br/>
      <strong>Address:</strong> ${escapeHtml(vendor.address)}<br/>
    </div>

    <table style="width:100%;border-collapse:collapse;margin-top:12px;color:#000">
      <thead>
        <tr>
          <th style="padding:6px;border:1px solid #ddd">#</th>
          <th style="padding:6px;border:1px solid #ddd">Product</th>
          <th style="padding:6px;border:1px solid #ddd">Price</th>
          <th style="padding:6px;border:1px solid #ddd">Qty</th>
          <th style="padding:6px;border:1px solid #ddd">Total</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <h3 style="text-align:right;color:#000">Grand Total: ₹${Math.round(total * 100) / 100}</h3>
  </div>
</body>
</html>`;
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default function BillPreview({ vendor, items }) {
  const downloadHtml = () => {
    const content = buildHtml(vendor, items);
    const blob = new Blob([content], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const name = `shop-bill-${Date.now()}.html`;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const openPrint = () => {
    const content = buildHtml(vendor, items);
    const w = window.open("", "_blank");
    if (!w) return alert("Popup blocked");
    w.document.open();
    w.document.write(content);
    w.document.close();
    // wait a bit for assets to render, then print
    setTimeout(() => w.print(), 500);
  };

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <button type="button" onClick={downloadHtml}>
          Download Bill (HTML)
        </button>
        <button type="button" onClick={openPrint} style={{ marginLeft: 8 }}>
          Print / Save as PDF
        </button>
      </div>

      <div style={{ border: "1px dashed #ccc", padding: 12, color: "#000" }}>
        <strong>Preview</strong>
        <div style={{ color: "#000" }}>Vendor: {vendor.name || "—"}</div>
        <div style={{ color: "#000" }}>Mobile: {vendor.mobile || "—"}</div>
        <div style={{ color: "#000" }}>Address: {vendor.address || "—"}</div>
        <table
          style={{ width: "100%", borderCollapse: "collapse", marginTop: 8, color: "#000" }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: 4 }}>#</th>
              <th style={{ border: "1px solid #ddd", padding: 4 }}>Product</th>
              <th style={{ border: "1px solid #ddd", padding: 4 }}>Price</th>
              <th style={{ border: "1px solid #ddd", padding: 4 }}>Qty</th>
              <th style={{ border: "1px solid #ddd", padding: 4 }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={it.id}>
                <td style={{ border: "1px solid #ddd", padding: 4 }}>
                  {i + 1}
                </td>
                <td style={{ border: "1px solid #ddd", padding: 4 }}>
                  {it.name}
                </td>
                <td style={{ border: "1px solid #ddd", padding: 4 }}>
                  ₹{it.price || 0}
                </td>
                <td style={{ border: "1px solid #ddd", padding: 4 }}>
                  {it.qty || 0}
                </td>
                <td style={{ border: "1px solid #ddd", padding: 4 }}>
                  ₹{it.lineTotal || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ textAlign: "right", marginTop: 8, color: "#000" }}>
          Grand Total: ₹
          {Math.round(
            items.reduce((s, it) => s + (parseFloat(it.lineTotal) || 0), 0) *
              100
          ) / 100}
        </div>
      </div>
    </div>
  );
}
