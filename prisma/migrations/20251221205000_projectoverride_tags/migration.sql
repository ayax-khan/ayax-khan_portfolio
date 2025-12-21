-- Add tags to ProjectOverride
ALTER TABLE "ProjectOverride"
ADD COLUMN "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
