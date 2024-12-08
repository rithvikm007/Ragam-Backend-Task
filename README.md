# Library Management System API

A RESTful API for managing books and users in a library.

## **Technologies Used**
- **Express.js**: Web framework for building the REST API.
- **MongoDB**: NoSQL database for storing user and book data.
- **Mongoose**: ODM (Object Data Modeling) library to interact with MongoDB.
- **EJS**: Templating engine for rendering views.
- **Method-Override**: For supporting HTTP methods like PUT and DELETE in forms.

## **Core Features**
- **Books Management**: Add, view, update, and delete books.
- **Users Management**: Add, view, update, and delete users.
- **User Book Borrowing**: Users can borrow and return books.

## **Routes**

### **Main Route**
- `GET /` - Render the main index page.

### **Users Routes**
- `GET /users` - List all users.
- `GET /users/new` - Show form to create a new user.
- `POST /users` - Create a new user.
- `GET /users/:id` - Show details of a specific user.
- `GET /users/:id/edit` - Show form to edit user details.
- `PUT /users/:id` - Update user details.
- `DELETE /users/:id` - Delete a specific user.
- `GET /users/:id/borrow` - Show form for user to borrow books.
- `POST /users/:id` - Add a borrowed book to a user's record.
- `DELETE /users/:id` - Delete a borrowed book from a user's record.

### **Books Routes**
- `GET /books` - List all books.
- `GET /books/new` - Show form to add a new book.
- `POST /books` - Add a new book.
- `GET /books/:id` - Show details of a specific book.
- `GET /books/:id/edit` - Show form to edit book details.
- `PUT /books/:id` - Update book details.
- `DELETE /books/:id` - Delete a specific book.

### **Error Handling**
- All errors are handled and rendered on the `error` page with status and message.

## **Setup**
1. Clone the repo.
2. Install dependencies: `npm install`.
3. Run the server: `npm start`.
4. The app will be available at `http://localhost:8080`.
