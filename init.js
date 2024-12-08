const mongoose = require("mongoose");
const Book = require("./models/book.js");
const User = require("./models/user.js");

const books = [
    {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        published_year: 1960,
        genre: "Fiction",
        available_copies: 5,
    },
    {
        title: "1984",
        author: "George Orwell",
        published_year: 1949,
        genre: "Dystopian",
        available_copies: 3,
    },
    {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        published_year: 1925,
        genre: "Classic",
        available_copies: 2,
    },
    {
        title: "Moby Dick",
        author: "Herman Melville",
        published_year: 1851,
        genre: "Adventure",
        available_copies: 4,
    },
    {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        published_year: 1813,
        genre: "Romance",
        available_copies: 6,
    },
];

const users = [
    {
        name: "Alice Johnson",
        email: "alice@example.com",
        membership_type: "Premium",
        registered_date: "2023-11-01",
        borrowed_books: [],
    },
    {
        name: "Bob Smith",
        email: "bob@example.com",
        membership_type: "Regular",
        registered_date: "2024-01-15",
        borrowed_books: [],
    },
    {
        name: "Charlie Davis",
        email: "charlie@example.com",
        membership_type: "Premium",
        registered_date: "2024-02-20",
        borrowed_books: [],
    },
    {
        name: "Diana Evans",
        email: "diana@example.com",
        membership_type: "Regular",
        registered_date: "2024-03-05",
        borrowed_books: [],
    },
    {
        name: "Ethan White",
        email: "ethan@example.com",
        membership_type: "Premium",
        registered_date: "2024-04-10",
        borrowed_books: [],
    },
];

main()
    .then(() => {
        console.log("Connected to Database");
    })
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/library");
}

const initDB = async () => {
    await User.deleteMany({});
    await User.insertMany(users);
    await Book.deleteMany({});
    await Book.insertMany(books);
    console.log("Data was Initialised");
};

initDB();
