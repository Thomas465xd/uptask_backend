# Uptask Backend 📲

A robust RESTful API built with **Node.js**, **Express**, **TypeScript**, and **MongoDB** for managing projects and tasks in a to-do list application. This backend supports CRUD operations for projects and tasks, along with user authentication and two-factor authentication using JWT.  

⚠️ **Note:** This project is under active development and subject to changes as features are refined and added.  

---
 
## Features 🚨

- **CRUD Operations**:  
  - Create, retrieve, update, and delete projects.  
  - Add, retrieve, update, and delete tasks within a project.  

- **User Authentication**:  
  - Secure user registration and login.  
  - Two-Factor Authentication (2FA) implemented using **JSON Web Tokens (JWT)**.  

- **TypeScript-Powered**:  
  - Strongly typed codebase for maintainability and scalability.  

---

## Installation ⬇️

1. Clone this repository:  
   ```bash
   git clone https://github.com/yourusername/uptask-backend.git
   cd uptask-backend
   ```
2. Install Dependencies:
  ```bash
  npm install
  ```
3. Set up environment variables:
  Create a .env file in the root directory with the following:
  ```env
  Coming later...
  ```
4. Start the development server:
   ```bash
   npm run dev
   ```
--- 

# API Endpoints

## Projects

- `POST /api/projects` – Create a new project.
- `GET /api/projects` – Get all projects.
- `GET /api/projects/:id` – Get a specific project by ID.
- `PUT /api/projects/:id` – Update a project by ID.
- `DELETE /api/projects/:id` – Delete a project by ID.

## Tasks ✅

- POST /api/projects/:projectId/tasks – Add a new task to a project.
- GET /api/projects/:projectId/tasks – Get all tasks in a project.
- PUT /api/projects/:projectId/tasks/:taskId – Update a task in a project.
- DELETE /api/projects/:projectId/tasks/:taskId – Delete a task from a project.

## Authentication 👮
- POST /api/auth/register – Register a new user.
- POST /api/auth/login – User login with JWT-based authentication.
- POST /api/auth/2fa – Verify two-factor authentication token.

---

## Technologies 🚀

- Node.js – Server-side JavaScript runtime.
- Express.js – Web framework for building RESTful APIs.
- TypeScript – Type-safe JavaScript.
- MongoDB – NoSQL database for managing data.
- JWT – Secure authentication and two-factor authorization.

---

## Roadmap 🗺️

## Current Features:
- CRUD for projects and tasks. 
- Basic user authentication and JWT-based 2FA.

## Planned Enhancements: 
- Advanced error handling.
- Role-based access control (RBAC).
- Unit and integration tests with Jest.
- API documentation using Swagger or Postman.

---

## License 🪪
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

**Made with ♥️ Thomas Schrödinger**
