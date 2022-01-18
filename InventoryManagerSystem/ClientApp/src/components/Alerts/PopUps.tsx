import React, { ReactElement, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import DatePicker from "../Inputs/DatePicker";
import LoadingSpinner from "../LoadingSpinner";
interface IPopUpTrigger {
  manager: any;
  state?: any;
}
/**
 * Put this component at the bottom of your page, set manager to a popUpManager returned by usePopUpManager
 * @param props must contain manager which is what the popUpmanagerHookReturns. In class manager, there is the following properties: isVisible:boolean popUp:ReactElement
 * @returns
 */
export function PopUpTrigger(props: IPopUpTrigger) {
  const [internalManager, setInternalManager] = useState(props.manager);
  const [updatedCount, setUpdatedCount] = useState(0);
  useEffect(() => {
    setUpdatedCount((preval) => preval + 1);
  }, [props.manager.popUp, props.manager.isVisible]);

  useEffect(() => {
    setInternalManager(props.manager);
  }, [props.manager]);

  return internalManager.isVisible === true ? (
    <>{ReactDOM.createPortal(internalManager.popUp, document.body)}</>
  ) : (
    <></>
  );
}

interface IYesCancelPopUp {
  header: string;
  message?: string | null;
  acceptFunction: Function;
  acceptButtonText?: string;
  declineFunction?: Function;
  declineButtonText?: string;
}

export function YesCancelPopUp(props: IYesCancelPopUp) {
  const [isVisible, setIsvisible] = useState(true);

  return isVisible ? (
    <div className="fixed z-10 inset-x-0 bottom-20 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block bg-white rounded-lg text-center overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white text-center px-4 pt-3 pb-4 sm:p-6 sm:pb-4">
            <div className="text-center justify-center sm:flex">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {props.header}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{props.message}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 text-center px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={() => {
                props.acceptFunction();
                setIsvisible(false);
              }}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {props.acceptButtonText ?? "Yes"}
            </button>
            <button
              onClick={() => {
                if (props.declineFunction instanceof Function)
                  props.declineFunction();
                setIsvisible(false);
              }}
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-red-300 shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {props.declineButtonText ?? "No"}
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

interface ILinkPopUp {
  header: string;
  message?: string | null;
  link: string;
  buttonText?: string | "Go";
  onClose?: Function;
}
export function LinkPopUp(props: ILinkPopUp) {
  const [isVisible, setIsvisible] = useState(true);

  return isVisible ? (
    <div className="fixed z-10 inset-x-0 bottom-20 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-3 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-center">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  {props.header}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{props.message}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <a
              type="button"
              href={props.link}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {props.buttonText ?? "Go"}
            </a>
            <button
              onClick={() => {
                if (props.onClose instanceof Function) props.onClose();
                setIsvisible(false);
              }}
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 white text-base font-medium text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

interface IMessagePopUp {
  header: string | null;
  message?: string | null;
  buttonText?: string | "Okay";
  onClose?: Function;
}
export function MessagePopup(props: IMessagePopUp) {
  const [isVisible, setIsvisible] = useState(true);

  return isVisible ? (
    <div
      className="fixed z-10 inset-x-0 bottom-20 overflow-y-auto"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 pb-40">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-3 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-800"
                  id="modal-title"
                >
                  {props.header}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{props.message}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={() => {
                if (props.onClose instanceof Function) props.onClose();
                setIsvisible(false);
              }}
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-blue-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-blue-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {props.buttonText ?? "Okay"}
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

interface ICustomPopUp {
  children: ReactElement<any, any>;
  onClose?: Function;
}
export function CustomPopUp(props: ICustomPopUp) {
  const [isVisible, setIsvisible] = useState(true);

  return isVisible ? (
    <div className="fixed z-10 inset-x-0 bottom-20 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>

        <div className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="flex justify-end px-3 py-2">
            <span
              className="text-red-600 cursor-pointer"
              onClick={() => {
                if (props.onClose instanceof Function) props.onClose();
                setIsvisible(false);
              }}
            >
              <i className="far fa-times-circle"></i>
            </span>
          </div>
          <div className="px-4 pb-4 subtext-font">{props.children}</div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

interface ILoadingPopUp {
  isVisible: boolean;
}
export function LoadingPopUp(props: ILoadingPopUp) {
  const [isVisible, setIsvisible] = useState(props.isVisible);
  useEffect(() => {
    setIsvisible(props.isVisible);
  }, [props]);

  return isVisible === true ? (
    <div className="fixed z-10 inset-x-0 bottom-20 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block bg-transparent rounded-lg text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <LoadingSpinner loadingText=""></LoadingSpinner>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

interface IErrorPopUp {
  header: string;
  message?: string | null;
  canRetry: boolean;
  retryFunction?: Function;
  retryButtonText?: string;
  closeButtonText?: string;
  onClose?: Function;
}
export function ErrorPopUp(props: IErrorPopUp) {
  const [isVisible, setIsvisible] = useState(true);

  return isVisible ? (
    <div
      className="fixed z-10 inset-x-0 bottom-20 overflow-y-auto"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 pb-40">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-3 pb-4 sm:p-6 sm:pb-4">
            <div className="">
              <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-left border-l-2 px-2 pt-2 pb-2 border-red-800 ">
                <h3 className="text-lg leading-6 font-medium text-red-800">
                  {props.header}
                </h3>
                <div className="mt-2">
                  <p className="pl-1 text-sm text-gray-500">{props.message}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {props.canRetry && (
              <button
                onClick={() => {
                  setIsvisible(false);
                  if (props.retryFunction != null) props.retryFunction();
                }}
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-blue-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-blue-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {props.retryButtonText ?? "Retry"}
              </button>
            )}
            <button
              onClick={() => {
                if (props.onClose instanceof Function) props.onClose();
                setIsvisible(false);
              }}
              type="button"
              className="w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {props.closeButtonText ?? "Close"}
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

interface IDatePickerPopUp {
  selectedDate: Date | string;
  allowNulls?: boolean;
  onClose?: Function;
  onSubmit: Function;
  submitButtonText?: string;
  children?: any;
}

export function DatePickerPopUp(props: IDatePickerPopUp) {
  const [isVisible, setIsvisible] = useState(true);
  const [currentDateValue, setCurrentDateValue] = useState<null | string>(
    props.selectedDate?.toString() ?? null
  );
  const addDaysToDate = (date: string | null, daysToAdd: number): string => {
    let currentDate = new Date(date ?? new Date());
    currentDate.setDate(currentDate.getDate() + daysToAdd);
    return currentDate.toLocaleDateString();
  };
  const subtractDaysToDate = (
    date: string | null,
    daysToAdd: number
  ): string => {
    let currentDate = new Date(date ?? new Date());
    currentDate.setDate(currentDate.getDate() - daysToAdd);
    return currentDate.toLocaleDateString();
  };
  function handleSubmit() {
    props.onSubmit(
      new Date(currentDateValue ?? new Date()).toLocaleDateString()
    );
    if (props.onClose instanceof Function) props.onClose();
    setIsvisible(false);
  }
  return isVisible === true ? (
    <CustomPopUp
      onClose={() => {
        if (props.onClose instanceof Function) props.onClose();
        setIsvisible(false);
      }}
    >
      <div className="px-2">
        {props.children}
        <div className="px-1 subtext-font mt-2 text-gray-600">
          <DatePicker
            selectedDate={currentDateValue}
            onChange={(val: any) => setCurrentDateValue(val)}
          />
          <div className="flex flex-row justify-center">
            <button
              onClick={() => {
                let newDate = addDaysToDate(currentDateValue, 60);
                setCurrentDateValue(newDate);
              }}
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-2 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-1 sm:w-auto sm:text-sm"
            >
              Add 60 days
            </button>
            <button
              onClick={() => {
                let newDate = addDaysToDate(currentDateValue, 40);
                setCurrentDateValue(newDate);
              }}
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-2 py-2 bg-pink-500 text-base font-medium text-white hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-1 sm:w-auto sm:text-sm"
            >
              Add 40 days
            </button>
            <button
              onClick={() => {
                let newDate = addDaysToDate(currentDateValue, 5);
                setCurrentDateValue(newDate);
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
                let newDate = subtractDaysToDate(currentDateValue, 60);
                setCurrentDateValue(newDate);
              }}
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-2 py-2 bg-gray-400 text-base font-medium text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-1 sm:w-auto sm:text-sm"
            >
              Back 60 days
            </button>
            <button
              onClick={() => {
                let newDate = subtractDaysToDate(currentDateValue, 15);
                setCurrentDateValue(newDate);
              }}
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-2 py-2 bg-gray-500 text-base font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-1 sm:w-auto sm:text-sm"
            >
              Back 15 days
            </button>
            <button
              onClick={() => {
                let newDate = subtractDaysToDate(currentDateValue, 10);
                setCurrentDateValue(newDate);
              }}
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-2 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-1 sm:w-auto sm:text-sm"
            >
              Back 10 days
            </button>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="border text-blue-600 px-3 pt-1 pb-1 mt-3 "
            >
              {props.submitButtonText ?? "Submit"}
            </button>
          </div>
        </div>
      </div>
    </CustomPopUp>
  ) : (
    <></>
  );
}

interface IMakeSalesPopUp {
  initialCost: string;
  initialDate: string;
  onSubmit: Function;
  onClose: Function;
}
export function MakeSalesPopUp(props: IMakeSalesPopUp) {
  const [soldPrice, setSoldPrice] = useState<string>("");
  const [date, setDate] = useState<string>(props.initialDate);
  const [cost, setCost] = useState<string>(props.initialCost);

  const [showMore, setShowMore] = useState<boolean>(false);

  const setSoldPriceHandler = (val: string) => {
    if (val == "") {
      setSoldPrice("");
      return;
    }
    if (isNaN(parseFloat(val)) == false) setSoldPrice(val);
  };

  const setCostHandler = (val: string) => {
    if (val == "") {
      setCost("0");
      return;
    }
    if (isNaN(parseFloat(val)) == false) setCost(parseFloat(val).toString());
  };

  function submitHandler() {
    props.onSubmit(soldPrice, date, cost);
  }

  return (
    <div className="fixed z-10 inset-x-0 bottom-20 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block bg-white rounded-lg text-center overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-3 pb-4 sm:p-6 sm:pb-4">
            <div className="w-full block">
              <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-left">
                <div className="mt-2 w-full">
                  <div>
                    <label className="block uppercase tracking-wide text-red-600 text-xs font-bold mb-2">
                      Sold Price
                    </label>
                    <div className="flex flex-row w-1/2">
                      <input
                        value={soldPrice}
                        onChange={(ev) => setSoldPriceHandler(ev.target.value)}
                        className="appearance-none  block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:border-gray-500"
                        id="grid-last-name"
                        type="text"
                        placeholder="Sold Price"
                      />
                      <div
                        className={
                          "flex flex-col justify-center px-4 " +
                          getLabelStyles()
                        }
                      >
                        <label className="subtext-font text-lg mb-0">
                          {getProfitLabelValue()}
                        </label>
                      </div>
                    </div>
                  </div>
                  {showMore === true ? (
                    <div className="mt-3 border rounded mr-16 px-4 pt-2 pb-2 text-gray-600 text-font flex flex-col space-y-2 text-xs">
                      <div>
                        <DatePicker
                          selectedDate={date}
                          onChange={(val: string) => setDate(val)}
                        ></DatePicker>
                      </div>
                      <div>
                        <input
                          value={cost}
                          onChange={(ev) => setCostHandler(ev.target.value)}
                          className="appearance-none  block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:border-gray-500"
                          id="grid-last-name"
                          type="text"
                          placeholder="Cost"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <label
                        onClick={() => setShowMore(true)}
                        className="text-xs cursor-pointer text-gray-500 mt-2"
                      >
                        More Details?
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 text-center px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={() => {
                submitHandler();
              }}
              className="mt-3 w-full inline-flex justify-center text-lg rounded-md border border-red-300 shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              SOLD
            </button>
            <button
              onClick={() => {
                if (props.onClose instanceof Function) props.onClose();
              }}
              type="button"
              className="mt-3 w-full inline-flex text-lg justify-center rounded-md border border-red-300 shadow-sm px-4 py-2 bg-grey-50 text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  function getLabelStyles() {
    if (parseFloat(cost) < parseFloat(soldPrice)) return "text-green-500";
    if (parseFloat(cost) > parseFloat(soldPrice)) return "text-red-500";
    return "text-gray-500";
  }
  function getProfitLabelValue() {
    if (soldPrice == "") return "";
    let res = "";
    if (parseFloat(cost) > parseFloat(soldPrice)) res = "-";
    else if (parseFloat(cost) == parseFloat(soldPrice)) res = "";
    else res = "+";
    return res + Math.abs(parseFloat(soldPrice) - parseFloat(cost));
  }
}
