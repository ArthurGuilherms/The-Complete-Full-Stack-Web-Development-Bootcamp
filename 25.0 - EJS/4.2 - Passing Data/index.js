import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.render("index.ejs", { title: "Enter your name below" });
});

app.post("/submit", (req, res) => {
  console.log("Your name is:", req.body.fName, req.body.lName);
  res.render("index.ejs", { title: "Your name has " + (req.body.fName.length + req.body.lName.length) + " characters", name: req.body.fName, lastName: req.body.lName });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
