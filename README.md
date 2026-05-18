# BillWhiz

> AI-powered invoice explainer and smart invoice sender built with Next.js, Groq, and Resend.

BillWhiz helps users upload invoices as PDFs , automatically extract billing data, explain charges in plain English using AI, detect suspicious or unusual fees, and send professional invoice summaries via email.

---

# ✨ Features

* 📄 Upload invoices as PDFs
* 🔍 Extract structured invoice data
* 🧠 AI-generated invoice explanations using Groq
* 🚨 Detect anomalies or suspicious charges
* 📧 Send invoice summaries via Resend
* ⚡ Fast modern UI with Next.js + Tailwind
* 🎬 Smooth animations using Framer Motion
* 🧩 Accessible UI primitives with Radix UI

---

# 🧠 High-Level Architecture

```txt
1. User uploads invoice (PDF/Image)
        ↓
2. Parse invoice data
   - PDF → pdf-parse
   - Image → OCR (tesseract.js)
        ↓
3. Send structured data to Groq LLM
        ↓
4. AI generates:
   - Charge explanations
   - Anomaly detection
        ↓
5. Format clean invoice summary
        ↓
6. Send email using Resend
```

---

# ⚙️ Tech Stack

| Layer         | Technology                          |
| ------------- | ----------------------------------- |
| Frontend      | Next.js (App Router)                |
| Styling       | Tailwind CSS                        |
| Animation     | Framer Motion                       |
| UI Components | Radix UI                            |
| Backend       | Next.js API Routes / Server Actions |
| AI            | Groq                                |
| Email         | Resend                              |
| PDF Parsing   | pdf-parse                           |
| OCR           | tesseract.js                        |

---

# 📦 Installation

Clone the repository:

```bash
git clone https://github.com/Lucid-Synth/BillWhiz
cd BillWhiz
```

Install dependencies:

```bash
bun install
```

Run development server:

```bash
bun dev
```

# 🛠 Future Improvements

* Stripe subscriptions
* Multi-language support
* Invoice history dashboard
* AI spending insights
* Team collaboration
* Export to CSV/PDF

---

# 📸 Demo Ideas

* Upload telecom bill
* SaaS subscription invoice
* Utility bill
* Medical invoice

---

# 📄 License

MIT License

---

# 💡 Vision

BillWhiz simplifies complex invoices into understandable insights using AI — helping users save time, detect billing issues, and communicate professionally.
