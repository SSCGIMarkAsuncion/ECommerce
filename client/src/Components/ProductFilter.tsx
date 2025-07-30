import { useEffect, useState } from "react";
import { SortButton, Toggle } from "./Button";
import { Searchbar } from "./Input";
import type { SortType } from "../Hooks/useProducts";
import { useSearchParams } from "react-router";
import { QUERY_BOOL_BESTSELLER, QUERY_BOOL_PROMO, QUERY_STR_DATE, QUERY_STR_FILTER, QUERY_STR_PRICE } from "../Context/Product";

export function ProductFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [ filter, setFilter ] = useState<{
    filter: string,
    promo: boolean,
    bestSeller: boolean,
    date: SortType | null,
    price: SortType | null
  }>({
    filter: searchParams.get(QUERY_STR_FILTER) || "",
    promo: searchParams.get(QUERY_BOOL_PROMO) == '1',
    bestSeller: searchParams.get(QUERY_BOOL_BESTSELLER) == '1',
    date: searchParams.get(QUERY_STR_DATE) as SortType || null,
    price: searchParams.get(QUERY_STR_PRICE) as SortType || null
  });

  useEffect(() => {
    const queries = [];
    if (filter.filter)
      queries.push(`${QUERY_STR_FILTER}=${filter.filter}`);
    if (filter.date)
      queries.push(`${QUERY_STR_DATE}=${filter.date}`);
    if (filter.price)
      queries.push(`${QUERY_STR_PRICE}=${filter.price}`);
    if (filter.promo)
      queries.push(`${QUERY_BOOL_PROMO}=1`)
    if (filter.bestSeller)
      queries.push(`${QUERY_BOOL_BESTSELLER}=1`)

    setSearchParams(`?${queries.join('&')}`);
  }, [filter]);

  return <>
    <Searchbar placeholder="Filter by name" defaultValue={filter.filter} onChangeFilter={(f) => {
      setFilter(v => ({
        ...v, filter: f
      }));
     }} />
    <div>
      <ul className="flex mt-1">
        <li><Toggle initial={filter.promo} onBtnToggle={(active) => setFilter(v => ({
          ...v,
          promo: active
        }))}>Promo</Toggle></li>
        <li><Toggle initial={filter.bestSeller} onBtnToggle={(active) => setFilter(v => ({
          ...v,
          bestSeller: active
        }))}>Best Sellers</Toggle></li>
        {/* <li>Tags</li> */}
        <li className="ml-4"><SortButton sortValue={filter.date} onBtnToggle={(s) => {
          setFilter(v => ({
            ...v,
            price: null,
            date: s
          }));
        }}>Date</SortButton></li>
        <li><SortButton sortValue={filter.price} onBtnToggle={(s) => {
          setFilter(v => ({
            ...v,
            date: null,
            price: s
          }));
        }}>Price</SortButton></li>
      </ul>
    </div>
  </>
}