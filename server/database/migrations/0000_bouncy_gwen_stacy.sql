CREATE TABLE "profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"emoji" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" integer,
	"module" varchar(20) NOT NULL,
	"ref" varchar(50) NOT NULL,
	"completed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "progress" ADD CONSTRAINT "progress_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;