import express from 'express'; // Importando o Express


// Inicializando o Express
const app = express();
const port = 3000;


// Determina o que aparecerá escrito em nosso site criado com EJS
app.get('/', (req, res) => {
    const today = new Date();
    const day = today.getDay(); 

    let type = "dia da semana!";
    let advice = "É hora de trabalhar!";
    
    if (day === 0 || day === 6) { // 0 é domingo e 6 é sábado
        type = "fim de semana!";
        advice = "É hora de relaxar!";
    }

    res.render('index.ejs', {
        dayType: type,
        advice: advice
    });
});

// Faz o servidor Express escutar na porta definida
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
