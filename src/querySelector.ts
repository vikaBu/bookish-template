import Knex from "knex";
import { title } from "process";
import moment from "moment" 


// create new client {configuration}\dt

const client = Knex({
    client: 'pg',
    connection: {
        user: "postgres",
        host: "localhost",
        database: "bookish",
        password: process.env.POSTGRES_PASSWORD,
    }
});


export const book_name = ( title: string) => {
    return client('books')
        .select()
        .where('title', 'like', `%${title}%`)
}

export const book_list = () => {
    return client('books')
        .select() 
};

interface Book {
    title : string;
    author: string;
    genre: string;
    release: number;
}

export const new_book = (book : Book ) => {
    return client.insert({title: book.title , author: book.author, genre: book.genre, release: book.release }).into("books")  
}

export const book_removal = (id : number) => {
    console.log(id)
    return client('books')
    .delete()
    .where ('id', id)
    
}

export const delete_book = (id : number) =>{
    return client ('copies_of_books')
    .delete()
    .where ('book_id', id)
}

export const copies_available = () => {
    return client('copies_of_books')
        .select('copies_of_books.id', 'copies_of_books.book_id', 'books.title' ) 
        .join('books', 'copies_of_books.book_id', 'books.id')
    
}
interface editBook{
    id: number;
    newtitle: string;
    newauthor: string;
    newgenre: string;
    newrelease : number;
}
export const editBook = (book : editBook) => {
    return client('books')
    .where('id', book.id)
    .update({title: book.newtitle, author: book.newauthor, genre: book.newgenre, release: book.newrelease})
}

export const userCheckOutBook = (user_id: number, copy_id: number) => {
    return client('check_out_history')
    .insert({
        user_id: user_id,
        copy_id: copy_id,
        checked_out_date: client.fn.now(),
        return_date: client.raw("now() + interval '7 days'")

    })
}
export const CheckoutHistory = () => { 
    return client('check_out_history')
    .select()
}

export const CheckInHistory = () => { 
    return client('check_out_history')
    .select()
}
export const CheckedIn = (user_id : number, copy_id: number ) => { 
    return client('check_out_history')
    .select()
    .insert({
        user_id: user_id,
        copy_id : copy_id,
        checked_in_date: client.fn.now(),
    })
}

export const UsersDisplay = () => {
    return client ('library_user')
    .select()
}

export const createNewUser = (user_name: string, phone_number: number, email: string, address:string) => {
    return client('library_user')
    .insert({
        user_name: user_name,
        phone_number: phone_number,
        email : email,
        address: address,
    })
}