import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";

const app = express();
const port = 3000;

env.config();

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect()
  .then(() => console.log("Connected to the database"))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checaRegistro = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (checaRegistro.rows.length > 0) {
      return res.send("User already exists. Try logging in.");
    } else {
    const result = await db.query(
    "INSERT INTO users (email, password) VALUES ($1, $2)",
    [email, password]
  );
  console.log(result);
  res.render("secrets.ejs");
  }
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send("Internal server error");
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
  const loginResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  if (loginResult.rows.length > 0) {
    const user = loginResult.rows[0];
    if (user.password === password) {
      res.render("secrets.ejs");
    } else {
      res.send("Invalid password. Please try again.");
    }
  } else {
    res.send("User not found. Please register.");
  }
} catch (error) {
  console.log(error);
  console.error("Error during login:", error);
  res.status(500).send("Internal server error");
}
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
