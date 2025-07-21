import { useEffect, useState, type HTMLProps } from "react";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import { type Product } from "../Models/Product";
import useProducts from "../Hooks/useProducts";
import Loading from "../Components/Loading";
import { Card } from "../Components/Card";
import { MError } from "../Utils/Error";
import Button, { ButtonCart } from "../Components/Button";
import { Pill } from "../Components/Pill";
import useAuth from "../Hooks/useAuth";
import { Searchbar } from "../Components/Input";
import useCart from "../Hooks/useCart";
import { Theme } from "../Utils/Theme";
import { useCartContext } from "../Context/Cart";
import { type CartItem } from "../Models/Cart";

export function Products() {
  useAuth().verifyAndSetUser();
  const [ filter, setFilter ] = useState("");

  return <>
    <div className="mt-[var(--appbar-height)] min-h-full p-2">
      <div className={`sticky top-[var(--appbar-height)] w-[70%] m-auto py-4 ${Theme.transition}`}>
        <Searchbar className="fraunces-regular bg-white"
        placeholder="Filter by name" onChangeFilter={(f) => setFilter(f)} />
      </div>
      <ProductView filter={filter} />
    </div>
    <Navbar />
    <Footer />
  </>;
}

function ProductView({ filter = "" }) {
  const [ products, setProducts ] = useState<Product[]>([]);
  const [ filteredProducts, setFilteredProducts ] = useState<Product[]>([]);
  const { getCartsAndSetCarts } = useCart();
  const { getProducts } = useProducts();

  getCartsAndSetCarts();
  useEffect(() => {
    getProducts([],[filter])
      .then(p => {
        setFilteredProducts(p);
      })
      .catch(e => {
        const errs = MError.toErrorList(e);
        console.log(errs);
      });
  }, [filter]);

  useEffect(() => {
    getProducts([], [])
      .then(p => {
        setProducts(p);
      })
      .catch(e => {
        const errs = MError.toErrorList(e);
        console.log(errs);
      });
  }, []);

  if (products.length == 0) {
    return <Loading>Loading Products</Loading>
  }

  return <div className="w-[80svw] m-auto">
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 px-8 py-2">
      {
        filter.length == 0? products.map((product) => {
          return <ProductItem key={product.id} product={product} />
        }):filteredProducts.map((product) => {
          return <ProductItem key={product.id} product={product} />
        })
      }
    </div>
  </div>
}

export interface ProductItemProps extends HTMLProps<HTMLDivElement> {
  product: Product
};

function ProductItem({ product, ...props}: ProductItemProps) {
  const { cart } = useCartContext();
  const { addToCart } = useCart();
  const [ cartItem, setCartItem ] = useState<CartItem | null>(null);

  useEffect(() => {
    console.log(cart?.products);

    const item = cart?.products.filter((item) => {
      return item.id == product.id;
    })[0];

    setCartItem(item || null);
  }, [cart?.products]);

  return <Card {...props} className="w-full flex flex-col animate-appear">
    <img src={product.imgs[0]} className="w-full h-[200px] object-cover"/>
    <div className="p-2 text-sm text-center flex flex-col flex-1">
      <p className="text-wrap fraunces-regular text-primary-950">{product.name}</p>
      <p className={`fraunces-regular mb-2 text-primary-950`}>
        <span className={`${product.salePrice? "line-through":""}`}>PHP {product.price}</span>&nbsp;
        { product.salePrice && <span>PHP {product.salePrice}</span> }
      </p>
      <div className="flex flex-row flex-wrap gap-1 text-xs mt-2">
        {
          product.tags.map((tag) => {
            return <Pill key={tag}>{tag}</Pill>;
          })
        }
      </div>
      <div className="mt-auto">
      <ButtonCart className="fraunces-regular w-full mt-4 text-sm"
        cartAmount={cartItem?.amount}
        onChangeCartAmount={(newAmount: number) => {
          addToCart(product, newAmount);
        }}
        onClick={(e) => {
          e.stopPropagation();
          addToCart(product, 1);
        }}>
        Add to cart
      </ButtonCart>
    </div>
    </div>
  </Card>
}