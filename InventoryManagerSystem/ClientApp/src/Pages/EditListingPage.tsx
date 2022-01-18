import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useFetch, usePost } from "../Hooks/RequestHooks";
import LoadingSpinner from "../components/LoadingSpinner";
import { LineAlert, ServerExceptionAlert } from "../components/Alerts/Alerts";
import DatePicker from "../components/Inputs/DatePicker";
import {
  LinkPopUp,
  MessagePopup,
  YesCancelPopUp,
  CustomPopUp,
} from "../components/Alerts/PopUps";
import usePopUpManager from "../Hooks/usePopUpManager";
import { PopUpTrigger } from "../components/Alerts/PopUps";

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
  sublistings: any;
}
export default function EditListingPage() {
  //#region page data management
  const [loaded, res, getRes] = useFetch({ data: {} });
  const listing: IListing = res.data.listing ?? {};
  const { listingId }: any = useParams();
  const { productName }: any = useParams();
  const getData = async () => {
    await getRes("api/listings/" + listingId);
  };
  const [updatedState, setUpdatedState] = useState(listing);
  //#endregion

  //#region custom hooks
  const postRequest = usePost();
  const popUpManager = usePopUpManager();
  //#endregion

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setUpdatedState(listing);
    console.log("listing was changed");
  }, [listing]);

  useEffect(() => {
    console.log("updatedstate was changed to", updatedState);
  }, [updatedState]);

  async function submitHandler() {
    var res: any = await postRequest(
      "api/listings/" + listing.listingId + "/update",
      updatedState
    );
    if (res.status == 200)
      popUpManager.setPopUp(
        <LinkPopUp
          header="Information Updated!"
          message="This listing is now updated. You can go back to the listing page to view more info."
          buttonText="Go back"
          link={`listings/${listingId}`}
        ></LinkPopUp>
      );
    else
      popUpManager.setPopUp(
        <MessagePopup
          buttonText="Ok"
          message={`Something went wrong, check console messages for more details. ${
            res.message != null && res.message != undefined ? res.message : ""
          }`}
          header="Error! Infomation was NOT updated."
        ></MessagePopup>
      );
  }

  return (
    <>
      {loaded === true ? (
        //#region page body
        res.status === 200 ? (
          <>
            <div className="flex mt-5 gap-2 justify-center mx-10">
              <div className="w-full max-w-sm px-4 border-b border-t pt-3 pb-5 shadow-sm mt-1">
                <a
                  href={"/products/" + listing.product.webCode}
                  className="mb-3 subtext-font text-lg text-blue-500 border-b pb-1"
                >
                  {listing.product.name}
                </a>

                <div className="flex flex-wrap -mx-3 mb-6 mt-2">
                  <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Cost
                    </label>
                    <input
                      value={updatedState.cost}
                      onChange={(ev) => {
                        ev.persist();
                        setUpdatedState((preval) => ({
                          ...preval,
                          cost: ev.target.value,
                        }));
                      }}
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                      id="grid-first-name"
                      type="text"
                      placeholder="$ amount"
                    />
                    <p
                      onClick={() => {
                        setUpdatedState((preval) => ({
                          ...preval,
                          cost: (parseInt(preval.cost) * 1.05).toString(),
                        }));
                      }}
                      className="text-gray-500 text-xs italic bg-pink-400 text-white inline-block rounded px-1 cursor-pointer"
                    >
                      Click To Add 5% tax.
                    </p>
                  </div>
                  <div className="w-full md:w-1/2 px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Size
                    </label>
                    <input
                      value={updatedState.size}
                      onChange={(ev) => {
                        ev.persist();
                        setUpdatedState((preval) => ({
                          ...preval,
                          size: ev.target.value,
                        }));
                      }}
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-last-name"
                      type="text"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Notes
                    </label>
                    <textarea
                      key="notesofthelisting"
                      onChange={(ev) => {
                        ev.persist();
                        setUpdatedState((preval) => ({
                          ...preval,
                          notes: ev.target.value,
                        }));
                      }}
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-password"
                    >
                      {updatedState.notes}
                    </textarea>
                    <p className="text-gray-600 text-xs">
                      Up to 120 characters
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Date Purchased
                    </label>
                    <DatePicker
                      key="dateAddedPicker"
                      onChange={(newDate: string) =>
                        setUpdatedState((preval) => ({
                          ...preval,
                          datePurchased: newDate,
                        }))
                      }
                      selectedDate={updatedState.datePurchased}
                    ></DatePicker>
                  </div>
                </div>

                <div className="justify-end flex px-2">
                  <button
                    onClick={submitHandler}
                    className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Submit
                  </button>
                </div>
              </div>

              <div className="w-auto px-4 border-b border-t pt-3 pb-5 shadow-sm mt-1">
                <div className="flex flex-col justify-end gap-2 px-2 text-3xl">
                  <a
                    href={`/listings/${listingId}/${listing.product.name.replace(
                      / /g,
                      "-"
                    )}
                    `}
                    className="mb-2 text-center cursor-pointer text-gray-600 hover:text-gray-700"
                  >
                    <i className="fas fa-arrow-circle-left"></i>
                  </a>

                  <a
                    className="mb-2 cursor-pointer text-red-700 pb-2"
                    href={"/products/" + listing.product.webCode}
                  >
                    <i className="fas fa-shapes"></i>
                  </a>
                  <label
                    onClick={() => {
                      setUpdatedState({} as IListing);
                      setUpdatedState(listing);
                    }}
                    className="mb-2 cursor-pointer text-gray-200 rounded text-center cursor-pointer"
                  >
                    <i className="fas fa-sync"></i>
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : (
          //#endregion
          //#region page error
          <ServerExceptionAlert
            status={res.status}
            data={res.data}
            config={res.config}
          ></ServerExceptionAlert>
        )
      ) : (
        //#endregion
        <div className="px-64 pt-48">
          <LoadingSpinner
            loadingText={productName ?? "Loading"}
          ></LoadingSpinner>
        </div>
      )}
      <PopUpTrigger manager={popUpManager}></PopUpTrigger>
    </>
  );
}
