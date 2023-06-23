import { PrismaClient } from '@prisma/client' //PrismaClient es el constructor 
import express from 'express'

const prisma = new PrismaClient() //Creamos instancia de PrismaClient

const app = express() //Creamos app express llamando a express()

app.use(express.json()) //llamamos a express.json() para poder leer los json de manera correcta

// CONSULTAS DE PRACTICA

/* app.get('/users', async (req, res) => { //Trae todos los usuarios
  const users = await prisma.user.findMany()
  res.json(users)
})

app.get('/feed', async (req, res) => { //Obtiene todas las publicaciones publicadas
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true }
  })
  res.json(posts)
})

app.get(`/post/:id`, async (req, res) => { //Obtiene una publicación específica por su ID
  const { id } = req.params
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  })
  res.json(post)
})

app.post(`/user`, async (req, res) => { //Crea un nuevo usuario
  const result = await prisma.user.create({
    data: { ...req.body },
  })
  res.json(result)
})

app.post(`/post`, async (req, res) => { //Crea una nueva publicación (como borrador )
  const { title, content, authorEmail } = req.body
  const result = await prisma.post.create({
    data: {
      title,
      content,
      published: false,
      author: { connect: { email: authorEmail } },
    },
  })
  res.json(result)
})

app.put('/post/publish/:id', async (req, res) => { //Establece el publishedcampo de una publicación en true
  const { id } = req.params
  const post = await prisma.post.update({
    where: { id: Number(id) },
    data: { published: true },
  })
  res.json(post)
})

app.delete(`/post/:id`, async (req, res) => { //Elimina una publicación por su ID
  const { id } = req.params
  const post = await prisma.post.delete({
    where: { id: Number(id) },
  })
  res.json(post)
})
 */


//CONSULTAS DE MUSIC API

app.post(`/artista`, async (req, res) => { //Crea un nuevo artista
  const artista = await prisma.artista.create({
    data: { ...req.body },
  })
  res.json(artista)
})

app.get('/artistas', async (req, res) => { //Trae todos los artistas
  const artistas = await prisma.artista.findMany()
  res.json(artistas)
})

app.get('/artista/:id', async (req, res) => { //Trae un artista por su id ordenando sus publicaciones por fecha de publicacion
  const { id } = req.params;

  const getArtistaId = await prisma.artista.findUnique({
    where: { id: Number(id) },
    include: {
      publicaciones: {
        orderBy: { fecha_de_publicacion: 'asc' },
      },
    },
  });

  res.json(getArtistaId);
});


/* app.post(`/publicacion`, async (req, res) => { //Crea una nueva publicacion
  const publicacion = await prisma.publicacion.create({
    data: { ...req.body },
  })
  res.json(publicacion)
})
 */

app.put('/artista/:id', async (req, res) => { //Actualiza datos de un artista
  const { id } = req.params
  const updateArtista = await prisma.artista.update({
    where: { id: Number(id) },
    data: {...req.body}
  })
  res.json(updateArtista )
})

app.delete(`/artista/:id`, async (req, res) => { //Elimina un artista por su ID
  const { id } = req.params
  const deleteArtista = await prisma.artista.delete({
    where: { id: Number(id) },
  })
  res.json(deleteArtista)
})

app.delete(`/publicacion/:id`, async (req, res) => { //Elimina una publicacion por su Id
  const { id } = req.params
  const deletePublicacion = await prisma.publicacion.delete({
    where: { id: Number(id) },
  })
  res.json(deletePublicacion)
})

app.get('/publicaciones', async (req, res) => { //Trae todos las publicaciones
  const publicaciones = await prisma.publicacion.findMany()
  res.json(publicaciones)
}) 

app.post('/publicacion', async (req, res) => {
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
});



app.get('/publicacion/:id', async (req, res) => { //Trae una publicacion por su id + cantidad de temas + duracion total del disco
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
});



app.get('/tema/:id', async (req, res) => { //Trae un tema por su id 
  const { id } = req.params 
  const getTemaId = await prisma.tema.findUnique({
    where: { id: Number(id) },
  })
  res.json(getTemaId)
})

app.get('/temas', async (req, res) => { //Trae todos los artistas
  const temas = await prisma.tema.findMany()
  res.json(temas)
})

app.delete(`/tema/:id`, async (req, res) => { //Elimina un tema por su ID
  const { id } = req.params
  const deleteTema = await prisma.tema.delete({
    where: { id: Number(id) },
  })
  res.json(deleteTema)
})


app.listen(3000, () =>
  console.log('REST API server ready at: http://localhost:3000'),
)

/* import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() { //Aca se agregan las consultas
    const newUser = await prisma.user.create({
        data: {
          name: 'Alice',
          email: 'alice@prisma.io',
          posts: {
            create: {
              title: 'Hello World',
            },
          },
        },
      })
      console.log('Created new user: ', newUser)
    
      const allUsers = await prisma.user.findMany({
        include: { posts: true },
      })
      console.log('All users: ')
      console.dir(allUsers, { depth: null })
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect()) */