import express from "express"; // Serve para criar o servidor
import bodyParser from "body-parser"; // Faz o parser do body da requisição
import { dirname } from "path"; // Manipula os caminhos de arquivos
import { fileURLToPath } from "url"; // Converte a URL do arquivo para um caminho de arquivo
const __dirname = dirname(fileURLToPath(import.meta.url)); // Define o diretório atual do arquivo

// Cria o servidor Express
const app = express();
const port = 3000; // Define a porta do servidor

// Verifica se o usuário está autorizado
var userIsAuthorised = false;

// Faz o parser do body da requisição para que possamos acessar os dados enviados pelo formulário
app.use(bodyParser.urlencoded({ extended: true })); 

// Middleware para verificar a senha
function passwordCheck(req, res, next) {
  const password = req.body["password"];
  if (password === "EuAmoProgramar") {
    userIsAuthorised = true;
  }
  next();
}

app.use(passwordCheck);

// Serve arquivos estáticos da pasta "public"
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Rota para verificar a senha e redirecionar o usuário para a página secreta
app.post("/check", (req, res) => {
  if (userIsAuthorised) {
    res.sendFile(__dirname + "/public/secret.html");
  } else {
    res.sendFile(__dirname + "/public/index.html");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
