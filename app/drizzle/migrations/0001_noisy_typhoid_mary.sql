CREATE TABLE "invoice_analysis" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"request_id" text NOT NULL,
	"pdf_url" text NOT NULL,
	"vendor_name" text,
	"invoice_number" text,
	"invoice_date" text,
	"due_date" text,
	"currency" text,
	"total" numeric,
	"anomaly_count" integer DEFAULT 0 NOT NULL,
	"line_item_count" integer DEFAULT 0 NOT NULL,
	"summary_snippet" text,
	"status" text DEFAULT 'processing' NOT NULL,
	"error_message" text,
	"ai_response" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "invoice_analysis_request_id_unique" UNIQUE("request_id")
);
--> statement-breakpoint
ALTER TABLE "invoice_analysis" ADD CONSTRAINT "invoice_analysis_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;