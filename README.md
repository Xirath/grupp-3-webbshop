# grupp-3-webbshop
# Webshop
 
A webshop project built with Next.js and TypeScript as part of our Agile Methods course.
 
## Features
 
- Product listing
- Product details
- Search and pagination
- Shopping cart
- Stock validation
- Cart saved in localStorage
- Error handling for missing products
- Admin functionality
- Database integration
 
## Technologies
 
- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL
- Prisma
- Git & GitHub
 
## Shopping Cart
 
The shopping cart uses React Context for state management.
 
Only the product ID and quantity are saved in localStorage. When the cart is loaded, the application checks if the product still exists and if it is still in stock.
 
If a product no longer exists or is out of stock, it is removed from the cart.
 
## Database
 
The project originally used JSON Server and a JSON file.
 
We later implemented Supabase with PostgreSQL as the database and Prisma as ORM.
 
## Getting Started
 
Install dependencies:
 
npm install
 
Start the development server:
 
npm run dev
