import { Request, Response } from "express"

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

//Consultas requeridas

const getPublicacion = async (req: Request, res: Response) => { //Trae una publicacion por su id + cantidad de temas + duracion total del disco
    const { id } = req.params;

    const publicacion = await prisma.publicacion.findUnique({ //Buscamos la publicacion
        where: { id: Number(id) },
        include: {
            temas: true,
        },
    });

    if (publicacion === null) {
        // Manejamos el caso cuando la publicación no existe
        res.status(404).json({ error: 'La publicación no fue encontrada' });
        return;
    }

    const cantidadTemas = publicacion.temas.length; //Calculamos cantidad de temas
    const duracionTotal = publicacion.temas.reduce((total, tema) => total + tema.duracion, 0); //Con la funcion reduce, calculamos el tiempo total de los temas sumados

    const publicacionConDatos = { //Creamos un nuevo objeto con los datos que deseamos mostrar
        ...publicacion,
        cantidad_temas: cantidadTemas,
        duracion_total: duracionTotal,
    };

    res.json(publicacionConDatos);
}


const postPublicacion = async (req: Request, res: Response) => { //Crea una publicacion con sus temas
    const { artista_id, tipo, nombre, fecha_de_publicacion, temas } = req.body;

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

/* const deletePublicacion = async (req: Request, res: Response) => {//Elimina una publicacion por su Id
    const { id } = req.params
    const deletePublicacion = await prisma.publicacion.delete({
        where: { id: Number(id) },
    })
    res.json(deletePublicacion)
} */


const deletePublicacion = async (req: Request, res: Response)  => {
    const publicacionId = parseInt(req.params.publicacion_id);
    const { id } = req.params

    try {
      // Borramos los temas asociados a la publicación
      await prisma.tema.deleteMany({
        where: { id: Number(id) },
      });
  
      // Borramos la publicación
      await prisma.publicacion.delete({
        where: { id: Number(id) },
      });
      
      res.sendStatus(204); // Respuesta exitosa sin contenido
    } catch (error) {
      console.error('Error al borrar la publicación:', error);
      res.sendStatus(500); // Error interno del servidor
    }
  }


//Consultas extras

const getPublicaciones = async (req: Request, res: Response) => {//Trae todos las publicaciones
    const publicaciones = await prisma.publicacion.findMany()
    res.json(publicaciones)
}


export { getPublicacion, postPublicacion, deletePublicacion, getPublicaciones}