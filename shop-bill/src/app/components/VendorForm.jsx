"use client";
import React from "react";
import VoiceInput from "./VoiceInput";

export default function VendorForm({ vendor, setVendor }) {
  const update = (k, v) => setVendor({ ...vendor, [k]: v });

  const sanitizeNumber = (text) => {
    if (!text) return "";
    // keep digits and dot
    return text.replace(/[^\d.]/g, "");
  };

  return (
    <div>
      <label style={{ display: "flex", alignItems: "center", gap: 8, color: "black" }}>
        <div style={{ minWidth: 120 }}>Vendor Name (Hindi):</div>
        <input
          className="text-red"
          value={vendor.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="दुकानदार का नाम"
        />
        <VoiceInput
          lang="hi-IN"
          label="Hindi"
          title="Start Hindi voice input for vendor name"
          onResult={(text) => update("name", (vendor.name ? vendor.name + " " : "") + text)}
        />
      </label>

      <label style={{ display: "flex", alignItems: "center", gap: 8, color: "black" }}>
        <div style={{ minWidth: 120 }}>Mobile:</div>
        <input
          value={vendor.mobile}
          onChange={(e) => update("mobile", e.target.value)}
          placeholder="Mobile number"
        />
        <VoiceInput
          lang="hi-IN"
          label="Mobile"
          title="Voice input for mobile (digits only)"
          onResult={(text) => update("mobile", sanitizeNumber(text))}
        />
      </label>

      <label style={{ display: "flex", alignItems: "flex-start", gap: 8, color: "black" }}>
        <div style={{ minWidth: 120 }}>Address:</div>
        <textarea
          value={vendor.address}
          onChange={(e) => update("address", e.target.value)}
          placeholder="Address"
          rows={3}
        />
        <VoiceInput
          lang="hi-IN"
          label="Address"
          title="Voice input for address"
          onResult={(text) => update("address", (vendor.address ? vendor.address + " " : "") + text)}
        />
      </label>
    </div>
  );
}
