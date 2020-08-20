import "dotenv/config";
import express, { response } from "express";
import nunjucks from "nunjucks";
import sassMiddleware from "node-sass-middleware";
import {book_name, editBook, CheckInHistory, createNewUser} from "./querySelector"
import { title } from "process";
import {book_list} from "./querySelector"
import { request } from "http";
import {new_book} from "./querySelector"
import {book_removal} from "./querySelector"
import {delete_book} from "./querySelector"
import {copies_available} from "./querySelector"
import {userCheckOutBook} from "./querySelector"
import {CheckoutHistory} from "./querySelector"
import moment from "moment" 
import {UsersDisplay} from "./querySelector"
import {CheckedIn} from "./querySelector"


const app = express();
const port = process.env['PORT'] || 3000;
app.use (express.urlencoded({extended: true}));


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
const env = nunjucks.configure(PATH_TO_TEMPLATES, { 
    autoescape: true,
    express: app
});
env.addFilter("formatDate", (sqlDate : string)=>{
    return moment(sqlDate).format("Do MMM YYYY")
})

app.get("/", (req, res) => {
    const model = {
        message: "World"
    }
    res.render('index.html', model);

});

app.get("/book_list", async (req, res) => {
    const bookThing = await book_list()
    const model = {
        books: bookThing
    }
    res.render('bookTemplate.html', model);
    
});

app.get("/books/addbook", (request, response) => {
    response.render('addBook.html')
})
 
app.post("/books/addbook", async (request, response) =>{
    const book = request.body;
    await new_book(book);
    response.redirect("/book_list")
})

app.get("/book/:name", async (request, response) => {
    const name = request.params.name;
    const sqlResult = await book_name(name);
    response.json(sqlResult);
})

app.get("/books/remove",(request, response) => {
    response.render('removalPage.html');
})

app.post("/books/remove", async (request, response) =>{
    const removal = request.body;
    await delete_book(removal.id);
    await book_removal(removal.id);
    
    response.redirect('/book_list');
})

app.get("/books/copies", async(request, response) =>{
    const copiesThing = await copies_available()
    const maneken = {
           copies_of_books : copiesThing
    }
    response.render('bookCopies.html', maneken)
})

app.get("/books/edit-book", async(request, response)=>{
    return(
        response.render('editbook.html')
    )
})
app.post("/books/edit-book", async(request,response)=>{
    const changeBook = request.body;
    await editBook(changeBook)
    response.redirect('/book_list')
})


app.post("/books/checkout-book", async (request, response)=>{
    const userID= request.body.user_id;
    const copyID= request.body.copy_id;
    await userCheckOutBook(userID, copyID);
    response.redirect('/books/checkout-book')
})

app.get("/books/checkout-book", async (request, response)=>{
    const chekoutThing = await CheckoutHistory()
    const moda = {
        check_out_history : chekoutThing
    }
    return(
        response.render('checkoutBook.html', moda)
    )
})

app.get("/users", async (request, response) => {
    const userThing = await UsersDisplay()
    const modelis = {
        library_user : userThing
    }
    return(
        response.render('users.html', modelis)
    )
})

app.get("/users/newuser", async(request, response)=>{
    return(
        response.render('newUser.html')
    )
})

app.post("users/newuser", async(request, response)=>{
    const user_name= request.body.user_name;
    const phone_number= request.body.phone_number;
    const email = request.body.email;
    const address = request.body.address
    await createNewUser(user_name,phone_number,email,address);
    response.send('new user created')

})


app.get("/books/checkin-book", async (request, response)=>{
    const chekoutThing = await CheckInHistory()
    const moda = {
        check_out_history : chekoutThing
    }
    return(
        response.render('checkinpage.html', moda)
    )
})

app.post("/books/checkin-book", async (request, response)=>{
    const userID= request.body.user_id;
    const copyID= request.body.copy_id;
    await CheckedIn(userID, copyID);
    response.redirect('/books/checkout-book')
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
});
