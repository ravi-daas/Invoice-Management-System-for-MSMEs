# Web App

## Overview
This project is a web application consisting of a frontend and backend. Follow the steps below to download, set up, and run the app locally.

---

## How to Download

1. **Clone the repository**

   Open your terminal and run:  
   ```bash
   git clone [<repository-url>](https://github.com/ravi-daas/Invoice-Management-System-for-MSMEs)

Replace `<repository-url>` with the actual URL of the repository.

2. **Navigate into the project folder**

   ```bash
   cd <project-folder-name>
   ```

   Replace `<project-folder-name>` with the name of the cloned folder.

---

## How to Run the Web App

1. **Install dependencies**
   Install necessary packages for both backend and frontend:

   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

2. **Generate Prisma client**
   Go back to the backend folder and generate the Prisma client:

   ```bash
   cd ../backend
   npx prisma generate
   ```

3. **Start the frontend**
   In a new terminal window/tab, start the frontend development server:

   ```bash
   cd frontend
   npm run dev
   ```

4. **Start the backend**
   In another terminal window/tab, start the backend server:

   ```bash
   cd backend
   npm start
   ```

---

## Additional Notes

* Make sure you have **Node.js** and **npm** installed.
* Prisma may require a database setup depending on your app configuration.
* The frontend typically runs on `http://localhost:3000` and backend on `http://localhost:5000` (or as configured).

---

If you need help or run into issues, feel free to open an issue on the repository!
