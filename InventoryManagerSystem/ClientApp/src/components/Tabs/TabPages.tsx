import React, {
  ReactElement,
  ReactHTML,
  TableHTMLAttributes,
  useState,
  useEffect,
} from "react";

import Tab from "./Tab";
interface ITabPageWithHeadline {
  children: Array<ReactElement<any, any>>;
  wrapperClasses?: string;
  selectedTab?: number;
  containerWrapperClasses?: string;
}
export function TabPageWithHeadline(props: ITabPageWithHeadline) {
  const [focusIndex, setFocusIndex] = useState<number>(props.selectedTab ?? 0);

  //#region Component KeyDown event set up, handler and cleanup
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.keyCode === 39) {
        setFocusIndex((preval) =>
          preval + 1 != props.children.length &&
          props.children[preval + 1].props.isButton !== true
            ? preval + 1
            : preval
        );
        return;
      }
      if (event.keyCode === 37) {
        setFocusIndex((preval) =>
          preval - 1 != -1 && props.children[preval - 1].props.isButton !== true
            ? preval - 1
            : preval
        );
        return;
      }
    };
    document.getElementById("parentTabWithHeader")?.focus();
    document
      .getElementById("parentTabWithHeader")
      ?.addEventListener("keydown", (ev) => {
        handleKeyDown(ev);
      });
    return () => {
      document
        .getElementById("parentTabWithHeader")
        ?.removeEventListener("keydown", handleKeyDown, true);
    };
  }, []);
  //#endregion
  //#region Update props.selectedTab with internal state
  useEffect(() => {
    setFocusIndex(props.selectedTab ?? focusIndex);
  }, [props.selectedTab]);
  //#endregion
  //#region Tab onActive and onLeave events handlers
  useEffect(() => {
    if (props.children[focusIndex].props.onActive instanceof Function)
      props.children[focusIndex].props.onActive(
        props.children[focusIndex].props.label ?? ""
      );
    if (
      focusIndex != 0 &&
      props.children[focusIndex - 1].props.OnLeave instanceof Function
    )
      props.children[focusIndex - 1].props.OnLeave(
        props.children[focusIndex - 1].props.label ?? ""
      );
    window.focus();
  }, [focusIndex]);
  //#endregion
  //#region  Styling Functions
  function getHeaderLabelStyles(childIndex: number) {
    if (childIndex == focusIndex)
      return "w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-indigo-500 text-base font-medium text-white focus:outline-none  sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm";
    if (
      props.children[childIndex].props.className != undefined &&
      props.children[childIndex].props.className != null
    )
      return props.children[childIndex].props.className;

    return "w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm";
  }
  //#endregion
  return (
    <div
      id="parentTabWithHeader"
      tabIndex={0}
      className={props.wrapperClasses + " focus:outline-none"}
    >
      <div className="pb-2 border-b pt-2 mx-3">
        <div className="flex justify-between">
          <div id="left">
            {props.children.map(
              (ch, i) =>
                ch.props.rightSide !== true && (
                  <button
                    key={i}
                    className={getHeaderLabelStyles(i)}
                    onClick={() => {
                      if (ch.props.isButton === true) ch.props.onHeaderClick();
                      else setFocusIndex(i);
                    }}
                  >
                    {ch.props.label}
                  </button>
                )
            )}
          </div>
          <div id="right">
            {props.children.map(
              (ch, i) =>
                ch.props.rightSide === true && (
                  <button
                    key={i}
                    className={getHeaderLabelStyles(i)}
                    onClick={() => {
                      if (ch.props.isButton === true) ch.props.onHeaderClick();
                      else setFocusIndex(i);
                    }}
                  >
                    {ch.props.label}
                  </button>
                )
            )}
          </div>
        </div>
      </div>
      <div className={"px-4 pt-2 pb-1 " + props.containerWrapperClasses}>
        {props.children[focusIndex]}
      </div>
    </div>
  );
}

interface IFlowTabPage {
  children: Array<ReactElement<any, any>>;
  wrapperClasses?: string;
  selectedTab?: number;
}
export function FlowTabPage(props: IFlowTabPage) {
  const [focusIndex, setFocusIndex] = useState(props.selectedTab ?? 0);
  //#region porps.selectedTab internal state update
  useEffect(() => {
    setFocusIndex(props.selectedTab ?? focusIndex);
  }, [props.selectedTab]);
  //#endregion
  //#region Tab onActive and onLeave event handler
  useEffect(() => {
    if (props.children[focusIndex].props.onActive instanceof Function)
      props.children[focusIndex].props.onActive(
        props.children[focusIndex].props.label ?? ""
      );
    if (
      focusIndex != 0 &&
      props.children[focusIndex - 1].props.OnLeave instanceof Function
    )
      props.children[focusIndex - 1].props.OnLeave(
        props.children[focusIndex - 1].props.label ?? ""
      );
    window.focus();
  }, [focusIndex]);
  //#endregion
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.keyCode === 39) {
        setFocusIndex((preval) =>
          preval + 1 != props.children.length ? preval + 1 : preval
        );
        return;
      }
      if (event.keyCode === 37) {
        setFocusIndex((preval) => (preval != 0 ? preval - 1 : preval));
        return;
      }
    };
    window.addEventListener("keydown", (ev) => {
      handleKeyDown(ev);
    });
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, []);
  return (
    <div
      className={
        "flex flex-row inline-flex gap-2 focus:bg-red-200 " +
        props.wrapperClasses
      }
    >
      <div className="flex flex-col justify-center w-auto px-2 text-3xl">
        {focusIndex !== 0 && (
          <span
            onClick={() => setFocusIndex((preval) => preval - 1)}
            className="mx-auto text-gray-300 hover:text-gray-500 cursor-pointer"
          >
            <i className="fas fa-arrow-circle-left"></i>
          </span>
        )}
      </div>
      <div className="px-4 pt-2 pb-1 flex flex-col">
        {props.children[focusIndex]}
      </div>
      <div className="flex flex-col justify-center w-auto px-2">
        {focusIndex !== props.children.length - 1 && (
          <span
            onClick={() => setFocusIndex((preval) => preval + 1)}
            className="mx-auto text-gray-300 hover:text-gray-500 cursor-pointer text-3xl"
          >
            <i className="fas fa-arrow-circle-right"></i>
          </span>
        )}
      </div>
    </div>
  );
}
/*props.children[focusIndex - 1].props.OnLeave(
  props.children[focusIndex - 1].props.label ?? ""
);*/
