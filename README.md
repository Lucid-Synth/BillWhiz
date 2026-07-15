# BillWhiz

BillWhiz is an intelligent invoice analysis tool designed to simplify financial documents. It leverages AI to extract data from PDF invoices, provide clear explanations of charges, detect anomalies, and send professional, summarized reports via email.

Built with a modern stack including Next.js, Groq for ultra-fast AI inference, Drizzle ORM, and Resend for email delivery, BillWhiz provides a seamless experience for users to manage and understand their invoices.

## ✨ Features

-   **PDF Invoice Upload**: Securely upload invoices using UploadThing.
-   **AI-Powered Analysis**: Utilizes Groq's LLaMA 3.3 model to parse text, explain line items, and generate human-readable summaries.
-   **Anomaly Detection**: Automatically flags suspicious or unusual charges, such as duplicate items, inflated pricing, or incorrect calculations.
-   **Invoice History**: A persistent dashboard to view, search, and filter all previously analyzed invoices.
-   **Detailed Invoice View**: Drill down into specific analyses to see line items, financial summaries, and raw AI responses.
-   **Email Summaries**: Send beautifully formatted invoice reports directly to any email address using Resend and React Email.
-   **Secure Authentication**: Full user authentication system for sign-up, sign-in (email/password and Google), and session management powered by `better-auth`.
-   **Modern UI**: A sleek, responsive dashboard built with Tailwind CSS, Framer Motion, and Radix UI.

## ⚙️ Tech Stack

| Category          | Technology                                   |
| ----------------- | -------------------------------------------- |
| **Framework**     | Next.js (App Router)                         |
| **AI / LLM**      | Groq                                         |
| **Database**      | PostgreSQL                                   |
| **ORM**           | Drizzle ORM                                  |
| **Authentication**| `better-auth`                                |
| **File Uploads**  | UploadThing                                  |
| **Email**         | Resend, React Email                          |
| **Styling**       | Tailwind CSS                                 |
| **UI Components** | Shadcn UI, Radix UI                          |
| **Animations**    | Framer Motion                                |
| **PDF Parsing**   | `unpdf`                                      |
| **Deployment**    | Vercel (or any Node.js environment)          |

## Getting Started

To run BillWhiz locally, follow these steps.

### Prerequisites

-   Node.js (v20.x or later)
-   Bun (v1.x or later)
-   PostgreSQL database

### 1. Clone the Repository

```bash
git clone https://github.com/Lucid-Synth/BillWhiz.git
cd BillWhiz
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project and add the following environment variables. Obtain the necessary keys from their respective services.

```env
# Database
NILEDB_URL="your_postgresql_connection_string"

# Authentication (better-auth)
BETTER_AUTH_SECRET="your_secret_key_for_session_encryption"
BETTER_AUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# AI (Groq)
GROQ_API_KEY="your_groq_api_key"

# File Uploads (UploadThing)
UPLOADTHING_SECRET="your_uploadthing_secret"
UPLOADTHING_APP_ID="your_uploadthing_app_id"
# Note: In new UploadThing versions, UPLOADTHING_APP_ID might not be needed.

# Email (Resend)
RESEND_API_KEY="your_resend_api_key"
```

### 4. Push Database Schema

Run the Drizzle Kit command to push the schema to your database.

```bash
bun drizzle-kit push
```

### 5. Run the Development Server

```bash
bun dev
```

The application will be available at `http://localhost:3000`.

## 📂 Project Structure

The repository is organized to separate concerns and maintain a clean architecture within the Next.js App Router.

-   `app/api/`: Contains all backend API routes for authentication, processing, and data fetching.
-   `app/(auth)/`: Houses the sign-in and sign-up pages.
-   `app/dashboard/`: The main application interface, including the PDF uploader, history, and settings pages.
-   `app/drizzle/`: Includes the database connection (`db`), Drizzle schema (`schema`), and migration files (`migrations`).
-   `app/lib/`: Shared library functions, including authentication clients and utilities.
-   `components/`: Reusable React components used across the application, separated into marketing (`/`) and dashboard (`/Dashboard`) components.
-   `public/`: Static assets like images and fonts.

## 📄 License

This project is licensed under the **MIT License**. See the `LICENSE` file for more details.