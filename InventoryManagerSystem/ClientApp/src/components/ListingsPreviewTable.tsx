import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { usePost } from "../Hooks/RequestHooks";
import { PopUpTrigger, ErrorPopUp } from "./Alerts/PopUps";
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
  quantity: number;
  status: string;
  size: string;
  notes: string;
  datePurchased: string;
  dateAdded: string;
  deadline: string;
  product: IProduct;
  daysLeftToDeadline: number;
}
interface IProps {
  listings: IListing[];
  onStatusChange?: Function;
  insertStatusFunc?: Function;
  showActions?: boolean;
}

/**
 *
 * @param props Provide listings, an array that will be broken down and displayed. autoHandleStatusChange defualts to true, if false, provide onStatusChange function. autoHandleStatusChange takes care of api requests and changing the components content accordingly, if onStatusChange is provided, you must do everything yourself
 * @returns
 */
export default function ListingsPreviewTable(props: IProps) {
  const listings: Array<IListing> = props.listings;

  const history = useHistory();

  //#region Stylying Functions
  function getStatusStyles(status: string) {
    switch (status) {
      case "Not In Stock":
        return "bg-gray-300";
      case "Finished":
        return "text-black";
      case "In Stock":
        return "bg-green-200 text-black";
      case "Partially In Stock":
        return "bg-green-100";
      case "Returned":
        return "bg-yellow-100";

      case "Sold":
        return "text-blue-700 font-semibold bg-blue-100";
      case "Canceled":
        return "bg-red-400 text-white font-semibold";
    }
  }
  //#endregion

  //#region Handle Status Change when user clicks on them
  async function setStatusDispatcher(newStatus: string, forListingId: number) {
    if (props.onStatusChange instanceof Function) {
      props.onStatusChange(newStatus, forListingId);
    }
  }

  //#endregion

  return (
    <>
      <table className="min-w-max w-full table-auto">
        <thead>
          <tr className=" text-gray-50 uppercase text-sm leading-normal header-font bg-midnightblack">
            <th className="py-3 px-3 text-center text-white">ID</th>
            <th className="py-3 pl-2 text-left">Item</th>
            <th className="py-3 px-2 text-center">Cost</th>
            <th className="py-3 px-2 text-center">Size</th>
            <th className="py-3 text-center">Quantity</th>
            <th className="py-3 px-2 text-center">Deadline</th>
            <th className="py-3 px-2 text-center">Status</th>
            <th className="py-3 px-3 text-center">Purchased</th>
            {props.showActions !== false && (
              <th className="max-w-xs	 text-center">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light ">
          {listings.map((listing: IListing) => (
            <tr
              className="border-b cursor-pointer border-gray-200 hover:bg-white text-font"
              onClick={() =>
                history.push(
                  "/listings/" +
                    listing.listingId +
                    "/" +
                    listing.product.name.replace(/ /g, "-")
                )
              }
            >
              <td className="py-3 whitespace-nowrap text-red-600">
                <div className="flex flex-col space-y-1">
                  <a className="font-medium block text-lg text-center">
                    {listing.listingId}
                  </a>
                </div>
              </td>
              <td className="py-3 pl-2 text-left whitespace-nowrap">
                <div className="flex flex-row gap-5">
                  {listing.product.image != null && (
                    <div className="flex flex-col justify-center">
                      <img
                        className="object-contain w-12 h-12"
                        src={listing.product.image}
                      />
                    </div>
                  )}

                  <div className="flex flex-col space-y-1">
                    <span className="font-medium text-lg">
                      {listing.product.brand.name} {listing.product.name}
                    </span>
                    <span className="block text-md">
                      {listing.product.color} {listing.product.sku}{" "}
                    </span>
                  </div>
                </div>
              </td>
              <td className="py-3 px-2 text-left bg-pink-100">
                <div className="flex justify-center">
                  <span className="bg-pink-600 font-semibold text-md text-white rounded px-1 ">
                    ${listing.cost}
                  </span>
                </div>
              </td>
              <td className="py-3 px-2 text-center">
                <span className="font-semibold">{listing.size}</span>
              </td>
              <td className="py-3 px-6 text-center">
                <a className="font-semibold">X {listing.quantity}</a>
              </td>
              <td className="py-3 text-center">
                <div className="flex flex-col space-y-1">
                  {(listing.status != null && listing.status == "Sold") ||
                  (props.insertStatusFunc instanceof Function &&
                    props.insertStatusFunc(listing) == "Sold") ? (
                    "--"
                  ) : listing.deadline !== "" && listing.deadline !== null ? (
                    <>
                      <small className="block text-lg">
                        {listing.deadline}
                      </small>

                      {listing.daysLeftToDeadline !== undefined &&
                      listing.daysLeftToDeadline !== null &&
                      listing.daysLeftToDeadline > 7 &&
                      listing.daysLeftToDeadline < 1 ? (
                        <small className="block text-md ">
                          {listing.daysLeftToDeadline} days left
                        </small>
                      ) : listing.daysLeftToDeadline > 1 ? (
                        <small className="block text-yellow-500 font-semibold mx-4 border rounded">
                          {listing.daysLeftToDeadline} days left{" "}
                        </small>
                      ) : listing.daysLeftToDeadline === 0 ? (
                        <small className="block text-lg text-red-500 font-semibold">
                          Today!
                        </small>
                      ) : listing.daysLeftToDeadline === 1 ? (
                        <small className="block text-md text-red-500 font-semibold">
                          Tommorow
                        </small>
                      ) : (
                        <small className="block text-md text-red-400 mx-4 py-1 pb-1 border rounded border-red-700">
                          {Math.abs(listing.daysLeftToDeadline)} day(s) ago
                        </small>
                      )}
                    </>
                  ) : (
                    <label>TBD</label>
                  )}
                </div>
              </td>
              <td
                className={
                  "py-3 text-center " +
                  getStatusStyles(
                    listing.status == null
                      ? props.insertStatusFunc instanceof Function
                        ? props.insertStatusFunc(listing)
                        : "Not Provided"
                      : listing.status
                  )
                }
              >
                {listing.status == null
                  ? props.insertStatusFunc instanceof Function
                    ? props.insertStatusFunc(listing)
                    : "Not Provided"
                  : listing.status}
              </td>
              <td className="py-3 text-center">{listing.datePurchased}</td>
              {props.showActions !== false && (
                <td className="text-center">
                  {listing.status === "Ordered" && (
                    <>
                      <small
                        onClick={(ev) => {
                          ev.stopPropagation();
                          setStatusDispatcher("Sent Out", listing.listingId);
                        }}
                        className="px-1 subtext-font text-black rounded pt-1 pb-1 border cursor-pointer ml-1"
                      >
                        Sent Out?
                      </small>
                      <small
                        onClick={(ev) => {
                          ev.stopPropagation();
                          setStatusDispatcher("In Stock", listing.listingId);
                        }}
                        className="px-1 subtext-font text-green-500 rounded pt-1 pb-1 border cursor-pointer ml-1"
                      >
                        In Stock?
                      </small>
                    </>
                  )}

                  {listing.status === "In Stock" && (
                    <>
                      <small
                        onClick={(ev) => {
                          ev.stopPropagation();
                          setStatusDispatcher(
                            "To be Returned",
                            listing.listingId
                          );
                        }}
                        className="px-1 subtext-font text-yellow-500 rounded pt-1 pb-1 border cursor-pointer ml-1"
                      >
                        To be Returned?
                      </small>
                      <small
                        onClick={(ev) => {
                          ev.stopPropagation();
                          setStatusDispatcher("Canceled", listing.listingId);
                        }}
                        className="px-1 subtext-font bg-red-600 rounded pt-1 pb-1 text-white cursor-pointer ml-1"
                      >
                        Cancel
                      </small>
                    </>
                  )}

                  {listing.status === "To be Returned" && (
                    <>
                      <small
                        onClick={(ev) => {
                          ev.stopPropagation();
                          setStatusDispatcher(
                            "Return Pending",
                            listing.listingId
                          );
                        }}
                        className="px-1 subtext-font text-yellow-700 rounded pt-1 pb-1 border cursor-pointer ml-1"
                      >
                        Return Pending?
                      </small>
                      <small
                        onClick={(ev) => {
                          ev.stopPropagation();
                          setStatusDispatcher("Returned", listing.listingId);
                        }}
                        className="px-1 subtext-font bg-yellow-500 rounded pt-1 pb-1 text-white cursor-pointer ml-1"
                      >
                        Returned
                      </small>
                    </>
                  )}
                  {listing.status === "Return Pending" && (
                    <small
                      onClick={(ev) => {
                        ev.stopPropagation();
                        setStatusDispatcher("Returned", listing.listingId);
                      }}
                      className="px-1 subtext-font bg-yellow-500 rounded pt-1 pb-1 text-white cursor-pointer ml-1"
                    >
                      Returned
                    </small>
                  )}
                  {listing.status === "Sent Out" && (
                    <small
                      onClick={(ev) => {
                        ev.stopPropagation();
                        setStatusDispatcher("In Stock", listing.listingId);
                      }}
                      className="px-1 subtext-font text-green-500 rounded pt-1 pb-1 border cursor-pointer ml-1"
                    >
                      In Stock?
                    </small>
                  )}

                  {listing.status !== "Ordered" &&
                    listing.status !== "In Stock" &&
                    listing.status !== "Sent Out" &&
                    listing.status !== "To be Returned" &&
                    listing.status !== "Return Pending" && (
                      <label
                        className="subtext-font text-xs border-b cursor-pointer"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          history.push("/listings/" + listing.listingId);
                        }}
                      >
                        View Details
                      </label>
                    )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
