-- CreateTable
CREATE TABLE "User" (
    "uid" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "username" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "User_uid_key" ON "User"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");
