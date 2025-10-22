/*
  Warnings:

  - You are about to drop the `word_landing_pages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `words` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `wordId` on the `user_words` table. All the data in the column will be lost.
  - Added the required column `wordEntryId` to the `user_words` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "word_landing_pages_slug_key";

-- DropIndex
DROP INDEX "word_landing_pages_word_key";

-- DropIndex
DROP INDEX "words_slug_idx";

-- DropIndex
DROP INDEX "words_hskLevel_isPublished_idx";

-- DropIndex
DROP INDEX "words_slug_key";

-- DropIndex
DROP INDEX "words_chinese_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "word_landing_pages";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "words";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "word_entries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "word" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "hskLevel" INTEGER NOT NULL,
    "contentJson" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING_IMPORT',
    "aiPrompt" TEXT,
    "aiResponse" TEXT,
    "aiModel" TEXT,
    "generateError" TEXT,
    "importedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "generatedAt" DATETIME,
    "publishedAt" DATETIME,
    "updatedAt" DATETIME NOT NULL,
    "seoScore" REAL,
    "wordCount" INTEGER
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user_words" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "wordEntryId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "easeFactor" REAL NOT NULL DEFAULT 2.5,
    "interval" INTEGER NOT NULL DEFAULT 0,
    "nextReview" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "source" TEXT,
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "wrongCount" INTEGER NOT NULL DEFAULT 0,
    "totalTime" INTEGER NOT NULL DEFAULT 0,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReviewAt" DATETIME,
    CONSTRAINT "user_words_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_words_wordEntryId_fkey" FOREIGN KEY ("wordEntryId") REFERENCES "word_entries" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_user_words" ("addedAt", "correctCount", "easeFactor", "id", "interval", "isFavorite", "lastReviewAt", "nextReview", "notes", "repetitions", "source", "status", "totalTime", "userId", "wrongCount") SELECT "addedAt", "correctCount", "easeFactor", "id", "interval", "isFavorite", "lastReviewAt", "nextReview", "notes", "repetitions", "source", "status", "totalTime", "userId", "wrongCount" FROM "user_words";
DROP TABLE "user_words";
ALTER TABLE "new_user_words" RENAME TO "user_words";
CREATE INDEX "user_words_userId_status_idx" ON "user_words"("userId", "status");
CREATE INDEX "user_words_userId_nextReview_idx" ON "user_words"("userId", "nextReview");
CREATE UNIQUE INDEX "user_words_userId_wordEntryId_key" ON "user_words"("userId", "wordEntryId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "word_entries_word_key" ON "word_entries"("word");

-- CreateIndex
CREATE UNIQUE INDEX "word_entries_slug_key" ON "word_entries"("slug");

-- CreateIndex
CREATE INDEX "word_entries_status_idx" ON "word_entries"("status");

-- CreateIndex
CREATE INDEX "word_entries_hskLevel_idx" ON "word_entries"("hskLevel");

-- CreateIndex
CREATE INDEX "word_entries_importedAt_idx" ON "word_entries"("importedAt");

-- CreateIndex
CREATE INDEX "word_entries_slug_idx" ON "word_entries"("slug");
