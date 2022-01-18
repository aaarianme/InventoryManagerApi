import React from "react";
interface ISaleCardProps {
  brand?: string;
  colorway?: string;
  img?: string;
  dateSold?: string;
  payOut: string;
  cost: string;
  name: string;
}
export default function SaleCard(props: ISaleCardProps) {
  const profit: number = parseFloat(props.payOut) - parseFloat(props.cost);
  const dateSold =
    props.dateSold == null
      ? null
      : new Date(props.dateSold).toLocaleDateString();
  const daysPassed =
    dateSold == null
      ? null
      : Math.floor(
          (new Date().getTime() - new Date(dateSold).getTime()) /
            (1000 * 60 * 60 * 24)
        );
  return (
    <div className="flex flex-col border border-gray-300 white text-base rounded-md shadow-sm cursor-pointer">
      <div className="flex flex-row subtext-font pl-2 text-gray-700">
        <div className="flex flex-col w-full pt-2">
          <div className="flex w-full justify-between">
            <div className="flex flex-row gap-3">
              {props.img != null && (
                <img className="object-contain h-16" src={props.img}></img>
              )}
              <div className="flex flex-col justify-center">
                <span className="block text-lg">
                  {props.brand} {props.name}
                </span>
                <small className="block text-xs text-gray-400 text-font">
                  {props.colorway}
                </small>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-2 ml-2 pb-2">
            <small className="text-xs  px-1 border text-font text-gray-500">
              Date sold: {dateSold}
            </small>
            {dateSold != null && (
              <small className="text-xs  px-1 border text-font text-white bg-gray-600">
                {daysPassed == 0
                  ? "Today"
                  : daysPassed == 1
                  ? "Yesterday"
                  : daysPassed == 7
                  ? "A week ago"
                  : daysPassed + " days ago"}
              </small>
            )}
            <small className="text-xs  px-1 border rounded text-font text-white bg-pink-600">
              Payout: ${props.payOut}
            </small>
          </div>
        </div>

        <div className={getRightPanelStyles()}>
          <span className="text-xl header-font uppercase font-bold">
            ${profit}
          </span>
        </div>
      </div>
    </div>
  );
  function getRightPanelStyles() {
    let base =
      "flex flex-col justify-center h-auto shadow-sm rounded-tr rounded-br px-2 ";
    if (profit < 0) {
      return base + "bg-red-400 text-white";
    }
    if (profit < 10) {
      return base + "bg-green-200 text-white";
    }
    if (profit < 25) {
      return base + "bg-green-300 text-white";
    }
    if (profit < 40) {
      return base + "bg-green-400 text-white";
    }
    if (profit < 80) {
      return base + "bg-green-500 text-white";
    }
    return base + "bg-green-600 text-white";
  }
}
