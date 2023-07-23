-- CreateEnum
CREATE TYPE "ResponseType" AS ENUM ('code');

-- CreateEnum
CREATE TYPE "CodeChallengeMethod" AS ENUM ('s256', 'plain');

-- CreateTable
CREATE TABLE "Authorize" (
    "id" SERIAL NOT NULL,
    "reqId" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "redirect_uri" TEXT NOT NULL,
    "response_type" "ResponseType",
    "state" TEXT NOT NULL,

    CONSTRAINT "Authorize_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Code" (
    "id" SERIAL NOT NULL,
    "client_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "code_challenge_id" TEXT NOT NULL,

    CONSTRAINT "Code_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessToken" (
    "id" SERIAL NOT NULL,
    "access_token" TEXT NOT NULL,

    CONSTRAINT "AccessToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "refresh_token" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "scope" TEXT[],
    "userId" TEXT NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("refresh_token")
);

-- CreateTable
CREATE TABLE "AcessTokenInfo" (
    "access_token_id" TEXT NOT NULL,
    "expire_in" BIGINT NOT NULL,
    "scope" TEXT[]
);

-- CreateTable
CREATE TABLE "User" (
    "sub" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("sub")
);

-- CreateTable
CREATE TABLE "CodeChallenge" (
    "code_challenge" TEXT NOT NULL,
    "code_challenge_method" "CodeChallengeMethod" NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Authorize_reqId_key" ON "Authorize"("reqId");

-- CreateIndex
CREATE UNIQUE INDEX "Code_code_key" ON "Code"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Code_code_challenge_id_key" ON "Code"("code_challenge_id");

-- CreateIndex
CREATE UNIQUE INDEX "AccessToken_access_token_key" ON "AccessToken"("access_token");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_refresh_token_key" ON "RefreshToken"("refresh_token");

-- CreateIndex
CREATE UNIQUE INDEX "AcessTokenInfo_access_token_id_key" ON "AcessTokenInfo"("access_token_id");

-- CreateIndex
CREATE UNIQUE INDEX "CodeChallenge_code_challenge_key" ON "CodeChallenge"("code_challenge");

-- AddForeignKey
ALTER TABLE "Code" ADD CONSTRAINT "Code_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("sub") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Code" ADD CONSTRAINT "Code_code_challenge_id_fkey" FOREIGN KEY ("code_challenge_id") REFERENCES "CodeChallenge"("code_challenge") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("sub") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcessTokenInfo" ADD CONSTRAINT "AcessTokenInfo_access_token_id_fkey" FOREIGN KEY ("access_token_id") REFERENCES "AccessToken"("access_token") ON DELETE CASCADE ON UPDATE CASCADE;
