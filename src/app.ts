import "dotenv/config";
import express from "express";
import nunjucks from "nunjucks";
import sassMiddleware from "node-sass-middleware";

const app = express();
const port = process.env['PORT'] || 3000;

const srcPath = __dirname + "/../stylesheets";
const destPath = __dirname + "/../public";
app.use(
    sassMiddleware({
        src: srcPath,
        dest: destPath,
        debug: true,
        outputStyle: 'compressed',
        prefix: '',
    }),
    express.static('public')
);

const PATH_TO_TEMPLATES = "./templates/";
nunjucks.configure(PATH_TO_TEMPLATES, { 
    autoescape: true,
    express: app
});

app.get("/", (req, res) => {
    const model = {
        message: "World"
    }
    res.render('index.html', model);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
});
