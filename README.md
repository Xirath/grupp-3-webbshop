#  :sparkles: Webshop - grupp 3 :sparkles:
 
This is a webshop project built with Next.js and TypeScript as part of a course project for frontend development. 

The webhops has and admin part for managing inventory in the webshop. You are able to add, delete and update products and have a nice overview of the stock to make manganing inventory smooth and easy. 

The webshop also have the customer part with a nice grid to display all products. As a customer you are able to easily browse through the products by filtering and searching for products and add them to your shopping cart. From the shopping cart the customer can checkout and pay. The webshop uses the stripe API so that you easily can connect the webshop to your choice of payment solutions.

<img width="2555" height="1305" alt="image" src="https://github.com/user-attachments/assets/04b7a249-edda-402a-947b-1f1624f00ddc" />
<img width="2555" height="1297" alt="image" src="https://github.com/user-attachments/assets/01581f74-601b-40e6-b4b4-e6ab1bc0cb7d" />

## :bulb: Features
 
- Product listing
- Product details
- Search and Filtering
- Pagination
- Shopping cart
- Stock validation
- Cart saved in localStorage
- Error handling for missing products
- Admin functionality
- Database integration
 
## :hammer: Technologies
 
- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL
- Prisma
- Git & GitHub
- Stripe
 
##  :earth_americas: Environment Variables

Create a `.env`-file in the root of the project:

```env
STRIPE_WEBHOOK_SECRET=[your.stripe.webhook.secret]

STRIPE_SECRET_KEY= [Your.stripe.secret.key]

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY= [Your.next.public.stripe.publishable.key]

DIRECT_URL=postgresql://postgres:[password]@db.[user].supabase.co:5432/postgres

DATABASE_URL= postgresql://postgres.[user]:[password]@[region].pooler.supabase.com:6543/postgres
````


##  :shopping_cart: Shopping Cart
 
The shopping cart uses React Context for state management.
 
Only the product ID and quantity are saved in localStorage. When the cart is loaded, the application checks if the product still exists and if it is still in stock.
 
If a product no longer exists or is out of stock, it is removed from the cart.
 
##  :blue_book: Database
 
The project originally used JSON Server and a JSON file.
 
We later implemented Supabase with PostgreSQL as the database and Prisma as ORM.
 
##  :heavy_check_mark: Getting Started
 
Install dependencies:
 
`npm install`
 
Start the development server:
 
`npm run dev`

Run build:

`npm run build`

##  :small_blue_diamond: Linting

Check code with ESLint:

```bash
npm run lint
````

##  :bug: Known Issues


## :bust_in_silhouette: Authors

- [Sandra](https://github.com/sandrauddman)
- [Luisa](https://github.com)
- [Isabelle](https://github.com)
- [Daniel](https://github.com)

