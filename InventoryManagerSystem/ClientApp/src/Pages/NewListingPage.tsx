import React, { ReactElement, useReducer, useState } from "react";
import { TabPageWithHeadline } from "../components/Tabs/TabPages";
import Tab from "../components/Tabs/Tab";
import usePopUpManager from "../Hooks/usePopUpManager";
import {
  PopUpTrigger,
  MessagePopup,
  LinkPopUp,
} from "../components/Alerts/PopUps";
import { LineAlert } from "../components/Alerts/Alerts";
import { useGetRequest, usePost } from "../Hooks/RequestHooks";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router";
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
}
interface IListing {
  listingId: number;
  cost: string;
  quantity: string;
  status: string;
  size: string;
  notes: string;
  datePurchased: string;
  dateAdded: string;
  deadline: string | null;
  product: IProduct;
}

interface IPageState {
  newListing: IListing;
  similarProductSearchResult: Array<IProduct> | null;
  similarListingsSearchResult: Array<IListing> | null;
}
enum ActionKind {
  setNewListing = "setNewListing",
  setProductOfNewListing = "setProductOfNewListing",
  setSimilarProductSearchResult = "setSimilarProductSearchResult",
  setSimilarListingsSearchResult = "setSimilarListingsSearchResult",
  resetNewListingRelatedStates = "resetNewListingRelatedStates",
}
type ACTION = {
  type: ActionKind;
  payload?: any;
};
function reducer(state: IPageState, action: ACTION): IPageState {
  switch (action.type) {
    case ActionKind.setNewListing:
      return { ...state, newListing: action.payload };
    case ActionKind.setSimilarProductSearchResult:
      return {
        ...state,
        similarProductSearchResult: action.payload,
      };
    case ActionKind.setProductOfNewListing:
      return {
        ...state,
        newListing: { ...state.newListing, product: action.payload },
      };
    case ActionKind.setSimilarProductSearchResult:
      return { ...state, similarProductSearchResult: action.payload };
    case ActionKind.resetNewListingRelatedStates:
      return {
        ...state,
        similarProductSearchResult: [],
        similarListingsSearchResult: null,
        newListing: {
          datePurchased: new Date().toLocaleDateString(),
        } as IListing,
      };
    case ActionKind.setSimilarListingsSearchResult:
      return { ...state, similarListingsSearchResult: action.payload };
    default:
      return state;
  }
}
export default function NewListingPage() {
  const [state, dispatch] = useReducer(reducer, {
    newListing: { datePurchased: new Date().toLocaleDateString() },
  } as IPageState);
  const { newListing } = state;

  const popUpManager = usePopUpManager();
  const getRequest = useGetRequest();
  const postRequest = usePost();
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    console.log(state);
  }, [state]);

  //#region Initialize The Page with given url params
  const setSelectedProduct = async (product: IProduct) => {
    dispatch({
      type: ActionKind.setProductOfNewListing,
      payload: product,
    });
    history.push(location.pathname + "?selectedProduct=" + product.webCode);
  };
  useEffect(() => {
    const internal_autoSetProduct = async (
      selectedProductSearchTerm: string
    ) => {
      console.log("got in");
      let results: any = await handleProductSearch(selectedProductSearchTerm);
      if (results.length > 0) {
        setSelectedProduct(results[0]);
      }
    };
    const _selectedProduct = new URLSearchParams(location.search).get(
      "selectedProduct"
    );
    if (_selectedProduct != null) internal_autoSetProduct(_selectedProduct);
  }, []);
  const [_step, _stepSetter] = useState<number>(0);
  //#endregion

  //#region Product Search Function and State

  async function handleProductSearch(searchTerm?: string) {
    if (searchTerm === null || searchTerm === "") {
      dispatch({
        type: ActionKind.setSimilarProductSearchResult,
        payload: null,
      });
      return;
    }
    var res: any = await getRequest(
      "api/products?searchFor=" + searchTerm,
      false
    );
    let _products: Array<IProduct> = res.data.products;
    dispatch({
      type: ActionKind.setSimilarProductSearchResult,
      payload: _products,
    });
    return _products;
  }
  //#endregion

  //#region Date Helper Functions
  const addDaysToDate = (date: string, daysToAdd: number): string => {
    let currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + daysToAdd);
    return currentDate.toLocaleDateString();
  };
  const subtractDaysToDate = (date: string, daysToAdd: number): string => {
    let currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() - daysToAdd);
    return currentDate.toLocaleDateString();
  };
  //#endregion

  //#region Form Submit Input Checker
  const checkInputs = (): true | string => {
    if (
      newListing.product == undefined ||
      newListing.product == null ||
      newListing.product?.webCode == null ||
      newListing.product?.webCode == undefined
    )
      return "You must pick a product.";
    if (
      newListing.quantity != undefined &&
      isNaN(parseInt(newListing.quantity))
    )
      return "Quantity must be a whole number.";
    if (isNaN(parseFloat(newListing.cost)))
      return "Cost must be a number greater than zero";
    if (newListing.size == null || newListing.size == undefined)
      return "Size must be provided";

    if (
      newListing.datePurchased == null ||
      newListing.datePurchased == undefined
    )
      return "Date Purchased must be provided";

    return true;
  };
  async function submitHandler() {
    const postNewListing = async (newListing: any) => {
      return await postRequest("api/listings/new", newListing);
    };
    const singleListingPostHandler = async () => {
      var res: any = await postNewListing(state.newListing);
      if (res.status === 200) {
        popUpManager.setPopUp(
          <LinkPopUp
            onClose={popUpManager.removePopUp}
            link={"/listings/" + res.data.listingId}
            header="New Listing Created!"
            message={`Your listing for ${newListing.product.brand.name} ${newListing.product.name} Size ${newListing.size} is now created.`}
            buttonText={`Check out listing #${res.data.listingId}`}
          />
        );
      }
    };
    const multipleListingsPostHandler = async (
      allListings: Array<IListing>
    ) => {
      let createdListingsIds: Array<number> = [];
      let postRequestStatus = [];

      allListings.forEach(async (listing) => {
        let res: any = await postNewListing(listing);
        postRequestStatus.push(res.status);
        if (res.status === 200) createdListingsIds.push(res.data.listingId);
      });
      popUpManager.setPopUp(
        <LinkPopUp
          onClose={popUpManager.removePopUp}
          link={"/listings"}
          header="New Listings Created!"
          message={`You used a @ Size Command, as a result multiple sizes have their own listing now. Go on all listings to see them.`}
          buttonText="View All Listings"
        />
      );
    };

    if (newListing.size[0] == "@") {
      let sizeCommand = newListing.size;
      let allListings: Array<IListing> = [];
      let allSizes: Array<string> = [];
      while (1 > 0) {
        let index = sizeCommand.indexOf(" ");
        if (index == -1 || index == sizeCommand.length - 1) break;
        let lastIndex = sizeCommand.indexOf(" ", index + 1);
        if (lastIndex == -1) lastIndex = sizeCommand.length;
        allSizes.push(sizeCommand.substring(index + 1, lastIndex));
        sizeCommand = sizeCommand.substring(lastIndex);
      }
      allSizes.forEach((size) => {
        allListings.push({ ...state.newListing, size: size });
      });
      await multipleListingsPostHandler(allListings);
    } else await singleListingPostHandler();
  }
  //#endregion

  //#region Helper Functions
  const setNewListingDatePurchased = (newDate: string) => {
    dispatch({
      type: ActionKind.setNewListing,
      payload: {
        ...state.newListing,
        datePurchased: newDate,
      },
    });
  };
  const setNewListingDeadline = (newDate: string | null) => {
    dispatch({
      type: ActionKind.setNewListing,
      payload: {
        ...state.newListing,
        deadline: newDate,
      },
    });
  };

  const autoFillDetails = (listing: IListing) => {
    dispatch({
      type: ActionKind.setNewListing,
      payload: {
        ...state.newListing,
        cost: listing.cost,
        size: listing.size,
        datePurchased: listing.datePurchased,
        deadline: listing.deadline,
      },
    });
  };
  //#endregion

  //#region Tabs OnLeave and OnActive functions
  const handleTab2OnActive = async () => {
    if (
      newListing.product != undefined &&
      newListing.product != null &&
      newListing.product.webCode != null &&
      newListing.product.webCode != undefined &&
      (state.similarListingsSearchResult == undefined ||
        state.similarListingsSearchResult[0].product?.webCode !=
          newListing.product?.webCode)
    ) {
      let res: any | Array<IListing> = await getRequest("api/listings");
      let productListings = res.data.listings.filter((x: IListing) => {
        if (
          x.product.webCode == state.newListing.product.webCode &&
          Math.floor(
            (new Date().getTime() - new Date(x.datePurchased).getTime()) /
              (1000 * 60 * 60 * 24)
          ) < 25
        )
          return true;
        return false;
      });
      productListings.sort((a: IListing, b: IListing) => {
        if (new Date(a.datePurchased) > new Date(b.datePurchased)) return -1;
        else return 1;
      });
      if (productListings.length == 0) {
        dispatch({
          type: ActionKind.setSimilarListingsSearchResult,
          payload: null,
        });
        return;
      }
      productListings = productListings.slice(0, 4);
      dispatch({
        type: ActionKind.setSimilarListingsSearchResult,
        payload: productListings,
      });
    }
  };
  //#endregion
  return (
    <>
      <div className="px-64 pt-20 font-text">
        <TabPageWithHeadline selectedTab={_step} containerWrapperClasses="">
          <Tab key={0} label="1: Product" wrapperClasses="pt-1">
            {newListing.product == null ||
            newListing.product?.webCode == null ||
            newListing.product?.webCode === "" ? (
              <div className="grid grid-cols-2 grid-rows-2 gap-4">
                <div className="w-full h-full md:w-2/3 px-3 mb-6">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    LookUp a product
                  </label>
                  <input
                    autoFocus
                    className="appearance-none block w-full bg-white-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none"
                    type="text"
                    placeholder="SKU or Name or WebCode"
                    onChange={(ev) => {
                      ev.persist();
                      handleProductSearch(ev.target.value);
                    }}
                  />
                  <label className="text-lg block text-center mt-3 mb-3 text-yellow-400 font-semibold">
                    Or
                  </label>
                  <div className="">
                    <a
                      href={`/products/new?returnResult=true&returnUrl=${encodeURIComponent(
                        "/listings/new?selectedProduct="
                      )}`}
                      className="block bg-blue-300 rounded shadow-xs pt-3 pb-3 text-center uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    >
                      Add A New Product
                    </a>
                  </div>
                </div>
                <div className="row-span-2">
                  {state.similarProductSearchResult != null && (
                    <div className="rounded border">
                      {state.similarProductSearchResult.length == 0 ? (
                        <p className="bg-yellow-100 px-3 pt-3 pb-3 text-yellow-700 subtext-font">
                          Such Empty :( No product found
                          <span className="text-font text-black block">
                            You must pick a product to be able to add a new
                            listing. Search for a product or add a new one.
                          </span>
                        </p>
                      ) : (
                        state.similarProductSearchResult.map(
                          (product: IProduct, i: number) => (
                            <div
                              onClick={() => {
                                setSelectedProduct(product);
                                _stepSetter(1);
                              }}
                              className={
                                "px-2 pt-2 pb-2 flex flex-row gap-3 cursor-pointer hover:shadow-2xl " +
                                (state.similarProductSearchResult != null &&
                                  state.similarProductSearchResult.length - 1 !=
                                    i &&
                                  "border-b")
                              }
                            >
                              {product.image != null && (
                                <img
                                  className="object-contain w-16"
                                  src={product.image}
                                />
                              )}
                              <div className="flex flex-col space-y-1">
                                <span>
                                  {product.name}{" "}
                                  <small className="ml-1 text-gray-300">
                                    Web Code: {product.webCode}
                                  </small>{" "}
                                </span>
                                <small className="text-gray-500">
                                  {product.sku}
                                </small>
                              </div>
                            </div>
                          )
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="px-4 pt-4">
                <div className="flex flex-row gap-3">
                  {newListing.product.image != null && (
                    <img
                      className="w-64 object-contain"
                      src={newListing.product.image}
                    />
                  )}
                  <span className="text-lg text-gray-600 subtext-font">
                    {newListing.product?.name}
                    <a
                      className="ml-2 mr-1 text-blue-400"
                      href={"/products/" + newListing.product.webCode}
                    >
                      <i className="fas fa-share-square"></i>
                    </a>{" "}
                    <small> {newListing.product?.sku}</small>
                    <span className="block text-xs text-gray-400">
                      {newListing.product?.color}
                    </span>
                  </span>
                  <div className="inline-block ml-auto">
                    <button
                      onClick={() => {
                        dispatch({
                          type: ActionKind.setProductOfNewListing,
                          payload: {} as IProduct,
                        });
                        dispatch({
                          type: ActionKind.setSimilarProductSearchResult,
                          payload: [],
                        });
                        history.push(location.pathname);
                        _stepSetter(0);
                      }}
                      className=" w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Pick A New Product
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Tab>

          <Tab
            label="2: Details"
            onActive={handleTab2OnActive}
            key={1}
            wrapperClasses="flex flex-row gap-4"
          >
            <>
              <div
                id="DetailsOfTheListingContainer"
                className="flex flex-col w-1/2"
              >
                <div className="flex gap-2 flex-row justify-between">
                  <div className="inline-block w-auto">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Size
                    </label>
                    <input
                      autoFocus
                      value={newListing.size ?? ""}
                      onChange={(ev) => {
                        ev.persist();
                        dispatch({
                          type: ActionKind.setNewListing,
                          payload: {
                            ...state.newListing,
                            size: ev.target.value,
                          },
                        });
                      }}
                      className="appearance-none block w-full bg-white-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none"
                      type="text"
                      placeholder="Size"
                    />
                  </div>
                  <div className="inline-block w-auto">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Cost
                    </label>
                    <div className="flex flex-row gap-2">
                      <input
                        value={newListing.cost ?? ""}
                        onChange={(ev) => {
                          ev.persist();
                          dispatch({
                            type: ActionKind.setNewListing,
                            payload: {
                              ...state.newListing,
                              cost: ev.target.value,
                            },
                          });
                        }}
                        className="appearance-none block w-full bg-white-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none"
                        type="text"
                        placeholder="Cost $"
                      />
                    </div>
                  </div>
                  <div className="inline-block w-auto">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Quantity
                    </label>
                    <input
                      value={newListing.quantity ?? ""}
                      onChange={(ev) => {
                        ev.persist();
                        dispatch({
                          type: ActionKind.setNewListing,
                          payload: {
                            ...state.newListing,
                            quantity: ev.target.value,
                          },
                        });
                      }}
                      className="appearance-none block w-full bg-white-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none"
                      type="text"
                      placeholder="X"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="mt-3 block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Notes
                  </label>
                  <textarea
                    onChange={(ev) => {
                      ev.persist();
                      dispatch({
                        type: ActionKind.setNewListing,
                        payload: {
                          ...state.newListing,
                          notes: ev.target.value,
                        },
                      });
                    }}
                    className="appearance-none block w-full bg-white-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none"
                    placeholder=""
                    rows={5}
                  >
                    {newListing.notes ?? ""}
                  </textarea>
                  <div className="flex justify-end pt-3">
                    {checkInputs() === true && (
                      <button
                        onClick={submitHandler}
                        className=" w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Quick Submit
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div id="DetailsHelperContainer">
                <div className="ml-24 mt-4">
                  {state.similarListingsSearchResult != null && (
                    <div className="flex flex-col space-y-2 px-3 pt-2 pb-2">
                      <label className=" block tracking-wide text-gray-400 text-xs font-bold mb-1">
                        Quick Add
                      </label>
                      {state.similarListingsSearchResult.map((x) => (
                        <div
                          className="border rounded text-xs text-gray-700 px-2 pt-1 pb-1 flex flex-row gap-3 cursor-pointer"
                          onClick={() => autoFillDetails(x)}
                        >
                          <span
                            onClick={(ev) => {
                              ev.stopPropagation();
                              history.push(`/listings/${x.listingId}`);
                            }}
                            className="text-pink-500 border-r pr-1"
                          >
                            {x.listingId}
                          </span>
                          <span className="text-gray-600">SZ {x.size}</span>
                          <span>Purchased {x.datePurchased}</span>
                          <span className="text-green-600">${x.cost}</span>
                          {x.status == "SOLD" && (
                            <span className="text-red-500 uppercase font-bold">
                              S
                            </span>
                          )}
                          {(x.status == "Returned" ||
                            x.status == "Return Pending") && (
                            <span className="text-yellow-500 uppercase font-bold">
                              R
                            </span>
                          )}
                          {x.status == "CANCELED" && (
                            <span className="bg-red-700 px-1 text-white rounded uppercase font-bold">
                              C
                            </span>
                          )}
                        </div>
                      ))}
                      <div className="text-xs px-3">
                        <LineAlert
                          color="blue"
                          message="Quick Add copies the following: cost,size,deadline,Date Purchased."
                        />
                      </div>
                    </div>
                  )}
                  <div className="text-xs px-9">
                    <LineAlert
                      color="gray"
                      message="COMMAND: Size Command @ lets you add multiple sizes."
                    />
                  </div>
                </div>
              </div>
            </>
          </Tab>

          <Tab label="3: Dates" key={2}>
            <>
              <div className="flex flex-row gap-6">
                <div
                  className="mt-3 border pt-4 pb-4 px-3 rounded"
                  key="dateTabContainer"
                >
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Date Purchased
                  </label>
                  <DatePicker
                    selectedDate={newListing.datePurchased}
                    onChange={(newVal: string) => {
                      setNewListingDatePurchased(newVal);
                    }}
                  />

                  <div className="flex flex-row justify-center">
                    <button
                      onClick={() => {
                        let newDate = addDaysToDate(
                          newListing.datePurchased,
                          60
                        );
                        setNewListingDatePurchased(newDate);
                      }}
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-2 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-1 sm:w-auto sm:text-sm"
                    >
                      Add 60 days
                    </button>
                    <button
                      onClick={() => {
                        let newDate = addDaysToDate(
                          newListing.datePurchased,
                          40
                        );
                        setNewListingDatePurchased(newDate);
                      }}
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-2 py-2 bg-pink-500 text-base font-medium text-white hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-1 sm:w-auto sm:text-sm"
                    >
                      Add 40 days
                    </button>
                    <button
                      onClick={() => {
                        let newDate = addDaysToDate(
                          newListing.datePurchased,
                          5
                        );
                        setNewListingDatePurchased(newDate);
                      }}
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-2 py-2 bg-pink-400 text-base font-medium text-white hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-1 sm:w-auto sm:text-sm"
                    >
                      Add 5 days
                    </button>
                  </div>

                  <div className="flex flex-row justify-center">
                    <button
                      onClick={() => {
                        let newDate = subtractDaysToDate(
                          newListing.datePurchased,
                          60
                        );
                        setNewListingDatePurchased(newDate);
                      }}
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-2 py-2 bg-gray-400 text-base font-medium text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-1 sm:w-auto sm:text-sm"
                    >
                      Back 60 days
                    </button>
                    <button
                      onClick={() => {
                        let newDate = subtractDaysToDate(
                          newListing.datePurchased,
                          15
                        );
                        setNewListingDatePurchased(newDate);
                      }}
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-2 py-2 bg-gray-500 text-base font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-1 sm:w-auto sm:text-sm"
                    >
                      Back 15 days
                    </button>
                    <button
                      onClick={() => {
                        let newDate = subtractDaysToDate(
                          newListing.datePurchased,
                          10
                        );
                        setNewListingDatePurchased(newDate);
                      }}
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-2 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-1 sm:w-auto sm:text-sm"
                    >
                      Back 10 days
                    </button>
                  </div>
                </div>

                <div className="mt-3 border pt-4 pb-4 px-3 rounded">
                  <div className="flex justify-between">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      DEADLINE
                    </label>
                    <label
                      className="block border px-1 tracking-wide text-gray-700 text-xs mb-2 cursor-pointer"
                      onClick={() => setNewListingDeadline(null)}
                    >
                      Click To Set TBD
                    </label>
                  </div>

                  <DatePicker
                    selectedDate={newListing.deadline}
                    onChange={(newVal: string) => {
                      setNewListingDeadline(newVal);
                    }}
                  />
                  {newListing.deadline == null ? (
                    <div className="bg-yellow-100 mt-2 border border-black flex justify-center pb-2 pt-2 px-2">
                      <p>No Deadline Selected</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-row justify-center">
                        <button
                          onClick={() => {
                            let newDate = addDaysToDate(
                              newListing.deadline ??
                                new Date().toLocaleDateString(),
                              60
                            );
                            setNewListingDeadline(newDate);
                          }}
                          type="button"
                          className="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-2 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-1 sm:w-auto sm:text-sm"
                        >
                          Add 60 days
                        </button>
                        <button
                          onClick={() => {
                            let newDate = addDaysToDate(
                              newListing.deadline ??
                                new Date().toLocaleDateString(),
                              40
                            );
                            setNewListingDeadline(newDate);
                          }}
                          type="button"
                          className="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-2 py-2 bg-pink-500 text-base font-medium text-white hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-1 sm:w-auto sm:text-sm"
                        >
                          Add 40 days
                        </button>
                        <button
                          onClick={() => {
                            let newDate = addDaysToDate(
                              newListing.deadline ??
                                new Date().toLocaleDateString(),
                              5
                            );
                            setNewListingDeadline(newDate);
                          }}
                          type="button"
                          className="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-2 py-2 bg-pink-400 text-base font-medium text-white hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-1 sm:w-auto sm:text-sm"
                        >
                          Add 5 days
                        </button>
                      </div>
                      <div className="flex flex-row justify-center">
                        <button
                          onClick={() => {
                            let newDate = subtractDaysToDate(
                              newListing.deadline ??
                                new Date().toLocaleDateString(),
                              60
                            );
                            setNewListingDeadline(newDate);
                          }}
                          type="button"
                          className="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-2 py-2 bg-gray-400 text-base font-medium text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-1 sm:w-auto sm:text-sm"
                        >
                          Back 60 days
                        </button>
                        <button
                          onClick={() => {
                            let newDate = subtractDaysToDate(
                              newListing.deadline ??
                                new Date().toLocaleDateString(),
                              15
                            );
                            setNewListingDeadline(newDate);
                          }}
                          type="button"
                          className="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-2 py-2 bg-gray-500 text-base font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-1 sm:w-auto sm:text-sm"
                        >
                          Back 15 days
                        </button>
                        <button
                          onClick={() => {
                            let newDate = subtractDaysToDate(
                              newListing.deadline ??
                                new Date().toLocaleDateString(),
                              10
                            );
                            setNewListingDeadline(newDate);
                          }}
                          type="button"
                          className="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-2 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-1 sm:w-auto sm:text-sm"
                        >
                          Back 10 days
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          </Tab>

          <Tab label="4: Submit" key={3}>
            <div className="pt-4">
              {checkInputs() === true ? (
                <>
                  <p className="subtext-font capitalize px-2 rounded text-gray-700 font-semibold inline-block">
                    You are creating a new listing with{"  "}
                    <span className="text-red-500">
                      {newListing.quantity ?? 1}
                    </span>
                    {"  "}
                    sublisting(s) automatically added
                  </p>
                  <div className="flex flex-row">
                    <div className="flex flex-col px-4 pt-3">
                      <a href={"/products/" + newListing.product?.webCode}>
                        <img
                          className="w-32 object-contain"
                          src={newListing.product?.image}
                        />
                      </a>
                      <label className="block text-gray-400 text-font text-center">
                        {newListing.product?.sku ?? newListing.product?.color}
                      </label>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <p className="pt-2 text-blue-800 font-semibold">
                        {newListing.product?.brand?.name}{" "}
                        {newListing.product?.name} <br />
                      </p>
                      <span className="mt-1 text-gray-700 border px-2 pt-1 pb-1 rounded inline-block">
                        Size {newListing.size}
                      </span>
                      <span className="mt-1 text-gray-700 border-green-400 border px-2 pb-1 pt-1 rounded inline-block">
                        Cost{" "}
                        <span className="text-green-700">
                          ${newListing.cost}
                        </span>
                      </span>
                      <span className="mt-1 border px-2 pt-1 pb-1 rounded text-gray-700 inline-block">
                        Deadline: {newListing.deadline ?? "TBD"}
                      </span>
                      <span className="text-gray-700 mt-1 border px-2 pt-1 pb-1 rounded inline-block">
                        Purchased: {newListing.datePurchased}
                      </span>
                      <button
                        className="block ml-auto mt-3 w-full inline-flex justify-center rounded-md border border-red-300 shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={submitHandler}
                        autoFocus
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <p className="subtext-font capitalize px-2 rounded text-gray-700 font-semibold inline-block">
                    Your listing cant be submitted. Read below.
                  </p>
                  <div className="px-28 pt-3">
                    <LineAlert color="red" message={checkInputs().toString()} />
                  </div>
                </div>
              )}
            </div>
          </Tab>
          <Tab
            key={4}
            onHeaderClick={() => {
              history.push("/listings");
            }}
            isButton={true}
            rightSide={true}
            label="View Listings"
            className="w-full inline-flex justify-center rounded-md border px-4 py-2 bg-grey-50 text-base font-medium text-gray-500 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            <></>
          </Tab>
          <Tab
            key={5}
            onHeaderClick={() => {
              dispatch({
                type: ActionKind.resetNewListingRelatedStates,
              });
            }}
            isButton={true}
            rightSide={true}
            label="Clear"
            className="w-full inline-flex justify-center rounded-md border px-4 py-2 bg-red-400 text-base font-medium text-gray-50 hover:bg-red-500 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            <></>
          </Tab>
        </TabPageWithHeadline>
      </div>
      <PopUpTrigger manager={popUpManager} />
    </>
  );
}
