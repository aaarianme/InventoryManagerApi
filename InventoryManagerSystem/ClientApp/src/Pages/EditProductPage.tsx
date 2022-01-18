import React, { useState, useEffect } from "react";
import DatePicker from "../components/Inputs/DatePicker";

export default function EditProductPage() {
  const [state, setState] = useState<string | null>(null);
  useEffect(() => {
    console.log("new state in the main page", state);
  }, [state]);
  return (
    <div className="px-10 pt-10">
      <div className="grid grid-cols-3 gap-4">
        {" "}
        <div className="flex flex-col border border-gray-300 white text-base rounded-md shadow-sm cursor-pointer">
          <div className="flex flex-row subtext-font pl-2 text-gray-700">
            <div className="flex flex-col w-full pt-2">
              <div className="flex w-full justify-between">
                <div className="flex flex-row gap-3">
                  <img
                    className="object-contain h-16"
                    src="https://images.stockx.com/360/Nike-Air-Max-95-OG-Neon-2020/Images/Nike-Air-Max-95-OG-Neon-2020/Lv2/img01.jpg?auto=compress&w=480&q=90&dpr=1&updated_at=1609443450&h=320&fm=webp"
                  ></img>
                  <div className="flex flex-col justify-center">
                    <span className="block text-lg">Nike</span>
                    <small className="block text-xs text-gray-400 text-font">
                      colorway
                    </small>
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-2 ml-2 pb-2">
                <small className="text-xs  px-1 border text-font text-gray-500">
                  Date sold: 12/12/2002
                </small>
                <small className="text-xs  px-1 border text-font text-white bg-gray-600">
                  30 days ago
                </small>
                <small className="text-xs  px-1 border rounded text-font text-white bg-pink-600">
                  Payout: $136
                </small>
              </div>
            </div>

            <div className="flex flex-col justify-center h-auto bg-green-400 shadow-sm rounded-tr rounded-br px-2 ">
              <span className="text-white text-xl header-font uppercase font-bold">
                $86
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
/*<div className="flex flex-col border border-gray-300 white text-base">
          <div className="block subtext-font px-2 text-gray-700 text-center pt-3 pb-1">
            <span className="block"> Air Max Plus 3</span>
            <small className="block text-xs text-gray-400 text-font">
              colorway
            </small>
          </div>

          <div className="flex flex-1 justify-center h-auto pt-3 pb-3 bg-green-400 mx-2 rounded ">
            <span className="text-white text-4xl header-font uppercase font-bold">
              $86
            </span>
          </div>
          <div className="text-xs text-gray-500 px-3 pt-1 pb-1 flex flex-row justify-center gap-2">
            <span>Date sold: 12/12/2002</span>
            <span>30 days ago</span>
          </div>
        </div>*/
