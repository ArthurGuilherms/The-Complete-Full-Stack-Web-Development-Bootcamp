import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/piada", (req, res) => {
  res.send("<h3>Porque o programador começou a gaguejar? Porque a fala dele entrou em loop infinito!</h3>");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
