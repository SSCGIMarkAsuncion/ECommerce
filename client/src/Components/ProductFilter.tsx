import { SortButton, Toggle } from "./Button";
import { Searchbar } from "./Input";
import MultiRange from "./MultiRange";
import { useProductContext } from "../Context/Product";
import { useEffect, useState } from "react";
import Select from "./Select";
import { productFilterQueryGetSortOf } from "../Models/Product";
import type { SortType } from "../Hooks/useProducts";

export function ProductFilter() {
  const { productdispatcher: { filterPreset, filter, setFilter }} = useProductContext();
  const [ maxPrice, setMaxPrice ] = useState(0);

  useEffect(() => {
    setMaxPrice(filterPreset.current.maxPrice);
  }, [filterPreset.current]);

  const setTags = (name: string, include: boolean) => {
    setFilter(v => {
      let tags = v.tags;
      const index = tags.findIndex((tag) => tag == name);
      if (include) {
        if (index >= 0)
          return v;
        else
          tags.push(name);
      }
      else {
        if (index >= 0) {
          tags = tags.filter((tag) => tag !== name);
        }
      }

      return {
        ...v, tags: tags
      };
    });
  };

  return <div>
    <Searchbar className="bg-gray-100/50 text-sm" placeholder="Search for products" defaultValue={filter.q}
     onChangeFilter={(f) => {
      setFilter(v => {
        if (v.q == f) return v;
        return {
          ...v, q: f
        };
      });
     }} />
    <div className="mt-4 fraunces-regular text-sm">
      <p className="text-gray-500 text-xs">Sort by</p>
      <ul className="mt-1 *:mb-[1px] *:w-max">
        <li><SortButton sortValue={productFilterQueryGetSortOf(filter, "date")} onBtnToggle={(s) => {
          setFilter(v => ({
            ...v,
            sby: "date", sort: s
          }));
         }}>Date</SortButton></li>
        <li><SortButton sortValue={productFilterQueryGetSortOf(filter, "price")} onBtnToggle={(s) => {
          setFilter(v => ({
            ...v,
            sby: "price", sort: s
          }));
        }}>Price</SortButton></li>
      </ul>

      <p className="text-gray-500 text-xs mt-4">Category</p>
      <ul className="mt-1 *:mb-[1px] *:w-max">
        <li><Toggle initial={filter.isDiscounted} onBtnToggle={(active) => {
          setFilter(v => ({
            ...v, isDiscounted: active
          }));
        }}>Promo</Toggle></li>
        {/* <li className="font-[initial] font-bold">|</li> */}
        <li><Toggle initial={filter.tags.includes("best seller")} onBtnToggle={(active) => setTags("best seller", active)}>Best Sellers</Toggle></li>
        {
          filterPreset.current.categories.map((category) => {
            return <li key={category}><Toggle className="capitalize" initial={filter.tags.includes(category)} onBtnToggle={(active) => setTags(category, active)}>{category}</Toggle></li>
          })
        }
      </ul>
      <p className="text-gray-500 text-xs mt-4">Price</p>
      <MultiRange min={0} max={maxPrice} minValue={filter.priceMin} maxValue={filter.priceMax || 999999} onChange={(e) => {
        if (maxPrice == 0) return;
        setFilter(v => {
          return {
            ...v, priceMin: e.minValue, priceMax: e.maxValue
          };
        })
      }} />
    </div>
  </div>
}