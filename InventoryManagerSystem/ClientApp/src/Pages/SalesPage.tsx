import { BasicAlert } from "../components/Alerts/Alerts";
import React from "react";
import { useReducer } from "react";
import { useEffect } from "react";
import { LoadingPopUp, PopUpTrigger } from "../components/Alerts/PopUps";
import SaleCard from "../components/SaleCard";
import { useGetRequest } from "../Hooks/RequestHooks";
import usePopUpManager from "../Hooks/usePopUpManager";
import useSearchParams from "../Hooks/useSearchParamsHook";
import DropDownItem from "../components/DropDownMenu";
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
  image: string;
  notes: string;
}
interface IListing {
  listingId: number;
  cost: string;
  quantity: number;
  status: string;
  size: string;
  notes: string;
  datePurchased: string;
  dateAdded: string;
  deadline: string;
  product: IProduct;
  daysLeftToDeadline: number;
  sublistings: Array<ISublisting>;
}
interface ISublisting {
  sublistingId: number;
  sublistingRef: string;
  salesRecord?: number | null;
  status: string;
}
interface ISaleRecord {
  saleId: number;
  date: string;
  cost: string;
  soldPrice: string;
  listing: IListing;
  sublisting: ISublisting;
  notes: string;
}
enum ActionKind {
  setSalesCopy = "setSalesCopy",
  setSales = "setLoading",
  setLoaded = "setLoaded",
}
type ACTION = {
  type: ActionKind;
  payload?: any;
};
function reducer(state: ISalesPgaeState, action: ACTION): ISalesPgaeState {
  switch (action.type) {
    case ActionKind.setLoaded:
      return { ...state, loaded: action.payload };
    case ActionKind.setSales:
      return { ...state, sales: action.payload };
    case ActionKind.setSalesCopy:
      return { ...state, salesCopy: action.payload };
    default:
      return state;
  }
}
interface ISearchParams {
  searchFor?: string;
  minProfit?: string;
  maxProfit?: string;
  month?: string;
  year?: string;
}
interface ISalesPgaeState {
  sales: Array<ISaleRecord>;
  salesCopy: Array<ISaleRecord>;

  loaded: boolean;
}
export default function SalesPage() {
  const [state, dispatch] = useReducer(reducer, {} as ISalesPgaeState);
  const sales = state.sales;
  const getRequest = useGetRequest();
  const popUpManager = usePopUpManager();
  const pageSetUp = async () => {
    let res: any = await getRequest("api/sales");
    if (res.status == 200) {
      dispatch({ type: ActionKind.setSalesCopy, payload: res.data.sales });
      dispatch({ type: ActionKind.setLoaded, payload: true });
    }
    console.log(res);
  };
  const [searchParams, setSearchParams] = useSearchParams({} as ISearchParams);
  useEffect(() => {
    pageSetUp();
  }, []);
  useEffect(() => {
    filterSales(searchParams as ISearchParams);
  }, [searchParams, state.salesCopy]);
  function filterSales(params: ISearchParams) {
    let filtered = state.salesCopy;
    if (filtered == null) return;

    filtered = filtered.sort((a: ISaleRecord, b: ISaleRecord) => {
      if (new Date(a.date).getTime() > new Date(b.date).getTime()) return -1;
      return 1;
    });

    if (params.searchFor != null) {
      let searchForVal = params.searchFor;
      filtered = filtered.filter(
        (x) =>
          x.saleId.toString() == searchForVal ||
          x.listing.product.name.indexOf(searchForVal) != -1 ||
          x.listing.product.brand.name.toLowerCase() ==
            searchForVal.toLowerCase() ||
          x.listing.product.color.toLowerCase().indexOf(searchForVal) != -1 ||
          x.listing.product.sku.toLowerCase().indexOf(searchForVal) != -1
      );
    }
    if (params.month != null) {
      let monthVal = params.month;
      filtered = filtered.filter(
        (x) => (new Date(x.date).getMonth() + 1).toString() == monthVal
      );
    }
    if (params.year != null) {
      let yearVal = params.year;
      filtered = filtered.filter(
        (x) => new Date(x.date).getFullYear().toString() == yearVal
      );
    }
    if (params.minProfit != null) {
      let minProfit = parseFloat(params.minProfit);
      filtered = filtered.filter(
        (x) => minProfit <= parseFloat(x.soldPrice) - parseFloat(x.cost)
      );
    }
    if (params.maxProfit != null) {
      let maxProfit = parseFloat(params.maxProfit);
      filtered = filtered.filter(
        (x) => maxProfit >= parseFloat(x.soldPrice) - parseFloat(x.cost)
      );
    }
    dispatch({ type: ActionKind.setSales, payload: filtered });
  }
  return (
    <>
      {state.loaded === true && (
        <>
          <div className="flex justify-between px-10 pt-4 pb-3">
            <div className="flex gap-2">
              <input
                placeholder="Search"
                onChange={(ev) =>
                  setSearchParams({ searchFor: ev.target.value })
                }
                value={searchParams["searchFor"] ?? null}
                className="inline-blockw-64 pt-1 pb-1 border border-gray-300 shadow-sm rounded-md text-center outline-none focus:outline-none"
              />
              <input
                placeholder="min profit"
                onChange={(ev) =>
                  setSearchParams({ minProfit: ev.target.value })
                }
                value={searchParams["minProfit"] ?? null}
                className="inline-blockw-64 pt-1 pb-1 border border-gray-300 shadow-sm rounded-md text-center outline-none focus:outline-none"
              />
              <input
                placeholder="max profit"
                onChange={(ev) =>
                  setSearchParams({ maxProfit: ev.target.value })
                }
                value={searchParams["maxProfit"] ?? null}
                className="inline-blockw-64 pt-1 pb-1 border border-gray-300 shadow-sm rounded-md text-center outline-none focus:outline-none"
              />
              <DropDownItem
                clickHandler={(selected: string) => {
                  setSearchParams({ year: selected });
                }}
                defaultDisplay="Year"
                defaultItems={[
                  { displayName: "Year", value: null },
                  {
                    displayName: new Date().getFullYear(),
                    value: new Date().getFullYear(),
                  },
                  {
                    displayName: new Date().getFullYear() - 1,
                    value: new Date().getFullYear() - 1,
                  },
                  {
                    displayName: new Date().getFullYear() - 2,
                    value: new Date().getFullYear() - 2,
                  },
                ]}
              ></DropDownItem>
              <DropDownItem
                clickHandler={(selected: string) => {
                  setSearchParams({ month: selected });
                }}
                defaultDisplay="Month"
                defaultItems={[
                  { displayName: "Month", value: null },
                  { displayName: "Jan", value: "1" },
                  { displayName: "Feb", value: "2" },
                  { displayName: "Mar", value: "3" },
                  { displayName: "Apr", value: "4" },
                  { displayName: "May", value: "5" },
                  { displayName: "Jun", value: "6" },
                  { displayName: "Jul", value: "7" },
                  { displayName: "Aug", value: "8" },
                  { displayName: "Sep", value: "9" },
                  { displayName: "Oct", value: "10" },
                  { displayName: "Nov", value: "11" },
                  { displayName: "Dec", value: "12" },
                ]}
              ></DropDownItem>
            </div>

            <div className="flex flex-row text-xs gap-3">
              {sales != null && sales.length > 0 && (
                <div>
                  <label className="bg-blue-500 text-white rounded px-1 pb-1 pt-1">
                    Total Profit:{" "}
                    <b>
                      {sales
                        .map(
                          (x) => parseFloat(x.soldPrice) - parseFloat(x.cost)
                        )
                        .reduce((t: number, newVal: number) => {
                          return t + newVal;
                        })}
                    </b>
                  </label>
                </div>
              )}
              {sales != null && sales.length > 0 && (
                <div>
                  <label className="bg-gray-700 text-white rounded px-1 pb-1 pt-1">
                    Count: {sales.length}
                  </label>
                </div>
              )}
              {sales != null && sales.length > 0 && (
                <div>
                  <label className="bg-pink-700 text-white rounded px-1 pb-1 pt-1">
                    Avg Profit:{" "}
                    {Math.floor(
                      sales
                        .map(
                          (x) => parseFloat(x.soldPrice) - parseFloat(x.cost)
                        )
                        .reduce((t: number, newVal: number) => {
                          return t + newVal;
                        }) / sales.length
                    )}
                  </label>
                </div>
              )}
            </div>
          </div>
          {sales != null && sales.length > 0 ? (
            <div className="px-10 pt-3">
              <div className="grid grid-cols-3 gap-4">
                {sales.map((sale: ISaleRecord) => (
                  <SaleCard
                    payOut={sale.soldPrice}
                    cost={sale.cost}
                    dateSold={sale.date}
                    name={sale.listing.product.name}
                    brand={sale.listing.product.brand.name}
                    img={sale.listing.product.image}
                  />
                ))}
              </div>
            </div>
          ) : (
            <BasicAlert
              color="yellow"
              header="Try removing filters!"
              wrapperClasses={"mx-64 mt-8"}
            >
              <p>
                Nothing was found. To remove filters you can click{" "}
                <a href="/sales">here</a>.
              </p>
            </BasicAlert>
          )}
        </>
      )}
      <PopUpTrigger manager={popUpManager} />
      {popUpManager.returnPopUp(<LoadingPopUp isVisible={!state.loaded} />)}
    </>
  );
}
