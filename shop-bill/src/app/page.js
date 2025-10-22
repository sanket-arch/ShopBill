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
  const [items, setItems] = useState([
    { id: 1, name: "", price: "", qty: "", lineTotal: 0 },
  ]);

  // step: 0 = Vendor, 1 = Billing, 2 = Preview
  const [step, setStep] = useState(0);
  const next = () => setStep((s) => Math.min(2, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));
  const goTo = (n) => setStep(Math.max(0, Math.min(2, n)));

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Shop Bill</h1>

        <nav className={styles.stepper} aria-label="Form steps">
          <button
            className={`${styles.step} ${step === 0 ? styles.active : ""}`}
            onClick={() => goTo(0)}
            aria-current={step === 0 ? "step" : undefined}
          >
            <span className={styles.stepNum}>1</span>
            <span className={styles.stepLabel}>Vendor</span>
          </button>

          <div className={styles.stepLine} />

          <button
            className={`${styles.step} ${step === 1 ? styles.active : ""}`}
            onClick={() => goTo(1)}
            aria-current={step === 1 ? "step" : undefined}
          >
            <span className={styles.stepNum}>2</span>
            <span className={styles.stepLabel}>Billing</span>
          </button>

          <div className={styles.stepLine} />

          <button
            className={`${styles.step} ${step === 2 ? styles.active : ""}`}
            onClick={() => goTo(2)}
            aria-current={step === 2 ? "step" : undefined}
          >
            <span className={styles.stepNum}>3</span>
            <span className={styles.stepLabel}>Preview</span>
          </button>
        </nav>

        <div className={styles.content}>
          <section className={`${styles.card} ${step === 0 ? styles.show : styles.hide}`}>
            <h2 className={styles.cardTitle}>Vendor Details</h2>
            <VendorForm vendor={vendor} setVendor={setVendor} />
          </section>

          <section className={`${styles.card} ${step === 1 ? styles.show : styles.hide}`}>
            <h2 className={styles.cardTitle}>Billing</h2>
            <BillingForm items={items} setItems={setItems} />
          </section>

          <section className={`${styles.card} ${step === 2 ? styles.show : styles.hide}`}>
            <h2 className={styles.cardTitle}>Preview / Generate</h2>
            <BillPreview vendor={vendor} items={items} />
            <p className={styles.hint}>Review the bill and use the preview controls to download or print.</p>
          </section>
        </div>

        <div className={styles.actions}>
          {step > 0 && (
            <button className={styles.btnSecondary} onClick={prev}>
              Back
            </button>
          )}
          {step < 2 && (
            <button className={styles.btnPrimary} onClick={next}>
              Next
            </button>
          )}
        </div>
      </main>
    </div>
  );
}