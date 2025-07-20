# Web App

## Overview
This project is a web application consisting of a frontend and backend. Follow the steps below to download, set up, and run the app locally.

---

## How to Download

1. **Clone the repository**

   Open your terminal and run:  
   ```bash
   git clone https://github.com/ravi-daas/Invoice-Management-System-for-MSMEs

2. **Navigate into the project folder**

   ```bash
   cd Invoice-Management-System-for-MSMEs
   ```

---

## How to Run the Web App

1. Install necessary packages for both backend and frontend:

   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

2. Add a .env file in backend folder and place Database Url under "DATABASE_URL" variable

3. Go back to the backend folder and generate the Prisma client:

   ```bash
   cd ../backend
   npx prisma generate
   ```

4. Start the backend development server:

   ```bash
   npm start
   ```

5. In another terminal window/tab, start the backend server:

   ```bash
   cd backend
   npm run dev
   ```

---

## Additional Notes

* Make sure you have **Node.js** and **npm** installed.
* Prisma require a database setup.
* The frontend will run on `http://localhost:5173` and backend on `http://localhost:5000` (or as configured).

---

If you need help or run into issues, feel free to open an issue on the repository!
