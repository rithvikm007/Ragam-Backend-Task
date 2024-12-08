const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const User = require("./models/user.js");
const Book = require("./models/book.js");
const methodOverride = require("method-override");
const { accessSync } = require("fs");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const port = 8080;

main()
    .then(() => {
        console.log("Connected to Database");
    })
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/library");
}

//Main Route
app.get("/", (req, res) => {
    res.render("mainindex.ejs");
});

//Users Index Route
app.get("/users", async (req, res, next) => {
    try {
        const users = await User.find();
        res.render("users/index.ejs", { users });
    } catch (err) {
        next(err);
    }
});

//Users New Route
app.get("/users/new", (req, res, next) => {
    try {
        res.render("users/new.ejs");
    } catch (err) {
        next(err);
    }
});

//Users Create Route
app.post("/users", async (req, res, next) => {
    try {
        let { name, email, membership_type } = req.body;
        let user = new User({
            name,
            email,
            membership_type,
            registered_date: new Date(),
        });
        await user.save();
        res.redirect("/users");
    } catch (err) {
        next(err);
    }
});

//Users Show Route
app.get("/users/:id", async (req, res, next) => {
    try {
        let { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid User ID");
        }
        const user = await User.findById(id).populate("borrowed_books");
        if (!user) {
            throw new Error("User Not Found");
        }
        const books = await Book.find();
        res.render("users/show.ejs", { user, books });
    } catch (err) {
        next(err);
    }
});

//Users Edit Route
app.get("/users/:id/edit", async (req, res, next) => {
    try {
        let { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            throw new Error("User Not Found");
        }
        res.render("users/edit.ejs", { user });
    } catch (err) {
        next(err);
    }
});

//Users Borrow Book
app.get("/users/:id/borrow", async (req, res, next) => {
    try {
        let { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            throw new Error("User Not Found");
        }
        const books = await Book.find();
        res.render("users/borrow.ejs", { user, books });
    } catch (err) {
        next(err);
    }
});

//Users Borrow Book Add
app.post("/users/:id", async (req, res, next) => {
    try {
        let { id } = req.params;
        let { book_id } = req.body;
        const book = await Book.findById(book_id);
        if (!book) {
            throw new Error("Book Not Found");
        }
        if (book.available_copies <= 0) {
            throw new Error("No Copies Available");
        }
        book.available_copies -= 1;
        await book.save();
        await User.findByIdAndUpdate(
            id,
            { $push: { borrowed_books: book_id } },
            { new: true, runValidators: true }
        );
        res.redirect(`/users/${id}`);
    } catch (err) {
        next(err);
    }
});

//Users Book Delete
app.delete("/users/:id", async (req, res, next) => {
    try {
        let { id } = req.params;
        let { book_id, book_index } = req.body;
        const book = await Book.findById(book_id);
        if (!book) {
            throw new Error("Book Not Found");
        }
        book.available_copies += 1;
        await book.save();
        const user = await User.findById(id);
        if (!user) {
            throw new Error("User Not Found");
        }
        user.borrowed_books.splice(book_index, 1);
        await user.save();
        res.redirect(`/users/${id}`);
    } catch (err) {
        next(err);
    }
});

//Users Update Route
app.put("/users/:id", async (req, res, next) => {
    try {
        let { id } = req.params;
        let { name, email, membership_type } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, email, membership_type },
            { runValidators: true, new: true }
        );
        if (!updatedUser) {
            throw new Error("User Not Found");
        }
        res.redirect("/users");
    } catch (err) {
        next(err);
    }
});

//Users Delete Route
app.delete("/users", async (req, res, next) => {
    try {
        let { user_id: id } = req.body;
        console.log("Deleting user with ID:", id);
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            throw new Error("User Not Found");
        }
        res.redirect("/users");
    } catch (err) {
        next(err);
    }
});

//Books Index Route
app.get("/books", async (req, res, next) => {
    try {
        const books = await Book.find();
        res.render("books/index.ejs", { books });
    } catch (err) {
        next(err);
    }
});

//Books New Route
app.get("/books/new", (req, res, next) => {
    try {
        res.render("books/new.ejs");
    } catch (err) {
        next(err);
    }
});

//Books Create Route
app.post("/books", async (req, res, next) => {
    try {
        let { title, author, published_year, genre, available_copies } =
            req.body;
        let book = new Book({
            title,
            author,
            published_year,
            genre,
            available_copies,
        });
        await book.save();
        res.redirect("/books");
    } catch (err) {
        next(err);
    }
});

//Books Show Route
app.get("/books/:id", async (req, res, next) => {
    try {
        let { id } = req.params;
        const book = await Book.findById(id);
        if (!book) {
            throw new Error("Book Not Found");
        }
        res.render("books/show.ejs", { book });
    } catch (err) {
        next(err);
    }
});

//Books Edit Route
app.get("/books/:id/edit", async (req, res, next) => {
    try {
        let { id } = req.params;
        const book = await Book.findById(id);
        if (!book) {
            throw new Error("Book Not Found");
        }
        res.render("books/edit.ejs", { book });
    } catch (err) {
        next(err);
    }
});

//Books Update Route
app.put("/books/:id", async (req, res, next) => {
    try {
        let { id } = req.params;
        let { title, author, published_year, genre, available_copies } =
            req.body;
        const updatedBook = await Book.findByIdAndUpdate(
            id,
            { title, author, published_year, genre, available_copies },
            { runValidators: true, new: true }
        );
        if (!updatedBook) {
            throw new Error("Book Not Found");
        }
        res.redirect("/books");
    } catch (err) {
        next(err);
    }
});

//Books Delete Route
app.delete("/books/:id", async (req, res, next) => {
    try {
        let { id } = req.params;
        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) {
            throw new Error("Book Not Found");
        }
        res.redirect("/books");
    } catch (err) {
        next(err);
    }
});

app.listen(port, () => {
    console.log("Listening on port " + port);
});

//Error
app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500;
    const message = err.message || "Something went wrong!";
    res.status(status).render("error", { error: { status, message } });
});
