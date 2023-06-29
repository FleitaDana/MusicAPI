import { Request, Response, NextFunction } from "express"

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

//Consultas requeridas

const getPublicacion = async (req: Request, res: Response, next: NextFunction) => { //Trae una publicacion por su id + cantidad de temas + duracion total del disco

    try {
        const { id } = req.params;
        const publicacion = await prisma.publicacion.findUnique({ //Buscamos la publicacion
            where: { id: Number(id) },
            include: {
                temas: true,
            },
        });

        if (!publicacion) {
            return res.status(404).json({ error: 'La publicación no fue encontrada' });
        } else {

            const cantidadTemas = publicacion.temas.length; //Calculamos cantidad de temas
            const duracionTotal = publicacion.temas.reduce((total, tema) => total + tema.duracion, 0); //Con la funcion reduce, calculamos el tiempo total de los temas sumados

            const publicacionConDatos = { //Creamos un nuevo objeto con los datos que deseamos mostrar
                ...publicacion,
                cantidad_temas: cantidadTemas,
                duracion_total: duracionTotal,
            };
            res.json(publicacionConDatos);
        }
    } catch (error) {
        next(error);
    }
}


const postPublicacion = async (req: Request, res: Response, next: NextFunction) => { //Crea una publicacion con sus temas
    try {
        const { artista_id, tipo, nombre, fecha_de_publicacion, temas } = req.body;
        const trimmedNombre = nombre.trim();

        // Validación de datos requeridos

        if (!artista_id) {
            return res.status(400).json({ error: 'Se requiere el id del artista para la creacion de la publicacion' });
        }

        if (!nombre) {
            return res.status(400).json({ error: 'Se requiere el nombre de la publicacion para su creacion'});
        }

        if (!trimmedNombre) {
            return res.status(400).json({ error: 'Se requiere el nombre de la publicacion para su creacion'});
        }

        if (!tipo) {
            return res.status(400).json({ error: 'Se requiere el tipo de la publicacion para su creacion' });
        }

        if (!fecha_de_publicacion) {
            return res.status(400).json({ error: 'Se requiere la fecha de publicacion de la publicacion para su creacion' });
        }

        if (!temas) {
            return res.status(400).json({ error: 'Se requieren el/los temas de la publicacion para su creacion' });
        }

        // Verificamos existencia del artista
        const artistaExistente = await prisma.artista.findUnique({
            where: {
                id: artista_id,
            },
        });

        if (!artistaExistente) {
            return res.status(400).json({ error: 'El ID del artista proporcionado no existe. Por favor, ingrese un ID de artista válido.' });
        } else {

        const publicacion = await prisma.publicacion.create({
            data: {
                artista_id,
                tipo,
                nombre,
                fecha_de_publicacion,
                temas: {
                    create: temas.map((tema: any, indice: number) => ({
                        indice: indice + 1,
                        duracion: tema.duracion,
                    })),
                },
            },
            include: {
                temas: true,
            },
        });

        res.json(publicacion);
    }
    } catch (error) {
        next(error);
    }
}

/* const deletePublicacion = async (req: Request, res: Response) => {//Elimina una publicacion por su Id
    const { id } = req.params
    const deletePublicacion = await prisma.publicacion.delete({
        where: { id: Number(id) },
    })
    res.json(deletePublicacion)
} */

const deletePublicacion = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const { id } = req.params

        const publicacionExistente = await prisma.publicacion.findUnique({
            where: { id: Number(id) },
          });
      
          if (!publicacionExistente) {
            return res.status(400).json({ error: 'El ID de la publicacion proporcionado no existe. Por favor, ingrese un ID válido.' });
          }else{

        // Borramos los temas asociados a la publicación
        const deleteTema = await prisma.tema.deleteMany({
            where: { id: Number(id) },
        });

        // Borramos la publicación
        const deletePublicacion = await prisma.publicacion.delete({
            where: { id: Number(id) },
        });

        res.json({ message: 'Publicacion eliminada', publicacion: deletePublicacion });
    }
    } catch (error) {
        next(error);
    }
}


//Consultas extras

const getPublicaciones = async (req: Request, res: Response) => {//Trae todos las publicaciones
    const publicaciones = await prisma.publicacion.findMany()
    res.json(publicaciones)
}

export { getPublicacion, postPublicacion, deletePublicacion, getPublicaciones }