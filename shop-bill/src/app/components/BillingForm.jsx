"use client";
import React from "react";
import VoiceInput from "./VoiceInput";
import styles from "../page.module.css";

export default function BillingForm({ items, setItems }) {
  const [page, setPage] = React.useState(0);
  const PAGE_SIZE = 15; // change to taste

  const updateItem = (id, key, value) => {
    const next = items.map((it) => {
      if (it.id !== id) return it;
      const newItem = { ...it, [key]: value };
      const price = parseFloat(newItem.price) || 0;
      const qty = parseFloat(newItem.qty) || 0;
      newItem.lineTotal = Math.round(price * qty * 100) / 100;
      return newItem;
    });
    setItems(next);
  };

  const sanitizeNumber = (text) => (text || "").toString().replace(/[^\d.]/g, "");

  const addItem = (item = { name: "", price: "", qty: "0" }) =>
    setItems((s) => [...s, { id: Date.now() + Math.random(), ...item, lineTotal: 0 }]);

  const removeItem = (id) => setItems((it) => it.filter((i) => i.id !== id));

  // Bulk paste: accepts lines like "name,price,qty" or space/tab separated
  const handleBulkPaste = (text) => {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const parsed = lines.map((line) => {
      const parts = line.split(/[,;\t]+/).map((p) => p.trim());
      return {
        name: parts[0] || "",
        price: sanitizeNumber(parts[1] || "0"),
        qty: sanitizeNumber(parts[2] || "1"),
      };
    });
    if (parsed.length) {
      setItems((s) => [...s, ...parsed.map((p) => ({ id: Date.now() + Math.random(), ...p }))]);
    }
  };

  const total = items.reduce((s, it) => s + (parseFloat(it.lineTotal) || 0), 0);

  // pagination view
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const pagedItems = items.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>

        <button className={styles.btnSecondary} onClick={() => addItem()}>+ Add</button>

        {items.length > PAGE_SIZE && (
          <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
            <button className={styles.btnSecondary} onClick={() => setPage((p) => Math.max(0, p - 1))}>Prev</button>
            <span style={{ fontSize: 13 }}>{page + 1} / {totalPages}</span>
            <button className={styles.btnSecondary} onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}>Next</button>
          </div>
        )}
      </div>

      <div className={styles.listContainer}>
        {pagedItems.map((it, idx) => (
          <div key={it.id} className={`${styles.productCard} ${styles.compactCard}`}>
            <div className={styles.formRowInline}>
              <input
                value={it.name}
                onChange={(e) => updateItem(it.id, "name", e.target.value)}
                placeholder="उत्पाद का नाम"
                aria-label={`Product name ${idx + 1}`}
                style={{ flex: 1 }}
              />
              <VoiceInput lang="hi-IN" title="Product name" onResult={(text) => updateItem(it.id, "name", (it.name ? it.name + " " : "") + text)} />
            </div>

            <div className={styles.formRowInline} style={{ marginTop: 8}}>
              <input
                type="number"
                value={it.price}
                onChange={(e) => updateItem(it.id, "price", e.target.value)}
                placeholder="Price"
                style={{ width: 110 }}
              />
              <VoiceInput lang="hi-IN" title="Price" onResult={(t) => updateItem(it.id, "price", sanitizeNumber(t))} />

              {/* Quantity input only — removed +/- controls as requested */}
              <div style={{ display: "flex", gap: 6, alignItems: "center", marginLeft: 8 }}>
                <input
                  type="number"
                  value={it.qty}
                  onChange={(e) => updateItem(it.id, "qty", sanitizeNumber(e.target.value) || "0")}
                  style={{ width: 84, textAlign: "center" }}
                  aria-label={`Quantity ${idx + 1}`}
                />
                <VoiceInput lang="hi-IN" title="Quantity" onResult={(text) => updateItem(it.id, "qty", sanitizeNumber(text))} />
              </div>

              <div style={{ marginLeft: "auto", fontWeight: 700 }}>₹{it.lineTotal || 0}</div>

              <button className={styles.btnSecondary} onClick={() => removeItem(it.id)} style={{ marginLeft: 8 }}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, alignItems: "center" }}>
        <div style={{ fontWeight: 800 }}>Grand Total: ₹{Math.round(total * 100) / 100}</div>
        <div style={{ fontSize: 13, color: "var(--muted, rgba(0,0,0,0.45))" }}>{items.length} items</div>
      </div>
    </div>
  );
}