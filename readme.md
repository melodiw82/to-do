# To-Do App

A dynamic, aesthetic, and fully functional To-Do List Web Application built with **HTML/CSS/JS frontend** and a **Node.js + Express backend**.

---

## Live Demo

You can access and use the To-Do app using the public link below:

[Open To-Do App Github Pages](https://melodiw82.github.io/to-do/)


Good luck :>
---

## Features

### Frontend

- Minimal and clean UI with **themes** (standard, light, darker)
- Add, check/uncheck, and delete tasks
- Animated todo removal
- Persistent **theme selection** using `localStorage`
- Responsive design for desktop and mobile
- Real-time date and time display

### Backend (Express.js)

- **RESTful API** for todos:
  - `GET /api/todos` – Retrieve all todos
  - `GET /api/todos?done=true|false` – Filter todos by completion status
  - `POST /api/todos` – Add a new todo
  - `PUT /api/todos/:id` – Toggle todo completion
  - `DELETE /api/todos/:id` – Delete a todo
- **Modular routes** (`routes/todos.js`) for clean code separation
- **Logging** middleware with [Morgan](https://www.npmjs.com/package/morgan) to track requests
- **Centralized error handling** and custom 404 page
- **File-based persistence** using `todos.json` to save todos across server restarts
- **Static file serving** for HTML, CSS, JS, and assets

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/melodiw82/to-do.git
cd to-do
