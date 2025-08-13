import Footer from "../Components/Footer";
import Navbar, { NavbarOffset } from "../Components/Navbar";

export default function MyOrder() {
  return <>
    <NavbarOffset />
    <div className="min-h-full">
    </div>
    <Navbar type="product" />
    <Footer />
  </>;
}