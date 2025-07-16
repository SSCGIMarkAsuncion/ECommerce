import { useEffect, useState } from "react";
import Button from "../Components/Button";
import Navbar from "../Components/Navbar";
import PromoList from "../Components/PromoList";
import usePromo from "../Hooks/usePromo";
import { type Product } from "../Models/Product";
import BestSeller from "../Components/BestSellerCarousel";
import Footer from "../Components/Footer";
import useAuth from "../Hooks/useAuth";
import type { User } from "../Models/User";
import { useUser } from "../Context/User";

export default function Home() {
  const { getPromo, getBestSellers } = usePromo();
  const { authVerify } = useAuth();
  const { userDispatcher } = useUser();
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

    authVerify()
      .then((user: User) => {
        userDispatcher({ type: "assign", user });
      })
      .catch(e => console.log("ERR", e));
  }, []);

  return <>
    <div id="home" className="bg-[url('/home_bg.png')] bg-cover bg-center aspect-[16/9] min-h-[400px] bg-primary-950 pt-[var(--appbar-height)] px-8 pb-8">
      <div className="w-[60%] fraunces-regular text-5xl/14 md:text-6xl/15 xl:text-8xl/26">
        <h1 className="my-10 text-white tracking-wider font-medium text-shadow-black text-shadow-lg">
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
    <Navbar />
    <Footer />
  </>
}