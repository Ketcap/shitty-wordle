-- CreateTable
CREATE TABLE "Wordles" (
    "id" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wordles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wordles_id_key" ON "Wordles"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Wordles_word_key" ON "Wordles"("word");
