import { Router } from "express";
import { getTema, getTemas, deleteTema} from '../controllers/temas.controller';

const router = Router();

router.get('/tema/:id', getTema);

//Extra

router.get('/temas', getTemas);
router.delete('/tema/:id', deleteTema);

export default router;