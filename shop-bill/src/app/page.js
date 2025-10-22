'use client';
import React, { useState } from "react";
import styles from "./page.module.css";
import VendorForm from "./components/VendorForm";
import BillingForm from "./components/BillingForm";
import BillPreview from "./components/BillPreview";

export default function Home() {
  const [vendor, setVendor] = useState({
    name: "",
    mobile: "",
    address: "",
  });
  const [items, setItems] = React.useState([
    { id: 1, name: "", price: "", qty: "", lineTotal: 0 },
  ]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Shop Bill</h1>

        <div className={styles.container}>
          <section className={styles.card}>
            <h2 style={{color: "black"}}>Vendor Details</h2>
            <VendorForm vendor={vendor} setVendor={setVendor} />
          </section>

          <section className={styles.card}>
            <h2 style={{color: "black"}}>Billing</h2>
            <BillingForm items={items} setItems={setItems} />
          </section>

          <section className={styles.card}>
            <h2 style={{color: "black"}} > Preview / Generate</h2>
            <BillPreview vendor={vendor} items={items} />
          </section>
        </div>
      </main>
    </div>
  );
}