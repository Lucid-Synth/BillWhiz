import {
  pgTable,
  text,
  timestamp,
  integer,
  jsonb,
  index,
  numeric,
} from "drizzle-orm/pg-core";

import { user } from "./auth-schema";
import { relations } from "drizzle-orm";

export const invoiceAnalysis = pgTable(
  "invoice_analysis",
  {
    id: text("id").primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
      }),

    requestId: text("request_id")
      .notNull()
      .unique(),

    pdfUrl: text("pdf_url").notNull(),

    vendorName: text("vendor_name"),
    invoiceNumber: text("invoice_number"),

    invoiceDate: text("invoice_date"),
    dueDate: text("due_date"),

    currency: text("currency"),

    total: numeric("total"),

    anomalyCount: integer("anomaly_count")
      .default(0)
      .notNull(),

    lineItemCount: integer("line_item_count")
      .default(0)
      .notNull(),

    summarySnippet: text("summary_snippet"),

    status: text("status")
      .$type<
        "processing" | "completed" | "failed"
      >()
      .default("processing")
      .notNull(),

    errorMessage: text("error_message"),

    aiResponse: jsonb("ai_response"),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  }
);

export const invoiceAnalysisRelations = relations(
  invoiceAnalysis,
  ({ one }) => ({
    user: one(user, {
      fields: [invoiceAnalysis.userId],
      references: [user.id],
    }),
  })
);