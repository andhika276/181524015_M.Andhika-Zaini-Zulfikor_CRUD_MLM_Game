const cors = require ('cors')
const express = require ('express')
const {Client} = require ('pg')

const app = express()
const port = 8000

const connection = "postgressql://postgres:pasword@localhost:5432/bakastorage"

const client = new Client({
    connectionString: connection
})
client.connect()

app.use(express.json())
app.use(cors())
app.listen(port, ()=>{
    console.log (`app listening at http://localhost:${port}`)
})

//===============USER BACKEND================
app.get('/api/berita/', async (req,res)=>{
    const berita = await getAllBerita()
    res.send(await berita.rows)
})

app.post('/api/berita/', async (req, res)=>{
    const judul_berita = req.body.judul_berita
    const konten = req.body.konten
    const kategori = req.body.kategori

    await insertBerita(judul_berita, konten, kategori)
    res.status(201).send
})

app.delete ('/api/berita/:id', async (req, res)=>{
    await deleteBerita(req.params.id)
    res.status(200).send()
})

app.put('/api/berita/:id', async (req, res)=>{
    const id = req.params.id
    const judul_berita = req.body.judul_berita
    const konten = req.body.konten
    const kategori = req.body.kategori

    await updateBerita(id,judul_berita, konten, kategori)
    res.status(204).send
})

//==============USER FUNCTION================

async function getAllBerita(){
    const result = await client.query('SELECT * FROM public.berita')
    return result
}

async function insertBerita(judul_berita, konten, kategori){
    client.query(`INSERT INTO public.berita(id,judul_berita, konten, kategori)
    VALUES ((SELECT MAX(id)+1 FROM berita),$1, $2, $3)`, [judul_berita, konten, kategori])
}

async function deleteBerita(id){
    client.query('DELETE FROM public.berita WHERE id = $1', [id])
}

async function updateBerita(id,judul_berita, konten, kategori){
    client.query(`UPDATE public.berita SET judul_berita = $2, konten = $3, kategori = $4
                    WHERE id = $1`, [id, judul_berita, konten, kategori])
}

