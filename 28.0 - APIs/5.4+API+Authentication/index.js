import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/";

//TODO 1: Fill in your values for the 3 types of auth.
const yourUsername = "ArthurGuilherme";
const yourPassword = "Senha.123";
const yourAPIKey = "839f76ef-632c-4172-bb2f-3f5c60f23554";
const yourBearerToken = "bc3ff23e-9679-4e9f-846b-35ad9f585e9c";

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", async (req, res) => {
  let content = await axios.get(`https://secrets-api.appbrewery.com/random`);
  res.render("index.ejs", { content: JSON.stringify(content.data) });
});

app.get("/basicAuth", async (req, res) => {
  let content = await axios.get(`https://secrets-api.appbrewery.com/all?page=2`, {
    auth: {
      username : yourUsername,
      password : yourPassword,
    }
  });
  res.render("index.ejs", { content: JSON.stringify(content.data) });
});

app.get("/apiKey", async (req, res) => {
  let content = await axios.get(`https://secrets-api.appbrewery.com/filter?score=5&apiKey=${yourAPIKey}`, {
    auth: {
      username : yourUsername,
      password : yourPassword,
    }
  });
  res.render("index.ejs", { content: JSON.stringify(content.data) });
});


app.get("/bearerToken", async (req, res) => {
  let content = await axios.get(`https://secrets-api.appbrewery.com/secrets/42`, {
    headers: {
      Authorization: `Bearer ${yourBearerToken}`
    }
  });
  res.render("index.ejs", { content: JSON.stringify(content.data) });
});
  //TODO 5: Write your code here to hit up the /secrets/{id} endpoint
  //and get the secret with id of 42
  //HINT: This is how you can use axios to do bearer token auth:
  // https://stackoverflow.com/a/52645402
  /*
  axios.get(URL, {
    headers: { 
      Authorization: `Bearer <YOUR TOKEN HERE>` 
    },
  });
  */

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
