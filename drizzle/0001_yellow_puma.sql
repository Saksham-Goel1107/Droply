CREATE TABLE IF NOT EXISTS "file_shares" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"file_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"password" text,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"access_count" integer DEFAULT 0 NOT NULL,
	"last_accessed_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "is_public" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "share_password" text;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "share_expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "share_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "file_shares" ADD CONSTRAINT "file_shares_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
