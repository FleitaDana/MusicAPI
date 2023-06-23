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
  }

    res.json(getTemaId)
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
    const deleteTema = await prisma.tema.delete({
      where: { id: Number(id) },
    })

    if (!deleteTema) {
      return res.status(404).json({ error: 'Tema no encontrado' });
    }

    res.json({ message: 'Artista eliminado', artista: deleteTema });
  } catch (error) {
    next(error);
}
}
  

export {getTema, getTemas, deleteTema}