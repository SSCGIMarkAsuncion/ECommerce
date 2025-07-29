import { useEffect, useState } from "react";
import Button from "../Components/Button";
import Navbar from "../Components/Navbar";
import PromoList from "../Components/PromoList";
import { type Product } from "../Models/Product";
import BestSeller from "../Components/BestSellerCarousel";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router";
import useProducts from "../Hooks/useProducts";

export default function Home() {
  const { getPromo, getBestSellers } = useProducts();
  const [ promos, setPromos ] = useState<Product[]>([]);
  const [ bestSellers, setBestSellers ] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getPromo()
      .then((promos) => {
        setPromos(promos);
      })
      .catch((e) => console.log(e));

    getBestSellers()
      .then((bestSellers) => {
        setBestSellers(bestSellers);
      })
      .catch(e => console.log(e));
  }, []);

  return <>
    <div id="home" className="bg-[url('/home_bg.png')] bg-cover bg-center aspect-[16/9] min-h-[400px] bg-primary-950 pt-[var(--appbar-height)] px-8 pb-8">
      <div className="w-[60%] fraunces-regular text-5xl/14 md:text-6xl/15 xl:text-8xl/26">
        <h1 className="my-10 text-white tracking-wider font-medium text-shadow-black text-shadow-lg">
          Trade in Flavor,<br /> Brew Real Connection
        </h1>
        <Button onClick={() => navigate("/products") } href="/products" pColor="whitePrimary" className="text-lg">Explore now</Button>
      </div>
    </div>
    <div id="promos" className="bg-primary-50 md:p-4">
      <PromoList promos={promos} />
    </div>
    <div id="bestsellers" className="bg-primary-600 p-4">
      <h1 className="my-5 fraunces-regular text-white text-center text-4xl font-medium tracking-wide"> Best Sellers </h1>
      <BestSeller products={bestSellers} />
    </div>
    <Navbar />
    <Footer />
  </>
}