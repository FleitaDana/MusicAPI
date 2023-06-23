import { Router } from "express";
import { getPublicacion, postPublicacion, deletePublicacion, getPublicaciones } from '../controllers/publicaciones.controller';

const router = Router();

router.get('/publicacion/:id', getPublicacion); //Trae un publicacion por su Id
router.post('/publicacion', postPublicacion); //Crea un publicacion
router.delete('/publicacion/:id', deletePublicacion); //Eliminar una publicacion por su Id

//Extra
router.get('/publicaciones', getPublicaciones); //Trae todas la publicaciones


export default router;