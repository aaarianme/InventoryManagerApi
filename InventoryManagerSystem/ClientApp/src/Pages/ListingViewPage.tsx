import React, { ReactElement, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import ListingsPreviewTable from "../components/ListingsPreviewTable";
import { useFetch, useGetRequest, usePost } from "../Hooks/RequestHooks";
import { SolidNavBar } from "../components/NavBar";
import LoadingSpinner from "../components/LoadingSpinner";
import SublistingsPreviewTable from "../components/SublistingsPreviewTable";
import { BasicAlert, ServerExceptionAlert } from "../components/Alerts/Alerts";
import { TabPageWithHeadline } from "../components/Tabs/TabPages";
import Tab from "../components/Tabs/Tab";
import usePopUpManager from "../Hooks/usePopUpManager";
import {
  PopUpTrigger,
  LoadingPopUp,
  ErrorPopUp,
  YesCancelPopUp,
  MakeSalesPopUp,
  DatePickerPopUp,
  MessagePopup,
} from "../components/Alerts/PopUps";
import { useReducer } from "react";
import DatePicker from "../components/Inputs/DatePicker";

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
  record: string;
  date: string;
  cost: string;
  soldPrice: string;
  listing: IListing;
  sublisting: ISublisting;
  notes: string;
}
interface IListingViewPageState {
  listing: IListing;
  pendingSaleRecord: ISaleRecord | undefined;
  isPageLoaded: boolean;
  pageError?: any;
}

enum ActionKind {
  SetListing = "SetListing",
  SetPageError = "SetPageError",
  LoadedTrue = "LoadedTrue",
  LoadedFalse = "LoadedFalse",
  UpdateSublistings = "UpdateSublistings",
  setPendingSaleRecord = "setPendingSaleRecord",
  removePendingSaleRecord = "removePendingSaleRecord",
}

type ACTION = {
  type: ActionKind;
  payload?: any;
};

function reducer(
  state: IListingViewPageState,
  action: ACTION
): IListingViewPageState {
  switch (action.type) {
    case ActionKind.SetListing:
      return { ...state, listing: action.payload.listing };
    case ActionKind.LoadedFalse:
      return { ...state, isPageLoaded: false };
    case ActionKind.LoadedTrue:
      return { ...state, isPageLoaded: true };
    case ActionKind.UpdateSublistings:
      return {
        ...state,
        listing: { ...state.listing, sublistings: action.payload },
      };
    case ActionKind.SetPageError:
      console.log({ ...action.payload.pageError });
      return {
        ...state,
        pageError: { ...action.payload.pageError, hasError: true },
        isPageLoaded: true,
      };
    case ActionKind.setPendingSaleRecord:
      return { ...state, pendingSaleRecord: action.payload };
    case ActionKind.removePendingSaleRecord:
      return { ...state, pendingSaleRecord: undefined };
    default:
      return state;
  }
}

export default function ListingViewPage() {
  const [state, dispatch] = useReducer(reducer, {
    isPageLoaded: false,
  } as IListingViewPageState);
  const { listing } = state;
  useEffect(() => {
    console.log("state is ", state);
  }, [state]);
  const postRequest = usePost();
  const getRequest = useGetRequest();

  const { listingId, productName }: any = useParams();

  const history = useHistory();
  const popUpManager = usePopUpManager();

  //#region  setup page data and content
  const getFullListingData = async () => {
    var res: any = await getRequest(`api/listings/${listingId}`, false);
    return res;
  };
  const pageSetUp = async () => {
    dispatch({ type: ActionKind.LoadedFalse });
    let res: any = await getFullListingData();
    let finalRes = res.data.listing;
    if (res.status === 200) {
      dispatch({
        type: ActionKind.SetListing,
        payload: { listing: finalRes },
      });
    } else
      dispatch({ type: ActionKind.SetPageError, payload: { pageError: res } });
    dispatch({ type: ActionKind.LoadedTrue });
  };
  useEffect(() => {
    pageSetUp();
  }, []);
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
  //#endregion

  //#region within component requests for diffrent actions
  async function autoAddSublistingRequest() {
    var res: any = await postRequest(
      "api/listings/" + listing.listingId + "/autoCompleteSublistings"
    );
    if (res.status == 200) await pageSetUp();
    else
      popUpManager.setPopUp(
        <YesCancelPopUp
          declineButtonText="Never Mind"
          declineFunction={popUpManager.removePopUp}
          message={"Unable to auto add sublistings. " + res.data?.message}
          acceptFunction={autoAddSublistingRequest}
          acceptButtonText="Retry"
          header="Ooops"
        />
      );
  }

  async function handleListingDelete() {
    popUpManager.setPopUp(<LoadingPopUp isVisible={true} />);
    var res: any = await postRequest(`api/listings/${listingId}/delete`);
    if (res.status === 200) {
      popUpManager.removePopUp();
      history.push("/listings");
      return;
    }
    popUpManager.setPopUp(
      <ErrorPopUp
        onClose={popUpManager.removePopUp}
        canRetry={true}
        retryFunction={handleListingDelete}
        retryButtonText={"Delete Listing #" + listingId}
        header="Could not delete listing."
        message="Please check console messages and/or retry"
      />
    );
  }

  async function addQuantityToListing() {
    dispatch({ type: ActionKind.LoadedFalse });
    var res: any = await postRequest(`api/listings/${listingId}/update`, {
      ...state.listing,
      quantity: state.listing.quantity + 1,
    });
    if (res.status === 200) await autoAddSublistingRequest();
    else
      popUpManager.setPopUp(
        <ErrorPopUp
          onClose={popUpManager.removePopUp}
          canRetry={false}
          header="Failed to proccess your request"
          message={
            "We werent able to add a sublisting to this listing, do not try this again as it will likely encounter an error again." +
            res.data?.message
          }
        />
      );
    dispatch({ type: ActionKind.LoadedTrue });
  }

  async function handleDeadlineUpdate(newDeadline: string | null) {
    var res: any = await postRequest(`api/listings/${listingId}/update`, {
      ...listing,
      deadline: newDeadline,
    });
    if (res.status === 200) await pageSetUp();
    else
      popUpManager.setPopUp(
        <MessagePopup
          message={
            "Error when updating the deadline value of this lsiting." +
            res.data?.message
          }
          header="Error - deadline was not updated!"
        />
      );
  }

  //#endregion

  //#region listing onStatusChange handlers
  /**
   * gets from the api and sets new sublistings
   * @param newStatus
   * @param forListingId
   */
  const helper_getNewSublistings = async () => {
    let res: any = await getRequest(`api/listings/${listingId}/sublistings`);
    if (res.status === 200)
      dispatch({
        type: ActionKind.UpdateSublistings,
        payload: res.data.sublistings,
      });
    else
      popUpManager.setPopUp(
        <ErrorPopUp
          canRetry={true}
          retryFunction={pageSetUp}
          header="Error when loading sublistings"
          message="Reload the entire listing data. If that doesnt help reload manually."
          retryButtonText="Reload Page"
          onClose={popUpManager.removePopUp}
        />
      );
  };
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
      var currentListingStatus = listing.status;
      dispatch({
        type: ActionKind.SetListing,
        payload: {
          listing: {
            ...state.listing,
            status: newStatus,
          },
        },
      });

      var res: any = await postRequest(
        `api/listings/${forListingId}/update/status`,
        {},
        { status: newStatus }
      );
      if (res.status !== 200) {
        dispatch({
          type: ActionKind.SetListing,
          payload: {
            listing: {
              ...state.listing,
              status: newStatus,
            },
          },
        });
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
      case "Partially In Stock":
      case "Canceled":
        await helper_changeListingStatus(newStatus, forListingId);
        break;
    }
    await helper_getNewSublistings();
  }
  //#endregion

  //#region Sale/status update Handlers
  useEffect(() => {
    if (state.pendingSaleRecord != undefined) {
      popUpManager.setPopUp(
        <MakeSalesPopUp
          onSubmit={submitSalesRequestHandler}
          initialCost={listing.cost}
          initialDate={new Date().toLocaleDateString()}
          onClose={salePopUpOnCloseHandler}
        ></MakeSalesPopUp>
      );
    }
  }, [state.pendingSaleRecord]);
  const salePopUpOnCloseHandler = () => {
    dispatch({ type: ActionKind.removePendingSaleRecord });
    popUpManager.removePopUp();
  };
  /**
   *
   * @param ref
   * @param id
   * @returns
   */
  async function makeSalesHandler(ref: string, id: number) {
    console.log("new pending");

    let _sublisting = listing.sublistings.filter(
      (x) => x.sublistingId == id && x.sublistingRef == ref
    )[0];
    if (_sublisting == null || _sublisting == undefined) {
      dispatch({ type: ActionKind.removePendingSaleRecord });
      return;
    }
    dispatch({
      type: ActionKind.setPendingSaleRecord,
      payload: {
        listing: listing,
        sublisting: _sublisting,
        cost: listing.cost,
        date: new Date().toLocaleDateString(),
      } as ISaleRecord,
    });
  }
  /**
   *
   * @param newStatus
   * @param sublistingId
   */
  async function updateSublistingStatus(
    newStatus: string,
    sublistingId: number
  ) {
    let allSublistings_new = state.listing.sublistings.map((x) =>
      x.sublistingId == sublistingId ? { ...x, status: newStatus } : x
    );
    dispatch({
      type: ActionKind.UpdateSublistings,
      payload: allSublistings_new,
    });

    let sublis = listing.sublistings.filter(
      (x) => x.sublistingId == sublistingId
    )[0];
    var res: any = await postRequest("api/sublistings/update", {
      ...sublis,
      status: newStatus,
    });
    if (res.status != 200) {
      popUpManager.setPopUp(
        <MessagePopup
          header={"Somethign went wrong."}
          message={"Couldnt update sublisting. " + res.data?.message}
        />
      );
      pageSetUp();
    }
  }
  /**
   *
   * @param soldPrice
   * @param date
   * @param cost
   * @returns
   */
  async function submitSalesRequestHandler(
    soldPrice: string,
    date: string,
    cost: string
  ) {
    let saleRecordObj = {
      ...state.pendingSaleRecord,
      cost: cost,
      date: date,
      soldPrice: soldPrice,
    };
    let res: any = await postRequest(
      "/api/sales/new",
      saleRecordObj as ISaleRecord
    );
    popUpManager.removePopUp();
    if (res.status === 200) {
      let allSublistings = state.listing.sublistings.map((x) =>
        x.sublistingId == state.pendingSaleRecord?.sublisting.sublistingId
          ? { ...x, status: "SOLD", salesRecord: res.data.saleNumber }
          : x
      );
      dispatch({ type: ActionKind.UpdateSublistings, payload: allSublistings });
      return;
    }
    popUpManager.setPopUp(
      <MessagePopup
        onClose={popUpManager.removePopUp}
        header="Congrats on your sale, But some error happend."
        message={`The total was ${
          parseFloat(soldPrice) - parseFloat(cost)
        }. Sale Number could not be created. check console messages. Go to url sales/new to add a new sale manually`}
        buttonText={`Okay.`}
      />
    );
  }

  //#endregion

  return (
    <>
      {state.isPageLoaded === true &&
        //#region page body
        (state.pageError == null ? (
          <>
            <SolidNavBar
              header={"Listing #" + listingId}
              link={"/listings/1/" + productName}
            ></SolidNavBar>
            <div className="px-20 border-b border-t pt-2 pb-4 shadow-sm mt-1">
              <div className="flex justify-end gap-3 px-2">
                <a
                  href={`/listings/${listingId}${
                    productName != undefined ? "/" + productName : ""
                  }/edit`}
                  className="mb-2 text-lg cursor-pointer text-blue-500"
                >
                  <i className="fas fa-edit"></i>
                </a>
                <label
                  onClick={() =>
                    popUpManager.setPopUp(
                      <YesCancelPopUp
                        declineFunction={popUpManager.removePopUp}
                        declineButtonText="No keep it"
                        message="Are you sure you want to delete this listing?"
                        header="Delete listing"
                        acceptFunction={handleListingDelete}
                        acceptButtonText="Yes, Delete it."
                      />
                    )
                  }
                  className="mb-2 text-lg cursor-pointer text-red-700"
                >
                  <i className="fas fa-trash-alt"></i>
                </label>
                <a
                  href="/listings"
                  className="mb-2 text-lg cursor-pointer text-gray-600 hover:text-gray-700"
                >
                  <i className="fas fa-arrow-circle-left"></i>
                </a>
              </div>
              <ListingsPreviewTable
                onStatusChange={(newStatus: string, forListingId: number) =>
                  handleListingStatusChangeUpdate(newStatus, forListingId)
                }
                showActions={false}
                listings={[listing]}
                insertStatusFunc={insertListingStatus}
              ></ListingsPreviewTable>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <>
                {listing.sublistings !== null &&
                listing.sublistings !== undefined &&
                listing.sublistings.length == listing.quantity ? (
                  <SublistingsPreviewTable
                    onSaleSubmit={(ref: string, id: number) =>
                      makeSalesHandler(ref, id)
                    }
                    onStatusChangeSubmit={updateSublistingStatus}
                    wrapperClasses="px-20 py-8"
                    sublistings={listing.sublistings}
                  ></SublistingsPreviewTable>
                ) : (
                  <div className="px-32 pt-20">
                    <BasicAlert color="red" header="Heads Up!">
                      <p>
                        Somehow this listing has{" "}
                        {listing.quantity - listing.sublistings.length} missing
                        sublistings. You won't be able to see stats and make
                        sales unless this information is added.{" "}
                        <a
                          href={
                            "/listings/" +
                            listingId +
                            "/" +
                            productName +
                            "/sublistings/edit"
                          }
                          className="bg-gray-600 px-1 rounded text-white"
                        >
                          Add
                        </a>{" "}
                        them manually or{" "}
                        <span
                          className="bg-gray-600 px-1 rounded text-white cursor-pointer"
                          onClick={() => autoAddSublistingRequest()}
                        >
                          {" "}
                          Auto Complete
                        </span>{" "}
                        all sublistings.
                      </p>
                    </BasicAlert>
                  </div>
                )}
              </>

              <TabPageWithHeadline wrapperClasses="mt-7 mr-10">
                <Tab label="Actions">
                  <div className="px-6 flex flex-col space-y-0">
                    <div className="flex flex-row gap-2">
                      <button
                        onClick={() => {
                          popUpManager.setPopUp(
                            <DatePickerPopUp
                              onSubmit={(newDeadline: string | null) => {
                                handleDeadlineUpdate(newDeadline);
                              }}
                              allowNulls={true}
                              selectedDate={listing.deadline}
                              onClose={popUpManager.removePopUp}
                            />
                          );
                        }}
                        type="button"
                        className="mt-2 w-full inline-flex justify-center border rounded-tr-lg rounded-bl-lg px-4 py-2 white text-base font-medium text-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Deadline Settings
                      </button>
                    </div>
                    <div className="flex flex-row gao-2">
                      <button
                        onClick={() => {
                          history.push(
                            "/listings/new?selectedProduct=" +
                              listing.product.webCode
                          );
                        }}
                        type="button"
                        className="mt-2 w-full inline-flex justify-center border rounded-tr-lg rounded-bl-lg px-4 py-2 white text-base font-medium text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Got some more?
                      </button>
                      <button
                        onClick={() => {
                          popUpManager.setPopUp(
                            <YesCancelPopUp
                              acceptFunction={addQuantityToListing}
                              acceptButtonText="Yes, Im sure."
                              declineButtonText="Never Mind"
                              declineFunction={popUpManager.removePopUp}
                              header="Add a Sublisting?"
                              message="Are you sure you want to add a sublisting? you can always delete 'Recieved' sublistings, any sublisting added will always remain under this listing. The status of the new sublisting will always default to 'Not Recieved'."
                            />
                          );
                        }}
                        type="button"
                        className="mt-2 w-full inline-flex justify-center border rounded-tr-lg rounded-bl-lg px-4 py-2 white text-base font-medium text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Add one more pair?
                      </button>
                      <button
                        onClick={() => {
                          popUpManager.setPopUp(
                            <YesCancelPopUp
                              acceptFunction={addQuantityToListing}
                              acceptButtonText="Yes, Delete one."
                              declineButtonText="Never Mind"
                              declineFunction={popUpManager.removePopUp}
                              header="Remove a Sublisting?"
                              message="Are you sure you want to delete a sublisting? you can always add a new sublisting under this listing, any sublisting added will always remain under this listing. By clicking Delete we will only delete 1 sublisting with the status of 'Recieved'. If nothing found we wont be able to delete any sublistings."
                            />
                          );
                        }}
                        type="button"
                        className="mt-2 w-full inline-flex justify-center border rounded-tr-lg rounded-bl-lg px-4 py-2 white text-base font-medium text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Remove a pair?
                      </button>
                    </div>
                  </div>
                </Tab>
                <Tab label="Notes">
                  {listing.notes == "" || listing.notes == null ? (
                    <div className="text-center w-full text-gray-400 italic text-font">
                      Empty :( Want to leave notes? Edit this listing to add
                      your notes.
                    </div>
                  ) : (
                    <div>{listing.notes}</div>
                  )}
                </Tab>
                <Tab label="Product">
                  <div className="px-8 pt-2 flex flex-row gap-1">
                    {listing.product.image != null && (
                      <img
                        className="object-contain w-64 h-64"
                        src={listing.product.image}
                      />
                    )}
                    <div className="flex flex-col pt-1 subtext-font text-gray-600">
                      <p className="text-gray-800">
                        {listing.product.brand.name} {listing.product.name}
                        <a
                          className="ml-2 mr-1 text-blue-400"
                          href={"/products/" + listing.product.webCode}
                        >
                          {" "}
                          <i className="fas fa-share-square"></i>
                        </a>
                      </p>
                      <p>
                        Retail: {listing.product.retailPrice ?? "No Data :("}
                      </p>
                      {listing.product.notes != null && (
                        <p>Product Notes: {listing.product.notes}</p>
                      )}
                    </div>
                  </div>
                </Tab>
              </TabPageWithHeadline>
            </div>
          </>
        ) : (
          //#endregion
          //#region page error
          <ServerExceptionAlert
            status={state.pageError?.status}
            data={state.pageError?.data}
            config={state.pageError?.config}
          />
        ))}
      <PopUpTrigger key={"popUpTrigger"} manager={popUpManager}></PopUpTrigger>
      {popUpManager.returnPopUp(
        <LoadingPopUp isVisible={!state.isPageLoaded}></LoadingPopUp>
      )}
    </>
  );
}
