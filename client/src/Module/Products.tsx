import { useEffect, useRef, useState, type HTMLProps } from "react";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import { type Product } from "../Models/Product";
import useProducts from "../Hooks/useProducts";
import Loading from "../Components/Loading";
import { Card } from "../Components/Card";
import { MError } from "../Utils/Error";
import Button from "../Components/Button";
import { Pill } from "../Components/Pill";
import useAuth from "../Hooks/useAuth";
import { Searchbar } from "../Components/Input";
import useCart from "../Hooks/useCart";
import { Theme } from "../Utils/Theme";

export function Products() {
  useAuth().verifyAndSetUser();

  return <>
    <div className="mt-[var(--appbar-height)] h-full p-2">
      <ProductView />
    </div>
    <Navbar />
    <Footer />
  </>;
}

function ProductView() {
  const [ products, setProducts ] = useState<Product[]>([]);
  const [ filteredProducts, setFilteredProducts ] = useState<Product[]>([]);
  const [ filter, setFilter ] = useState("");
  const { getProducts } = useProducts();

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

  return <div className="w-[80svw] h-full m-auto">
    <div className={`sticky top-[var(--appbar-height)] py-4 ${Theme.transition}`}>
      <Searchbar className="fraunces-regular bg-white"
      placeholder="Filter by name" onChangeFilter={(f) => setFilter(f)} />
    </div>
    <div className="flex flex-wrap gap-2 px-8">
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
  const { addToCart } = useCart();

  return <Card {...props} className="aspect-[1/1.3]">
    <img src={product.imgs[0]} className="w-full h-[200px] object-cover"/>
    <div className="p-2 text-sm text-center">
      <p className="text-wrap fraunces-regular text-primary-950">{product.name}</p>
      <p className={`fraunces-regular mb-2 text-primary-950`}>
        <span className={`${product.salePrice? "line-through":""}`}>PHP {product.price}</span>&nbsp;
        { product.salePrice && <span>PHP {product.salePrice}</span> }
      </p>
      <div className="flex flex-wrap gap-1 text-xs mt-2">
      {
        product.tags.map((tag) => {
          return <Pill key={tag}>{tag}</Pill>;
        })
      }
      </div>
      <Button className="fraunces-regular w-full mt-4 text-sm"
        onClick={(e) => {
          e.stopPropagation();
          addToCart(product, 1);
        }}
      >Add to cart</Button>
    </div>
  </Card>
}