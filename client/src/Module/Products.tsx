import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import { useProductContext } from "../Context/Product";
import { ProductFilter } from "../Components/ProductFilter";
import { ProductItem } from "../Components/Product";
import Skeleton from "../Components/Skeleton";
import NoResults from "../Components/NoResults";
import { useEffect, useState } from "react";

export function Products() {
  return <>
    {/* <div className="mt-[var(--appbar-height)] py-[66px] min-h-full w-full md:w-[90%] md:mx-auto"></div> */}
    <div className="mt-[var(--appbar-height)] py-8 px-2 w-full">
       <div className="flex gap-1">
        <div className="w-[25svw]">
            <ProductFilter />
        </div>
        <div className="flex-1">
          <ProductView />
        </div>
      </div>
    </div>
    {/* <div className="fixed top-[var(--appbar-height)] h-[64px] left-0 bg-white w-full">
      <div className="mt-1 w-[98%] md:w-[80%] mx-auto fraunces-regular text-sm">
        <ProductFilter />
      </div>
    </div> */}
    <Navbar type="product" />
    <Footer />
  </>;
}

function ProductView() {
  const {
    products,
    productdispatcher: { loading, filterPreset }
  } = useProductContext();
  const [ count, setCount ] = useState(0);

  useEffect(() => {
    setCount(filterPreset.current.count);
  }, [filterPreset.current]);

  return<>
    { products.length > 0 && <p className="fraunces-regular text-xs mb-2">Showing {products.length} of {count}</p> }
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-2">
      {
        loading?
        (new Array(30).fill(null).map((_, i) => {
          return <Skeleton key={i} className="h-[200px] bg-primary-100" />
        }))
        :products.map((product) => {
          return <ProductItem key={product.id} product={product} />
        })
      }
    </div>
    { !loading && products.length == 0 &&
     <NoResults title="No Results Found" subtitle="We can't find any item matching your search" />
    }
  </>
}