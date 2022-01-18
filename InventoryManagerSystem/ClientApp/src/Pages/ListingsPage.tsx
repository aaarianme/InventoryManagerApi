import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { useFetch, useGetRequest, usePost } from "../Hooks/RequestHooks";
import ListingsPreviewTable from "../components/ListingsPreviewTable";
import { NavBar } from "../components/NavBar";
import DropDownMenu from "../components/DropDownMenu";
import useSearchParams from "../Hooks/useSearchParamsHook";
import { useLocation } from "react-router";
import { BasicAlert } from "../components/Alerts/Alerts";
import { ErrorPopUp, YesCancelPopUp } from "../components/Alerts/PopUps";
import usePopUpManager from "../Hooks/usePopUpManager";
import { useReducer } from "react";

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
}
interface ISublisting {
  sublistingId: number;
  sublistingRef: string;
  salesRecord?: number | null;
  status: string;
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
interface IPageState {
  loaded: boolean;
  listings: Array<IListing>;
  allListingsCopy: Array<IListing>;
  showSolds: boolean;
}
interface ISearchFilterParams {
  searchFor: string;
  brand: string;
  status: string;
  sort: string;
}
enum ActionKind {
  setLoadedTrue = "",
  setLoadedFalse = "",
  setListings = "setListings",
  setAllListingsCopy = "setAllListingsCopy",
  setShowSolds = "setShowSolds",
}
type ACTION = {
  type: ActionKind;
  payload?: any;
};
function reducer(state: IPageState, action: ACTION): IPageState {
  switch (action.type) {
    case ActionKind.setAllListingsCopy:
      return { ...state, allListingsCopy: action.payload };
    case ActionKind.setListings:
      return { ...state, listings: action.payload, loaded: true };
    case ActionKind.setLoadedFalse:
      return { ...state, loaded: false };
    case ActionKind.setLoadedTrue:
      return { ...state, loaded: action.payload };
    case ActionKind.setShowSolds:
      return { ...state, showSolds: action.payload };
    default:
      return state;
  }
}

export default function ListingsPage() {
  const [state, dispatch] = useReducer(reducer, {
    loaded: false,
  } as IPageState);
  const listings = state.listings;
  const getRequest = useGetRequest();
  const popUpManager = usePopUpManager();
  const postRequest = usePost();
  const getPageData = async (fullQueryParams: string = "") => {
    return await getRequest("api/listings" + fullQueryParams, false);
  };
  function insertListingStatus(listing: IListing): string {
    let totalCount = listing.sublistings.length;
    let recievedCount: number = 0,
      notRecievedCount: number = 0,
      canceledCount: number = 0,
      SoldCount: number = 0,
      returnedCount: number = 0;
    listing.sublistings.forEach((sublisting) => {
      if (sublisting.status == "Recieved") recievedCount++;
      if (sublisting.status == "Not Recieved") notRecievedCount++;
      if (sublisting.status == "CANCELED") canceledCount++;
      if (sublisting.status == "SOLD") SoldCount++;
      if (sublisting.status == "Returned") returnedCount++;
    });
    if (notRecievedCount == totalCount) return "Not In Stock";
    if (recievedCount == totalCount) return "In Stock";
    if (SoldCount == totalCount) return "Sold";
    if (canceledCount == totalCount) return "Canceled";
    if (returnedCount == totalCount) return "Returned";
    if (recievedCount != 0) return "Partially In Stock";
    if (notRecievedCount == 0 && recievedCount == 0) {
      return "Finished";
    }
    return "Finished";
  }
  useEffect(() => {
    const setUp = async () => {
      let res: any = await getPageData();
      if (res.status === 200) {
        let completedList: Array<IListing> = res.data.listings.map(
          (x: IListing) => ({ ...x, status: insertListingStatus(x) })
        );
        console.log(completedList);
        dispatch({
          type: ActionKind.setAllListingsCopy,
          payload: completedList,
        });
        dispatch({
          type: ActionKind.setListings,
          payload: completedList,
        });
        filterListings(searchParams as ISearchFilterParams, completedList);
      } else {
      }
    };
    setUp();
  }, []);

  //#region All Search Params
  const location = useLocation();
  const _searchFor = new URLSearchParams(location.search).get("searchFor");
  const _status = new URLSearchParams(location.search).get("status");
  const _brand = new URLSearchParams(location.search).get("brand");
  const _sort = new URLSearchParams(location.search).get("sort");
  //#endregion

  //#region Hanlde search function and states for Filters
  const [searchParams, setSearchParams] = useSearchParams({
    searchFor: _searchFor,
    brand: _brand,
    status: _status,
    sort: _sort,
  });

  function filterListings(
    filters: ISearchFilterParams,
    allListings?: Array<IListing>
  ) {
    if (state.allListingsCopy == undefined && allListings == undefined) return;
    let newListings = state.allListingsCopy ?? allListings;

    if (state.showSolds !== true) {
      newListings = newListings.filter((x) => x.status != "Sold");
    }

    if (filters.brand !== undefined) {
      newListings = newListings.filter((x) => {
        if (x.product.brand.name.toLowerCase() == filters.brand.toLowerCase())
          return true;
        return false;
      });
    }
    if (filters.searchFor !== undefined) {
      newListings = newListings.filter((x) => {
        if (
          x.product.name
            ?.toLowerCase()
            .includes(filters.searchFor.toLowerCase()) ||
          x.product.webCode?.toLowerCase() == filters.searchFor.toLowerCase() ||
          x.product.brand.name
            ?.toLowerCase()
            .includes(filters.searchFor.toLowerCase()) ||
          x.listingId.toString() == filters.searchFor.toLowerCase() ||
          x.product.color
            ?.toLowerCase()
            .includes(filters.searchFor.toLowerCase()) ||
          x.product.sku?.toLowerCase().includes(filters.searchFor.toLowerCase())
        )
          return true;
        return false;
      });
    }
    if (filters.status !== undefined) {
      newListings = newListings.filter((x) => {
        if (x.status.toLowerCase() == filters.status.toLowerCase()) return true;
        return false;
      });
    }
    if (filters.sort !== undefined) {
      switch (filters.sort) {
        case "priceLowToHigh":
          newListings.sort((a: IListing, b: IListing) => {
            if (a.cost > b.cost) return 1;
            return -1;
          });
          break;
        case "priceHighToLow":
          newListings.sort((a: IListing, b: IListing) => {
            if (a.cost > b.cost) return -1;
            return 1;
          });
        case "datePurchasedNewest":
          newListings.sort((a: IListing, b: IListing) => {
            if (
              new Date(a.datePurchased).getTime() >
              new Date(b.datePurchased).getTime()
            )
              return -1;
            return 1;
          });
          break;
        case "LatestDeadline":
          newListings.sort((a: IListing, b: IListing) => {
            if (new Date(a.deadline).getTime() > new Date(b.deadline).getTime())
              return -1;
            return 1;
          });
          break;
        case "ClosestDeadline":
          newListings.sort((a: IListing, b: IListing) => {
            if (new Date(a.deadline).getTime() > new Date(b.deadline).getTime())
              return 1;
            return -1;
          });
          break;
        case "datePurchasedNewestDSC":
          newListings.sort((a: IListing, b: IListing) => {
            if (
              new Date(a.datePurchased).getTime() >
              new Date(b.datePurchased).getTime()
            )
              return 1;
            return -1;
          });
          break;
      }
    }

    dispatch({ type: ActionKind.setListings, payload: newListings });
  }
  useEffect(() => {
    console.log("params", searchParams);
    filterListings(searchParams as ISearchFilterParams);
  }, [searchParams, state.showSolds]);
  //#endregion
  //#region handle Listing status change request
  async function handleListingStatusChangeUpdate(
    newStatus: string,
    forListingId: number
  ) {
    /**
     *
     * @param newStatus Changes internal state, performs action on the api
     * @param forListingId
     */
    const helper_changeListingStatus = async (
      newStatus: string,
      forListingId: number
    ) => {
      var currentListingStatus = listings.filter(
        (x) => x.listingId == forListingId
      )[0].status;
      let newListings = listings.map((x) =>
        x.listingId == forListingId ? { ...x, status: newStatus } : x
      );
      dispatch({ type: ActionKind.setListings, payload: newListings });

      var res: any = await postRequest(
        `api/listings/${forListingId}/update/status`,
        {},
        { status: newStatus }
      );
      if (res.status !== 200) {
        let newListings = listings.map((x) =>
          x.listingId == forListingId
            ? { ...x, status: currentListingStatus }
            : x
        );
        dispatch({ type: ActionKind.setListings, payload: newListings });

        popUpManager.setPopUp(
          <ErrorPopUp
            header="Error"
            canRetry={true}
            retryFunction={() =>
              handleListingStatusChangeUpdate(newStatus, forListingId)
            }
            message={
              "Couldnt change listing status for listing #" +
              forListingId +
              ". " +
              res.data?.message
            }
          />
        );
      }
    };
    switch (newStatus) {
      case "To be Returned":
      case "Returned":
      case "Return Pending":
      case "In Stock":
      case "Sent Out":
      case "Canceled":
        await helper_changeListingStatus(newStatus, forListingId);
        break;
    }
  }
  //#endregion

  return (
    <>
      <NavBar header="Listings" color="bg-darkred"></NavBar>
      <div className="mx-12 block pt-2 pb-2 px-8 border-b flex justify-between">
        <div className="px-3 mt-1">
          <div className="flex gap-2">
            <input
              placeholder="Search"
              onChange={(ev) => setSearchParams({ searchFor: ev.target.value })}
              value={searchParams["searchFor"] ?? null}
              className="inline-blockw-64 pt-1 pb-1 border border-gray-300 shadow-sm rounded-md text-center outline-none focus:outline-none"
            />
            <DropDownMenu
              clickHandler={(val: any) => setSearchParams({ sort: val })}
              defaultValue={_sort}
              fetchFrom={null}
              defaultItems={[
                { displayName: "None", value: null },
                { displayName: "Price Low-High", value: "priceLowToHigh" },
                { displayName: "Price High-Low", value: "priceHighToLow" },
                {
                  displayName: "Newest Purchased",
                  value: "datePurchasedNewest",
                },
                { displayName: "Closest Deadline", value: "ClosestDeadline" },
                { displayName: "Latest Deadline", value: "LatestDeadline" },
                {
                  displayName: "Newest Purchased DSC",
                  value: "datePurchasedNewestDSC",
                },
              ]}
            ></DropDownMenu>
            <button
              type="button"
              onClick={() =>
                dispatch({
                  type: ActionKind.setShowSolds,
                  payload: !state.showSolds,
                })
              }
              className={
                state.showSolds
                  ? "w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  : "w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 white text-base font-medium text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              }
            >
              {state.showSolds == true ? "Hide Solds" : "Show Sold"}
            </button>
            <label className="subtext-font-font pt-2">
              {listings ? listings.length : 0} items found
            </label>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          {Object.keys(searchParams).length === 0 &&
          searchParams.constructor === Object ? (
            <a href="/listings/new">Add New</a>
          ) : (
            <a
              href="/listings"
              className="bg-red-600 text-white text-xs rounded px-1"
            >
              Clear All
            </a>
          )}
        </div>
      </div>
      {state.loaded ? (
        <div className="px-14 pt-4 pb-10">
          {listings.length > 0 ? (
            <ListingsPreviewTable
              onStatusChange={handleListingStatusChangeUpdate}
              listings={listings}
            ></ListingsPreviewTable>
          ) : (
            <BasicAlert
              color="yellow"
              header="Try removing filters!"
              wrapperClasses={"mx-64"}
            >
              <p>
                Nothing was found. To remove filters you can click{" "}
                <a href="/listings">here</a>.
              </p>
            </BasicAlert>
          )}
        </div>
      ) : (
        <div className="pt-48 px-64">
          <LoadingSpinner loadingText=""></LoadingSpinner>
        </div>
      )}
    </>
  );
}
