import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url)); // Descobre o diretório atual
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/submit", (req, res) => {
  const { street, pet } = req.body;
  console.log(`Band name: ${street} ${pet}`);
  res.send("Form submitted successfully!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
