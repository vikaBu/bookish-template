import "dotenv/config";
import express from "express";
import nunjucks from "nunjucks";

const app = express();
const port = process.env['PORT'] || 3000;

const PATH_TO_TEMPLATES = "./src/templates/";
nunjucks.configure(PATH_TO_TEMPLATES, { 
    autoescape: true,
    express: app
});

app.get("/", (req, res) => {
    const model = {
        message: process.env['SECRET_VALUE']
    }
    res.render('index.html', model);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
});
