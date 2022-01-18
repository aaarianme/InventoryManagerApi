import React, { useState, useEffect } from "react";
import usePopUpManager from "../Hooks/usePopUpManager";
import Tab from "../components/Tabs/Tab";
import { FlowTabPage, TabPageWithHeadline } from "../components/Tabs/TabPages";
import DropDownMenu from "../components/DropDownMenu";
import {
  PopUpTrigger,
  LoadingPopUp,
  LinkPopUp,
  MessagePopup,
  ErrorPopUp,
} from "../components/Alerts/PopUps";
import { LineAlert } from "../components/Alerts/Alerts";
import { useFetch, useGetRequest, usePost } from "../Hooks/RequestHooks";
import { useHistory, useLocation } from "react-router";

interface IBrand {
  id: string;
  name: string;
}

interface IProduct {
  name: string;
  sku: string;
  dateAdded: string;
  retailPrice: number;
  color: string;
  webCode: string;
  brand: IBrand;
  inStock: string;
  sold: string;
  notes: string;
  image: string;
}

export default function NewProductPage() {
  const popUpmanager = usePopUpManager();
  const getRequest = useGetRequest();
  const postRequest = usePost();
  const location = useLocation();
  const histoy = useHistory();

  const [newProductState, setNewProductState] = useState<IProduct>(
    {} as IProduct
  );

  //#region Get all available brands and manage the states
  const [loaded, brandFetchResult, getRes] = useFetch({ data: {} });
  const getAllBrands = async () => {
    await getRes("api/products/fetch/allBrands");
  };
  useEffect(() => {
    getAllBrands();
  }, []);
  const handleBrandMatching = (brandName?: string) => {
    setNewProductState((preval) => ({
      ...preval,
      brand: { ...preval.brand, name: brandName ?? "" },
    }));

    for (const brand of brandFetchResult.data.items) {
      if (brand.displayName.toLowerCase() === brandName?.toLowerCase()) {
        setNewProductState((preval) => ({
          ...preval,
          brand: { ...preval.brand, name: brand.displayName },
        }));
        return true;
      }
    }
    return false;
  };
  //#endregion

  //#region submit the form functions and checkers
  /**
   *
   * @returns Determines if the form can be submited based on issing info/ bad info
   */
  function validateInputs() {
    if (newProductState === undefined) return false;
    if (
      newProductState?.name === undefined ||
      newProductState?.name === null ||
      newProductState?.name === "" ||
      newProductState?.brand?.name === undefined ||
      newProductState?.brand?.name === null ||
      newProductState?.brand?.name === ""
    )
      return false;
    return true;
  }
  /**
   *
   * @returns Checks For duplicates of the same product
   */
  const checkForDuplicates = async () => {
    if (newProductState.sku === null || newProductState.sku === "") return;
    var res = await getRequest("api/products?searchFor=" + newProductState.sku);
    if (res.data.products.length > 0)
      popUpmanager.setPopUp(
        <LinkPopUp
          onClose={popUpmanager.removePopUp}
          header="Something you should know"
          message={`'${
            res.data.products[0].brand.name + " " + res.data.products[0].name
          }' with similar data was found. If this is the same product, click on the link below to go to its page. This item with its current info will still be accepted by the server, however make sure you dont have duplicates.`}
          link={`/products/${res.data.products[0].webCode}`}
          buttonText={`Check out ${
            res.data.products[0].brand.name + " " + res.data.products[0].name
          }`}
        ></LinkPopUp>
      );
  };

  /**
   *
   * @returns Handles submiting form and showing the proper message/ doing the proper action
   */
  const submitHandler = async () => {
    popUpmanager.setPopUp(<LoadingPopUp isVisible={true}></LoadingPopUp>);
    var res: any = await postRequest("api/products/new", newProductState);

    if (res.status === 200) {
      const _returnResult = new URLSearchParams(location.search).get(
        "returnResult"
      );
      const _returnUrl = new URLSearchParams(location.search).get("returnUrl");
      if (_returnResult?.toLowerCase() == "true") {
        histoy.push(_returnUrl + res.data.webCode);
        return;
      }
      if (_returnUrl !== null) {
        histoy.push(_returnUrl);
        return;
      }

      popUpmanager.setPopUp(
        <LinkPopUp
          header="New Product Added!"
          buttonText="Let's see"
          link={`/products/${res.data.webCode}`}
          message={
            "A new product was added to the database, for your reference, the WebCode to this new product is " +
            res.data.webCode
          }
        ></LinkPopUp>
      );
    } else {
      popUpmanager.setPopUp(
        <ErrorPopUp
          canRetry={true}
          retryFunction={submitHandler}
          retryButtonText="Re-submit"
          message={(res.status ?? "") + ": " + res.data.message}
          header="Error"
        ></ErrorPopUp>
      );
    }
  };
  //#endregion

  return (
    <>
      {loaded && (
        //#region  Page Body
        <>
          <div className="flex justify-center pt-64">
            <FlowTabPage wrapperClasses="border rounded pt-3 pb-3 px-3">
              <Tab id="Name And Sku" OnLeave={() => checkForDuplicates()}>
                <div className="flex-col space-y-3">
                  <div>
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Enter a Name without Brand names
                    </label>
                    <input
                      className="appearance-none block w-full bg-white-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none"
                      type="text"
                      placeholder="Name"
                      onChange={(ev) => {
                        ev.persist();
                        setNewProductState((preval) => ({
                          ...preval,
                          name: ev.target.value,
                        }));
                      }}
                      value={newProductState?.name ?? ""}
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Enter a SKU number, if available.
                    </label>
                    <input
                      className="appearance-none block w-full bg-white-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none"
                      type="text"
                      placeholder="SKU"
                      onChange={(ev) => {
                        ev.persist();
                        setNewProductState((preval) => ({
                          ...preval,
                          sku: ev.target.value,
                        }));
                      }}
                      value={newProductState?.sku ?? ""}
                    />
                    <label className="text-lg block text-center mt-3 mb-3 text-yellow-400 font-semibold"></label>
                  </div>
                </div>
              </Tab>
              <Tab id="Price and Color">
                <div className="flex-col space-y-3">
                  <div>
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Enter Retail Price, without taxes.
                    </label>
                    <input
                      className="appearance-none block w-full bg-white-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none"
                      type="text"
                      placeholder="Price"
                      onChange={(ev) => {
                        ev.persist();
                        setNewProductState((preval) => ({
                          ...preval,
                          retailPrice: parseInt(ev.target.value),
                        }));
                      }}
                      value={newProductState.retailPrice ?? ""}
                    />
                  </div>
                  <div>
                    <label className="break-words max-w-xs uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Colors: Could be a colorway name. For individual colors,
                      use double space to have a slash inserted automatically.
                    </label>
                    <input
                      className="appearance-none block w-full bg-white-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none"
                      type="text"
                      placeholder="Color"
                      onChange={(ev) => {
                        ev.persist();
                        setNewProductState((preval) => ({
                          ...preval,
                          color: ev.target.value,
                        }));
                      }}
                      value={newProductState.color ?? ""}
                    />
                    <label className="text-lg block text-center mt-3 mb-3 text-yellow-400 font-semibold"></label>
                  </div>
                </div>
              </Tab>
              <Tab id="Picture">
                <div className="flex flex-col space-y-2">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Image Url
                  </label>
                  <input
                    className="appearance-none block w-full bg-white-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none"
                    type="text"
                    placeholder="Image Url"
                    onChange={(ev) => {
                      ev.persist();
                      setNewProductState((preval) => ({
                        ...preval,
                        image: ev.target.value,
                      }));
                    }}
                    value={newProductState.image ?? ""}
                  />
                  <div className="border pt-2 pb-2 rounded flex justify-center">
                    {newProductState.image != null ? (
                      <img
                        className="object-contain border-0 w-32 h-32"
                        src={newProductState.image}
                      />
                    ) : (
                      <LineAlert message="No picture selected" color="red" />
                    )}
                  </div>
                </div>
              </Tab>
              <Tab id="brand">
                <div className="flex-col space-y-3">
                  <div>
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Select a brand
                    </label>
                    <DropDownMenu
                      clickHandler={(selectedBrand: string) => {
                        setNewProductState((preval) => ({
                          ...preval,
                          brand: { ...preval.brand, name: selectedBrand },
                        }));
                      }}
                      defaultDisplay="Brands"
                      defaultValue={newProductState.brand?.name}
                      defaultItems={brandFetchResult.data.items}
                    ></DropDownMenu>
                    <input
                      className="appearance-none mt-2 block w-full text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none"
                      type="text"
                      placeholder="start typing brand name"
                      onChange={(ev) => {
                        ev.persist();
                        let res = handleBrandMatching(ev.target.value);
                        if (!res) ev.target.classList.add("bg-red-100");
                        else ev.target.classList.remove("bg-red-100");
                      }}
                      value={newProductState.brand?.name ?? ""}
                    />
                  </div>
                </div>
              </Tab>
              <Tab id="notes">
                <div className="flex-col space-y-3">
                  <div className="">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Notes
                    </label>
                    <textarea
                      className="appearance-none block w-full bg-white-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none"
                      placeholder=""
                      rows={5}
                      onChange={(ev) => {
                        ev.persist();
                        setNewProductState((preval) => ({
                          ...preval,
                          notes: ev.target.value,
                        }));
                      }}
                    ></textarea>
                  </div>
                </div>
              </Tab>
              <Tab id="submit">
                <div className="flex-col space-y-3">
                  <div className="">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Submit
                    </label>
                    {validateInputs() === true ? (
                      <>
                        <p>You are about to add the following product:</p>
                        <div className="flex flex-col">
                          <img
                            className="object-contain border-0 w-32 h-32"
                            src={newProductState.image}
                          />
                          <div className="">
                            <p className="subtext-font">
                              {newProductState?.brand?.name}{" "}
                              {newProductState?.name}
                              {" - "}
                              <span className="text-gray-500 text-xs">
                                {newProductState.sku ?? "No SKU Provided!"}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => submitHandler()}
                            className="mt-3 ml-auto w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                          >
                            Submit
                          </button>
                        </div>
                      </>
                    ) : (
                      <div>
                        <LineAlert
                          color="red"
                          message="Can not submit your inputs yet. Brand, Name and Price must be provided"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Tab>
            </FlowTabPage>
          </div>
          <PopUpTrigger manager={popUpmanager}></PopUpTrigger>
        </>
        //#endregion
      )}
      {
        //#region Loading Animation
        popUpmanager.returnPopUp(
          <LoadingPopUp isVisible={!loaded}></LoadingPopUp>
        )
        //#endregion
      }
    </>
  );
}
