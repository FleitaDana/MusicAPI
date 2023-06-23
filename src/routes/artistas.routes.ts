import { Router } from "express";
import { postArtista, getArtistas, getArtista, updateArtista, deleteArtista } from '../controllers/artistas.controller';

const router = Router();

router.get('/artistas', getArtistas); //Trae todos los artistas
router.get('/artista/:id', getArtista); //Trae un artista por su Id
router.post('/artista', postArtista); //Crea un nuevo artista 
router.put('/artista/:id', updateArtista); //Actualiza un artista por su Id
router.delete('/artista/:id', deleteArtista); //Borra un artista por su Id

export default router;