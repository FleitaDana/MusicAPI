import express, { NextFunction, Request, Response } from 'express'

import artistasRoutes from './routes/artistas.routes';
import publicacionesRoutes from './routes/publicaciones.routes';
import temasRoutes from './routes/temas.routes';

const app = express() //Creamos app express llamando a express()

app.use(express.json()) //llamamos a express.json() para poder leer los json de manera correcta

app.use("/api", artistasRoutes);
app.use("/api", publicacionesRoutes);
app.use("/api", temasRoutes);

app.use((req: Request, res: Response) => { //Controlamos el error cuando ingresamos una ruta que no esta definida
  res.status(404).json({ error: "Ruta inexistente" });
});

app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err); // Opcional: imprimir el error en la consola
  // Manejo del error
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(3000, () =>
  console.log('REST API server ready at: http://localhost:3000'),
)

 