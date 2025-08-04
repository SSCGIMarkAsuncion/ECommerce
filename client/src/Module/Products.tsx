import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import { useProductContext } from "../Context/Product";
import { ProductFilter } from "../Components/ProductFilter";
import { ProductItem } from "../Components/Product";
import Skeleton from "../Components/Skeleton";
import NoResults from "../Components/NoResults";

export function Products() {
  return <>
    <div className="mt-[var(--appbar-height)] py-[66px] min-h-full w-full md:w-[90%] md:mx-auto">
      <ProductView />
    </div>
    <div className="fixed top-[var(--appbar-height)] h-[64px] left-0 bg-white w-full">
      <div className="mt-1 w-[98%] md:w-[80%] mx-auto fraunces-regular text-sm">
        <ProductFilter />
      </div>
    </div>
    <Navbar type="product" />
    <Footer />
  </>;
}

function ProductView() {
  const {
    products,
    productdispatcher: { loading }
  } = useProductContext();

  return<>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
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