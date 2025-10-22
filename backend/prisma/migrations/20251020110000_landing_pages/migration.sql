-- CreateEnum
CREATE TABLE "newEnumDummy" ("status" TEXT);
DROP TABLE "newEnumDummy";
-- Since SQLite doesn't support enums, this section is a placeholder.

-- CreateTable
CREATE TABLE "word_landing_pages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "word" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "hskLevel" INTEGER NOT NULL,
    "jsonContent" TEXT NOT NULL,
    "seoScore" REAL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "aiPrompt" TEXT NOT NULL,
    "aiResponseRaw" TEXT,
    "wordCount" INTEGER NOT NULL,
    "exampleCount" INTEGER NOT NULL,
    "faqCount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "word_landing_pages_word_key" ON "word_landing_pages"("word");

-- CreateIndex
CREATE UNIQUE INDEX "word_landing_pages_slug_key" ON "word_landing_pages"("slug");
