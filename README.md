# Amazon Clone 
A scalable e-commerce web application built using modern full stack technologies. The project focuses on implementing real world dhooping including product browsing, cart management, and order placement with responsive user interface.

# Key Features
-- Product Catalog
    Dynamic Product listing with images,pricing and add to cart functionality
-- Product Details
    Detailed view including decsription and pricing
-- Cart Management
    Add/remove products
    Update item quantities
-- Order WorkFlow 
    Multi step checkout flow
    Shipping Information Handling
    Order confirmation 
-- User Authentication
    Structed backend logic for real authentication integration
-- UI/UX Design
    Fully responsive 

# Tech Stack
--Frontend :: React.js, Context API, React Router
--Backend :: Node.js, Express.js
--Databases :: PostgreSQL with Prisma ORM

# Environment Variables
Crete .env file in root of backend directory
add these : 
DATABASE_URL=your_postgresql_connection_string
PORT=5000
JWT_SECRET=your_secret_key


# Project Setup
    # Frontend
        cd frontend
        npm i or npm install
        npm run dev

    # Backend
        cd backend
        npm i or npm install
        npx prisma db push
        npx prisma generate 
        node src/seed.js
        npm run dev

