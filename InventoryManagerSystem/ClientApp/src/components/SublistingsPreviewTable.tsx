import { setUncaughtExceptionCaptureCallback } from "process";
import React from "react";
interface ISublisting {
  sublistingId: number;
  sublistingRef: string;
  salesRecord?: number | null;
  status: string;
}
interface IProps {
  sublistings: ISublisting[];
  wrapperClasses?: string | "";
  onSaleSubmit: Function;
  onStatusChangeSubmit: Function;
}
export default function SublistingsPreviewTable(props: IProps) {
  function submitSaleHandler(ref: string, id: number) {
    props.onSaleSubmit(ref, id);
  }
  function onStatusChange(newStatus: string, sublistingId: number) {
    props.onStatusChangeSubmit(newStatus, sublistingId);
  }
  return (
    <>
      {props.sublistings !== null &&
        props.sublistings !== undefined &&
        props.sublistings.length! > 0 && (
          <div className={props.wrapperClasses ?? ""}>
            <div className="overflow-hidden rounded border-gray-200">
              <table className="table-auto bg-white border">
                <thead className="text-black border-b">
                  <tr>
                    <th className="text-center py-3 px-4 text-sm">
                      Sublisting
                    </th>
                    <th className="text-center py-3 px-4 text-sm">Status</th>
                    <th className="text-center py-3 px-4 text-sm">Action</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-font">
                  {props.sublistings.map((sublisting) => (
                    <tr>
                      <td className="text-center py-3 px-4">
                        <a>{sublisting.sublistingRef}</a>
                      </td>
                      <td className="text-center py-3 px-4">
                        {sublisting.status}
                      </td>
                      <td className="text-center py-3 px-4">
                        {sublisting.salesRecord !== null &&
                        sublisting.salesRecord !== undefined ? (
                          <a href={`/sales/${sublisting.salesRecord}`}>
                            Sale #{sublisting.salesRecord}
                          </a>
                        ) : (
                          <>
                            {sublisting.status == "Not Recieved" ? (
                              <>
                                <button
                                  onClick={() =>
                                    onStatusChange(
                                      "Recieved",
                                      sublisting.sublistingId
                                    )
                                  }
                                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-green-600 text-base font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                  Recieved
                                </button>
                                <button
                                  onClick={() =>
                                    onStatusChange(
                                      "CANCELED",
                                      sublisting.sublistingId
                                    )
                                  }
                                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-red-600 text-base font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                  Canceled
                                </button>
                              </>
                            ) : sublisting.status == "Recieved" ? (
                              <>
                                <button
                                  onClick={() =>
                                    submitSaleHandler(
                                      sublisting.sublistingRef,
                                      sublisting.sublistingId
                                    )
                                  }
                                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                  Sold?
                                </button>
                                <button
                                  onClick={() =>
                                    onStatusChange(
                                      "Returned",
                                      sublisting.sublistingId
                                    )
                                  }
                                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-yellow-700 bg-yellow-100 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                  Returned
                                </button>
                              </>
                            ) : (
                              sublisting.status == "Returned" ||
                              (sublisting.status == "Canceled" && (
                                <span>-</span>
                              ))
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </>
  );
}
