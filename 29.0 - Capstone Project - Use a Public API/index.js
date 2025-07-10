import express from "express";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from dotenv;

dotenv.config();
const app = express();
const PORT = 3000;

// Corrigir __dirname com ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração da view engine e views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Pasta pública para arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  try {
    // Data de 24 horas atrás
    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);
    const startTime = ontem.toISOString().split("T")[0];

    // Consulta à API USGS para terremotos nas últimas 24h
    const { data } = await axios.get(`https://earthquake.usgs.gov/fdsnws/event/1/query`, {
      params: {
        format: "geojson",
        starttime: startTime,
      }
    });

    // Filtra terremotos de magnitude >= 4.0 e mapeia dados relevantes
    const terremotos = data.features
      .filter(item => item.properties.mag >= 4.8)
      .map(item => {
        const [lng, lat] = item.geometry.coordinates;
        return {
          lugar: item.properties.place,
          magnitude: item.properties.mag,
          data: item.properties.time,
          detalhes: item.properties.title,
          lat,
          lng,
        };
      });

    // Renderiza a view passando os dados e a API key do Google Maps
    res.render("index", {
      terremotos,
      apiKey:  process.env.GOOGLE_MAPS_API_KEY
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao carregar dados");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando: http://localhost:${PORT}`);
});
