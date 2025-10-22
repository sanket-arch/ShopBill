"use client";
import React from "react";
import VoiceInput from "./VoiceInput";

export default function BillingForm({ items, setItems }) {
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

  const sanitizeNumber = (text) => {
    if (!text) return "";
    return text.replace(/[^\d.]/g, "");
  };

  const addItem = () =>
    setItems([
      ...items,
      { id: Date.now(), name: "", price: "", qty: "", lineTotal: 0 },
    ]);

  const removeItem = (id) => setItems(items.filter((it) => it.id !== id));

  const total = items.reduce((s, it) => s + (parseFloat(it.lineTotal) || 0), 0);

  return (
    <div className="space-y-4">
      {items.map((it) => (
        <div
          key={it.id}
          className="border-b border-gray-200 py-3 last-of-type:border-b-0"
        >
          <div className="flex items-center gap-3">
            <div className="w-32 font-semibold text-sm" style={{color: "black"}}>Product Name:</div>
            <input
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
              value={it.name}
              onChange={(e) => updateItem(it.id, "name", e.target.value)}
              placeholder="उत्पाद का नाम"
            />
            <VoiceInput
              className="ml-2 p-2 border border-gray-300 rounded hover:bg-gray-50"
              lang="hi-IN"
              label="Product"
              title="Voice input product name (Hindi)"
              onResult={(text) =>
                updateItem(it.id, "name", (it.name ? it.name + " " : "") + text)
              }
            />
          </div>

          <div className="flex items-center gap-3 mt-3">
            <div className="w-32 font-semibold text-sm" style={{color: "black"}}>Price per piece:</div>
            <input
              className="w-36 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
              type="number"
              value={it.price}
              onChange={(e) => updateItem(it.id, "price", e.target.value)}
              placeholder="0.00"
            />
            <VoiceInput
              className="ml-2 p-2 border border-gray-300 rounded hover:bg-gray-50"
              lang="hi-IN"
              label="Price"
              title="Voice input for price (numbers)"
              onResult={(text) => updateItem(it.id, "price", sanitizeNumber(text))}
            />
          </div>

          <div className="flex items-center gap-3 mt-3">
            <div className="w-32 font-semibold text-sm" style={{color: "black"}}>Quantity:</div>
            <input
              className="w-36 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
              type="number"
              value={it.qty}
              onChange={(e) => updateItem(it.id, "qty", e.target.value)}
              placeholder="0"
            />
            <VoiceInput
              className="ml-2 p-2 border border-gray-300 rounded hover:bg-gray-50"
              lang="hi-IN"
              label="Quantity"
              title="Voice input for quantity (numbers)"
              onResult={(text) => updateItem(it.id, "qty", sanitizeNumber(text))}
            />
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="text-sm font-medium" style={{color:"black"}}>Line total: ₹{it.lineTotal || 0}</div>
            <button
              type="button"
              onClick={() => removeItem(it.id)}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="mt-2">
        <button
          type="button"
          onClick={addItem}
          className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
        >
          Add Product
        </button>
      </div>

      <div className="mt-2 text-right font-bold text-lg">
        Grand Total: ₹{Math.round(total * 100) / 100}
      </div>
    </div>
  );
}