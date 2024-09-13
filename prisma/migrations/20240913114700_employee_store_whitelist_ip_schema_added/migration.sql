-- AlterTable
ALTER TABLE "Details" ADD COLUMN     "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(6);

-- CreateTable
CREATE TABLE "ServiceTypeAndRatePrice" (
    "id" SERIAL NOT NULL,
    "alwaysConnected" DOUBLE PRECISION NOT NULL DEFAULT 45,
    "flex_up_non_port" DOUBLE PRECISION NOT NULL DEFAULT 65,
    "flex_plus_non_port" DOUBLE PRECISION NOT NULL DEFAULT 75,
    "flex_start_id_port" DOUBLE PRECISION NOT NULL DEFAULT 55,
    "flex_up_id_port" DOUBLE PRECISION NOT NULL DEFAULT 65,
    "flex_plus_id_port" DOUBLE PRECISION NOT NULL DEFAULT 75,

    CONSTRAINT "ServiceTypeAndRatePrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accessories" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "Accessories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Store" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "name" TEXT,
    "taxRate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhiteListedDevice" (
    "id" SERIAL NOT NULL,
    "ip" TEXT NOT NULL,
    "deviceName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "WhiteListedDevice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "storeId" INTEGER,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
