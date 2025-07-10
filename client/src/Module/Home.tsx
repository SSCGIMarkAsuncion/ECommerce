import { useEffect, useState } from "react";
import Button from "../Components/Button";
import Navbar from "../Components/Navbar";
import PromoList from "../Components/PromoList";
import usePromo from "../Hooks/usePromo";
import { type Product } from "../Models/Product";
import BestSeller from "../Components/BestSellerCarousel";
import Footer from "../Components/Footer";

export default function Home() {
  const { getPromo, getBestSellers } = usePromo();
  const [ promos, setPromos ] = useState<Product[]>([]);
  const [ bestSellers, setBestSellers ] = useState<Product[]>([]);

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
    <Navbar />
    <div id="home" className="min-h-[400px] bg-primary-950 pt-[var(--appbar-height)] px-8 pb-8">
      {/* <div className="absolute top-[calc(var(--appbar-height))] w-full">
        <h1 className="absolute right-[18%] birthstone-regular text-white text-9xl tracking-wider font-medium opacity-10">
          Kape<br /> Kalakal
        </h1>
        <img src="/coffee_cup.png"
        className="absolute right-[-20%] w-[400px]" />
      </div> */}
      <div className="w-[60%] fraunces-regular">
        <h1 className="my-10 text-white text-4xl/14 tracking-wider font-medium text-shadow-black text-shadow-sm">
          Trade in Flavor,<br /> Brew Real Connection
        </h1>
        <Button pColor="whitePrimary" className="text-lg">Explore now</Button>
      </div>
    </div>
    <div id="promos" className="bg-primary-50 p-4">
      <PromoList promos={promos} />
    </div>
    <div id="bestsellers" className="bg-primary-600 p-4">
      <h1 className="my-5 fraunces-regular text-white text-center text-4xl font-medium"> Best Sellers </h1>
      <BestSeller products={bestSellers} />
    </div>
    <Footer />
  </>
}