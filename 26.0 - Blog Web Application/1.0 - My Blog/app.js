//Criando o servidor com Express e EJS
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

// Modulo para adicionar imagens
import multer from "multer";

// Configuração do multer para armazenar imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads"); // Pasta onde as imagens serão armazenadas
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Adiciona timestamp ao nome do arquivo
  }
});

const upload = multer({ storage: storage });

const app = express();
const port = 3000;

app.use(express.static("public"));


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configura EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware para interpretar formulários
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//Lista para armazenar os posts
let posts = [];

// Rota principal
app.get("/", (req, res) => {
  res.render("index", { posts });
});

// Rota para adicionar um novo post
app.get("/novo", (req, res) => {
  res.render("post"); // mostra o formulário
});


app.post("/novo", upload.single("imagem"), (req, res) => {
  const { titulo, conteudo } = req.body;

  if (titulo && conteudo && req.file) {
    const imagem = "/uploads/" + req.file.filename;
    const id = Date.now().toString(); // Gera um id único simples

    posts.push({ id, titulo, conteudo, imagem });

    res.redirect("/");
  } else {
    res.render("post", { error: "Título, conteúdo e imagem são obrigatórios." });
  }
});

app.get("/editar/:id", (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  
  if (post) {
    res.render("editar", { post });
  } else {
    res.status(404).send("Postagem não encontrada para edição.");
  }
});

app.post("/editar/:id", (req, res) => {
  const { titulo, conteudo } = req.body;
  const post = posts.find(p => p.id === req.params.id);

  if (post && titulo && conteudo) {
    post.titulo = titulo;
    post.conteudo = conteudo;
    res.redirect("/postagem/" + post.id);
  } else {
    res.status(400).send("Erro ao editar a postagem.");
  }
});

app.post("/apagar/:id", (req, res) => {
  const id = req.params.id;
  const index = posts.findIndex(p => p.id === id);

  if (index !== -1) {
    posts.splice(index, 1); // Remove o post da lista
  }

  res.redirect("/");
});

app.get("/postagem/:id", (req, res) => {
  const post = posts.find(p => p.id === req.params.id);

  if (post) {
    res.render("postagem", { post });
  } else {
    res.status(404).send("Postagem não encontrada.");
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
