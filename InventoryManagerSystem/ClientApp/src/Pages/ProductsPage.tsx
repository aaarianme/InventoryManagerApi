import React, { useEffect } from "react";
import { NavBar } from "../components/NavBar";
import LoadingSpinner from "../components/LoadingSpinner";
import { useFetch } from "../Hooks/RequestHooks";
import ProductsPreviewTable from "../components/ProductsPreviewTable";
import DropDownMenu from "../components/DropDownMenu";
import useSearchParams from "../Hooks/useSearchParamsHook";
import { useHistory } from "react-router";

interface IBrand {
  id: string;
  name: string;
}
interface IProduct {
  name: string;
  sku: string;
  dateAdded: string;
  retailPrice: string;
  color: string;
  webCode: string;
  brand: IBrand;
  inStock: string;
  sold: string;
  image: string;
}
export default function AllProductsPage() {
  const [loaded, res, getData] = useFetch({ data: { products: {} } });
  const products: Array<IProduct> = res.data.products;
  const history = useHistory();
  const pageDataGetter = async (fullQueryParams: string = "") => {
    await getData("api/products" + fullQueryParams, false);
  };

  const [searchParams, setSearchParam] = useSearchParams({}, pageDataGetter);

  function handleBrandFiltering(brand: string) {
    setSearchParam({ brand: brand });
  }

  return (
    <>
      <div className="pt-2">
        <div className="mx-12 block pt-2 pb-2 px-8 border-b flex justify-between">
          <label className="header-font text-lg pt-3">
            {products.length ?? 0} items found
          </label>

          <div className="px-3 mt-1">
            <div className="flex gap-2">
              <input
                placeholder="Search"
                onChange={(ev) =>
                  setSearchParam({ searchFor: ev.target.value })
                }
                className="inline-blockw-64 pt-1 pb-1 border border-gray-300 shadow-sm rounded-md text-center outline-none focus:outline-none"
              />
              <DropDownMenu
                clickHandler={handleBrandFiltering}
                defaultValue="All Brands"
                fetchFrom="api/products/fetch/allBrands"
                defaultItems={[{ displayName: "All Brands", value: null }]}
              ></DropDownMenu>
            </div>
          </div>
        </div>

        {loaded === true ? (
          <div className="mt-3 px-10">
            <div className="grid grid-cols-3 grid-rows-12 gap-4 justify-center pb-10">
              {products.map((product) => (
                <div
                  className={
                    product.image != null
                      ? "border rounded-md row-span-2 shadow-sm w-full h-auto pt-3 pb-3 px-2 text-font"
                      : "border rounded-md shadow-sm w-full h-auto pt-3 pb-3 px-2 text-font"
                  }
                >
                  <p
                    className="text-center text-gray-700 mb-6 text-lg cursor-pointer"
                    onClick={() => history.push(`/products/${product.webCode}`)}
                  >
                    <span className="text-gray-400">{product.brand.name}</span>{" "}
                    {product.name}
                  </p>
                  {product.image != null ? (
                    <div className="flex flex-col justify-center">
                      <div className="flex justify-center">
                        <img
                          onClick={() =>
                            history.push(`/products/${product.webCode}`)
                          }
                          style={{ backgroundSize: "cover" }}
                          className="h-32 object-contain"
                          src={product.image}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center gap-3 subtext-font text-gray-500">
                      <span>{product.color}</span>
                    </div>
                  )}
                  <span className="text-center block text-gray-500 subtext-font text-xs">
                    {product.sku}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <LoadingSpinner loadingText=""></LoadingSpinner>
        )}
      </div>
    </>
  );
}
//            <ProductsPreviewTable products={products}></ProductsPreviewTable>
