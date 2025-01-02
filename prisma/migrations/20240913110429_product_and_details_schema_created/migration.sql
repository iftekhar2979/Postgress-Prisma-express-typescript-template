-- DropEnum
DROP TYPE "Rank";

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "phoneName" VARCHAR(255) NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "isFiveG" BOOLEAN NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "storage" DOUBLE PRECISION NOT NULL,
    "camera" INTEGER NOT NULL,
    "cameraRank" INTEGER NOT NULL,
    "ramRank" INTEGER NOT NULL,
    "ram" DOUBLE PRECISION NOT NULL,
    "rom" DOUBLE PRECISION NOT NULL,
    "screenSize" DOUBLE PRECISION NOT NULL,
    "eol" BOOLEAN NOT NULL,
    "phoneRank" INTEGER NOT NULL,
    "isActivition" BOOLEAN NOT NULL,
    "activitionFree" DOUBLE PRECISION NOT NULL,
    "productDetailsId" INTEGER,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Details" (
    "id" SERIAL NOT NULL,
    "phoneLineUp" TEXT NOT NULL,
    "retailPrice" DOUBLE PRECISION NOT NULL,
    "upgradePrice" DOUBLE PRECISION NOT NULL,
    "lineLimit" INTEGER NOT NULL,
    "service_cost_for_new_number" DOUBLE PRECISION NOT NULL,
    "saving_service_cost_for_new_number" DOUBLE PRECISION NOT NULL,
    "flex_up_non_port" DOUBLE PRECISION NOT NULL,
    "saving_cost_for_flex_up_non_port" DOUBLE PRECISION NOT NULL,
    "flex_plus_non_port" DOUBLE PRECISION NOT NULL,
    "saving_flex_plus_non_port" DOUBLE PRECISION NOT NULL,
    "flex_start_id_port" DOUBLE PRECISION NOT NULL,
    "saving_flex_start_id_port" DOUBLE PRECISION NOT NULL,
    "flex_up_id_port" DOUBLE PRECISION NOT NULL,
    "saving_flex_up_id_port" DOUBLE PRECISION NOT NULL,
    "flex_plus_id_port" DOUBLE PRECISION NOT NULL,
    "saving_flex_plus_id_port" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_productDetailsId_key" ON "Product"("productDetailsId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_productDetailsId_fkey" FOREIGN KEY ("productDetailsId") REFERENCES "Details"("id") ON DELETE CASCADE ON UPDATE CASCADE;
