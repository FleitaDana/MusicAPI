import { NextFunction, Request, Response } from "express"

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

//Consultas requeridas

const postArtista = async (req: Request, res: Response, next: NextFunction) => {//Crea un nuevo artista
    try {
        const { nombre } = req.body;
        const trimmedNombre = nombre.trim(); //Controlamos los espacios vacion antes y despues del nombre ingresado o si se ingresa " "

        if (!nombre) {
            return res.status(400).json({ error: 'Se requiere el nombre del artista para su creacion' });
        }

        if (!trimmedNombre) {
            return res.status(400).json({ error: 'El nombre del artista es requerido' });
        }

        const artista = await prisma.artista.create({
            data: { ...req.body },
        });

        res.json(artista);
    } catch (error) {
        next(error);
    }
};


const getArtistas = async (req: Request, res: Response, next: NextFunction) => { //Trae todos los artistas
    try {
        const artistas = await prisma.artista.findMany()
        res.json(artistas)
    } catch (error) {
        next(error);
    }
};


const getArtista = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const getArtistaId = await prisma.artista.findUnique({
            where: { id: Number(id) },
            include: {
                publicaciones: {
                    orderBy: { fecha_de_publicacion: 'asc' },
                },
            },
        });

        if (!getArtistaId) {
            return res.status(404).json({ error: 'Artista no encontrado' });
        }

        res.json(getArtistaId);
    } catch (error) {
        next(error);
    }
};


const updateArtista = async (req: Request, res: Response, next: NextFunction) => {//Actualiza datos de un artista

    try {

        const { nombre } = req.body;
        const trimmedNombre = nombre.trim(); //Controlamos los espacios vacion antes y despues del nombre ingresado

        if (!nombre) {
            return res.status(400).json({ error: 'Se requiere el nombre del artista para actualizarlo' });
        }

        if (!trimmedNombre) {
            return res.status(400).json({ error: 'El nombre del artista es requerido para actualizarlo' });
        }

        const { id } = req.params

        const updateArtista = await prisma.artista.update({  //FIJARSE SI DEVUELVE EL 404
            where: { id: Number(id) },
            data: { ...req.body }
        })

        if (!updateArtista) {
            return res.status(404).json({ error: 'Artista no encontrado' });
        }


        res.json({ message: 'Artista actualizado', artista: updateArtista });
    } catch (error) {
        next(error);
    }
};


const deleteArtista = async (req: Request, res: Response, next: NextFunction) => { //Elimina un artista por su ID

    try {
        const { id } = req.params
        const deleteArtista = await prisma.artista.delete({
            where: { id: Number(id) },
        })

        if (!deleteArtista) {
            return res.status(404).json({ error: 'Artista no encontrado' });
        }

        res.json({ message: 'Artista eliminado', artista: deleteArtista });
    } catch (error) {
        next(error);
    }
};


export { postArtista, getArtistas, getArtista, updateArtista, deleteArtista }