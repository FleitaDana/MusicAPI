-- CreateEnum
CREATE TYPE "Type" AS ENUM ('ALBUM', 'EP', 'SINGLE', 'COMPILATION');

-- CreateTable
CREATE TABLE "Artista" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Artista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publicacion" (
    "id" SERIAL NOT NULL,
    "artista_id" INTEGER NOT NULL,
    "tipo" "Type" NOT NULL,
    "nombre" TEXT NOT NULL,
    "fecha_de_publicacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Publicacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tema" (
    "id" SERIAL NOT NULL,
    "publicacion_id" INTEGER NOT NULL,
    "indice" INTEGER NOT NULL,
    "duracion" INTEGER NOT NULL,

    CONSTRAINT "Tema_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Publicacion" ADD CONSTRAINT "Publicacion_artista_id_fkey" FOREIGN KEY ("artista_id") REFERENCES "Artista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tema" ADD CONSTRAINT "Tema_publicacion_id_fkey" FOREIGN KEY ("publicacion_id") REFERENCES "Publicacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
