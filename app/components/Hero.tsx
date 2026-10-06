import Image from "next/image";

export default function Hero() {

    return (
        <section className="relative px-6 py-10 flex flex-col justify-center items-center bg-radial-[at_50%_45%] from-white/40 from-25% via-violet-300/35 via-45% to-zinc-600 to-70%">
            <header className=" relative z-10 max-w-3xl flex flex-col justify-center items-center px-4 text-center">
                <h1 className="text-5xl font-display text-pretty text-black-300/80 mb-6">A new luxurious collection that's here to stay</h1>
                <Image src="https://cdn.dummyjson.com/product-images/womens-watches/watch-gold-for-women/2.webp" alt="Luxurious Watch" width={300} height={300} loading="eager" />
                <div className="flex flex-col sm:flex-row gap-4">
                    <a className="uppercase bg-blue-950 rounded-lg px-6 py-2 font-bold text-violet-300 hover:bg-blue-950/30" href="/product/webshop/193">Buy now</a>
                    <a className="uppercase px-6 py-2 rounded-lg border-white border-2 font-bold text-blue-950" href="/something">Sign up</a>
                </div>
            </header>

            <Image className="w-full object-cover z-0 opacity-10 bg-linear-to-65 from-violet-600 to-white" src="/pexels.jpg" fill alt="" loading="eager" />
        </section>


    );
}