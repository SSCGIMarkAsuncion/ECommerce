import { useEffect, useState } from "react";
import Button from "../Components/Button";
import Navbar from "../Components/Navbar";
import PromoList from "../Components/PromoList";
import { type Product } from "../Models/Product";
import BestSeller from "../Components/BestSellerCarousel";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router";
import useProducts from "../Hooks/useProducts";
import ContactUs from "../Components/ContactUs";
import { Theme } from "../Utils/Theme";
import Testimonials from "../Components/Testimony";

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
    <div id="home" className="relative bg-[url('/home_bg.png')] bg-cover bg-center aspect-[16/9] min-h-[400px] bg-primary-950 pt-[var(--appbar-height)] px-4 md:px-18 pb-8">
      <div className="z-9 absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black/75 via-transparent to-black/75"></div>
      <div className="z-11 w-[60%] fraunces-regular text-5xl/14 md:text-6xl/15 xl:text-8xl/26">
        <h1 className="my-10 text-white tracking-wider font-medium text-shadow-black text-shadow-lg">
          Where Flavor Meets Togetherness
        </h1>
        <Button onClick={() => navigate("/products") } href="/products" pColor="whitePrimary" className="text-lg">Explore now</Button>
      </div>
    </div>
    <div id="promos" className="bg-primary-50 md:p-4">
      <h1 className="fraunces-regular text-center text-6xl font-semibold text-primary-900">Promos</h1>
      <PromoList promos={promos} />
    </div>
    <div id="bestsellers" className="bg-primary-600 p-4">
      <h1 className="my-5 fraunces-regular text-white text-center text-4xl font-medium tracking-wide">Best Sellers </h1>
      <BestSeller products={bestSellers} />
    </div>
    <div id="testimonials" className="fraunces-regular text-primary-900 bg-primary-200/75 p-6">
      <p className="text-center text-6xl mb-6 font-semibold">What Our Customers Say</p>
      <div className={`${Theme.rounded} mx-4 my-6`}>
        <Testimonials />
      </div>
    </div>
    <div id="contact" className="px-6 py-14 grid grid-cols-1 md:grid-cols-2 gap-10">
      <ContactUs />
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3858.8996135015977!2d121.04467497416896!3d14.71826717418687!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b0f0e5bb68dd%3A0x74ca74293192219d!2s7%20Mt.%20Malinang%2C%20Quezon%20City%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1754009613862!5m2!1sen!2sph"
      className="border-0 h-full w-full"
      allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
    </div>
    <Navbar />
    <Footer />
  </>
}