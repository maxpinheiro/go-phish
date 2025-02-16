-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "bio" TEXT NOT NULL,
    "hometown" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "avatarType" TEXT,
    "avatar" JSONB,
    "friend_ids" INTEGER[],

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "venues" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "name_abbr" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "tz_id" TEXT NOT NULL,
    "tz_name" TEXT,

    CONSTRAINT "venues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "runs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "dates" DATE[],
    "venueId" INTEGER NOT NULL,

    CONSTRAINT "runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shows" (
    "id" SERIAL NOT NULL,
    "runId" INTEGER NOT NULL,
    "runNight" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL,
    "venueId" INTEGER NOT NULL,

    CONSTRAINT "shows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guesses" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "songId" TEXT NOT NULL,
    "songName" TEXT NOT NULL,
    "showId" INTEGER NOT NULL,
    "runId" INTEGER NOT NULL,
    "encore" BOOLEAN NOT NULL DEFAULT false,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "points" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "guesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "songs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "averageGap" DOUBLE PRECISION NOT NULL,
    "points" DOUBLE PRECISION NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "songs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "runs" ADD CONSTRAINT "runs_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "venues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shows" ADD CONSTRAINT "shows_runId_fkey" FOREIGN KEY ("runId") REFERENCES "runs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shows" ADD CONSTRAINT "shows_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "venues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guesses" ADD CONSTRAINT "guesses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
