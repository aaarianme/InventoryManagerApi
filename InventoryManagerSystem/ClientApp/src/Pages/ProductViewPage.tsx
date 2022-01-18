import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router";
import { useFetch } from "../Hooks/RequestHooks";
import { NavBar } from "../components/NavBar";
import ProductsPreviewTable from "../components/ProductsPreviewTable";

interface IBrand {
  id: string;
  name: string;
  collab: string;
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
  notes: string;
  image: string;
}

export default function ProductViewPage() {
  const [loaded, res, getRes] = useFetch({ data: { product: {} } });
  const product: IProduct = res.data.product ?? {};
  const { webCode }: any = useParams();
  const getData = async () => {
    await getRes("api/products/get/" + webCode);
  };
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    console.log(res);
  }, [res]);

  return (
    loaded && (
      <div className="w-full h-screen">
        <NavBar header={product.name} color=""></NavBar>
        <div className="px-20 pt-10">
          <ProductsPreviewTable products={[product]}></ProductsPreviewTable>
        </div>
        <div className="place-items-center mt-10 grid grid-cols-3 gap-4">
          <div>
            <div
              className="w-64 h-64 rounded shadow px-6 text-font pt-3 pb-3"
              style={{ backgroundColor: "#fccb60" }}
            >
              <label className="border-b block header-font text-white">
                Notes
              </label>
              <p className="px-1 text-white">{product.notes}</p>
            </div>
          </div>
          <div>2</div>
          <div>3</div>
        </div>
      </div>
    )
  );
}
