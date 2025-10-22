"use client";
import React from "react";
import VoiceInput from "./VoiceInput";
import styles from "../page.module.css";
// ...existing code...
export default function VendorForm({ vendor, setVendor }) {
  const update = (k, v) => setVendor({ ...vendor, [k]: v });

  const sanitizeNumber = (text) => {
    if (!text) return "";
    // keep digits and dot
    return text.replace(/[^\d.]/g, "");
  };

  return (
    <div>
      <div className={styles.formRow}>
        <div className={styles.label}>Vendor Name (Hindi):</div>
        <div style={{ flex: 1, display: "flex", gap: 8, alignItems: "center" }}>
          <input
            value={vendor.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="दुकानदार का नाम"
            aria-label="Vendor name"
          />
          <VoiceInput
            lang="hi-IN"
            label="Hindi"
            title="Start Hindi voice input for vendor name"
            onResult={(text) =>
              update("name", (vendor.name ? vendor.name + " " : "") + text)
            }
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.label}>Mobile:</div>
        <div style={{ flex: 1, display: "flex", gap: 8, alignItems: "center" }}>
          <input
            value={vendor.mobile}
            onChange={(e) => update("mobile", e.target.value)}
            placeholder="Mobile number"
            inputMode="tel"
            aria-label="Mobile number"
          />
          <VoiceInput
            lang="hi-IN"
            label="Mobile"
            title="Voice input for mobile (digits only)"
            onResult={(text) => update("mobile", sanitizeNumber(text))}
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.label}>Address:</div>
        <div style={{ flex: 1, display: "flex", gap: 8, alignItems: "flex-start" }}>
          <textarea
            value={vendor.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="Address"
            rows={3}
            aria-label="Vendor address"
            style={{ resize: "vertical" }}
          />
          <VoiceInput
            lang="hi-IN"
            label="Address"
            title="Voice input for address"
            onResult={(text) =>
              update("address", (vendor.address ? vendor.address + " " : "") + text)
            }
          />
        </div>
      </div>
    </div>
  );
}