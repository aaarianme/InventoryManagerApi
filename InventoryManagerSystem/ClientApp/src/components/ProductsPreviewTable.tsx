import React from "react";
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
export default function ProductsPreviewTable(props: { products: IProduct[] }) {
  const history = useHistory();
  return (
    <div>
      <table className="min-w-max w-full table-auto">
        <thead>
          <tr className=" text-gray-200 uppercase text-sm leading-normal bg-tealblue">
            <th className="py-3 px-6 text-left">Item</th>
            <th className="py-3 px-6 text-left">Color</th>
            <th className="py-3 px-6 text-center">Retail Price</th>
            <th className="py-3 px-6 text-center">SKU</th>
            <th className="py-3 px-6 text-center">Date Added</th>
            <th className="py-3 px-6 text-center">In Stock</th>
            <th className="py-3 px-6 text-center">SOLD</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light bg-shadowgray">
          {props.products.map((product: IProduct) => (
            <tr
              className="border-b border-gray-200 hover:bg-white subtext-font"
              onClick={() =>
                history.push(
                  "/products/" + product.webCode + "?sku=" + product.sku
                )
              }
            >
              <td className="py-3 px-6 text-left whitespace-nowrap">
                <div className="flex flex-col space-y-1">
                  <span className="font-medium block text-lg">
                    {product.name}
                  </span>
                  <span className="block text-md">{product.brand.name} </span>
                </div>
              </td>
              <td className="py-3 px-6 text-left">
                <div className="flex items-center">
                  <span>{product.color}</span>
                </div>
              </td>
              <td className="py-3 px-6 text-center">
                <span className="text-green-700">{product.retailPrice}</span>
              </td>
              <td className="py-3 px-6 text-center">
                <a className="text-pink-400">{product.sku}</a>
              </td>
              <td className="py-3 px-6 text-center">{product.dateAdded}</td>
              <td className="py-3 px-6 text-center">{product.inStock}</td>
              <td className="py-3 px-6 text-center">{product.sold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
