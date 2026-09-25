import { ShoppingBasket, Cuboid, User } from "lucide-react";
import Link from "next/link";



export default function WebshopHeader() {
    return (

        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-4 border-b-2 border-gray-300/50 mb-3 mx-6">
            <Link href="/" className="flex items-center gap-2 font-semibold text-2xl"><Cuboid size={48}  /><p>BuyIT</p></Link>
            <p className="text-m font-semibold text-gray-700">Welcome to our webshop! Explore our products and enjoy a seamless shopping experience.</p>
            <div className="flex items-center gap-4">
                <Link href="/"><User size={32}/></Link>
                <Link href="/"><ShoppingBasket size={32} /></Link>
            </div>
        </header>
    );
}