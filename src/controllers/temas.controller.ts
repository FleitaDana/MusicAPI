import { Request, Response, NextFunction } from "express"

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

//Consultas requeridas

const getTema = async (req: Request, res: Response, next: NextFunction) => {//Trae un tema por su Id
  try {
    const { id } = req.params
    const getTemaId = await prisma.tema.findUnique({
      where: { id: Number(id) },
    })

    if (!getTemaId) {
      return res.status(404).json({ error: 'Tema no encontrado' });
    } else {
      res.json(getTemaId)
    }
  } catch (error) {
    next(error);
  }
};

//Extras

const getTemas = async (req: Request, res: Response, next: NextFunction) => { //Trae todos los temas
  try {
    const temas = await prisma.tema.findMany()
    res.json(temas)
  } catch (error) {
    next(error);
  }
};


const deleteTema = async (req: Request, res: Response, next: NextFunction) => { //Elimina un tema por su ID
  try {
    const { id } = req.params

    const temaExistente = await prisma.tema.findUnique({
      where: { id: Number(id) },
    });

    if (!temaExistente) {
      return res.status(400).json({ error: 'El ID del tema proporcionado no existe. Por favor, ingrese un ID de tema válido.' });
    
    } else {
      const deleteTema = await prisma.tema.delete({
        where: { id: Number(id) },
      })

      res.json({ message: 'Tema eliminado', tema: deleteTema });
    }
  } catch (error) {
    next(error);
  }
}

export { getTema, getTemas, deleteTema }