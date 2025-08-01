import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import { useProductContext } from "../Context/Product";
import { ProductFilter } from "../Components/ProductFilter";
import { Theme } from "../Utils/Theme";
import SearchIcon from "../assets/Search.svg"
import Img from "../Components/Img";
import { ProductItem } from "../Components/Product";
import Skeleton from "../Components/Skeleton";

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
        (new Array(10).fill(null).map((_) => {
          return <Skeleton className="h-[200px] bg-primary-100" />
        }))
        :products.map((product) => {
          return <ProductItem key={product.id} product={product} />
        })
      }
    </div>
    { !loading && products.length == 0 && <NoResults /> }
  </>
}

function NoResults() {
  return <div
   className={`w-full bg-primary-200 border-primary-300 text-primary-600 *:fill-primary-600 border-1 p-8 text-xl text-center animate-appear flex flex-col gap-4 items-center justify-center fraunces-regular font-medium ${Theme.rounded}`}>
    <Img src={SearchIcon} className="size-20"/>
    <div>
      <p className="mt-2">No Results Found</p>
      <p className="text-primary-500 text-sm">We can't find any item matching your search</p>
    </div>
  </div>
}