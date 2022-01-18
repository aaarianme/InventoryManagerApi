import React, { ReactElement } from "react";

interface IBasicALert {
  header?: string | null;
  wrapperClasses?: string | null;
  color: string;
  children?: ReactElement<any, any> | null;
}
export function BasicAlert(props: IBasicALert) {
  function getStylesFromColor() {
    switch (props.color) {
      case "yellow":
        return "border-yellow-500 bg-yellow-100 text-yellow-700 ";

      case "red":
        return "border-red-600 bg-red-200 text-red-800 ";
      default:
        return "border-black bg-gray-300 text-black";
    }
  }
  return (
    <div>
      <div
        className={
          "border-l-4 p-4 " + props.wrapperClasses + " " + getStylesFromColor()
        }
        role="alert"
      >
        <p className="font-bold">{props.header ?? "Heads Up"}</p>
        {props.children != null && props.children}
      </div>
    </div>
  );
}

interface ILineAlert {
  message: string;
  color: string;
}
export function LineAlert(props: ILineAlert) {
  function getStyles() {
    let base = "border px-4 py-3 rounded relative subtext-font ";
    switch (props.color) {
      case "red":
        return base + "border-red-400 text-red-700 bg-red-100";
      case "blue":
        return base + "border-blue-400 text-blue-900 bg-blue-100";
      case "gray":
        return base + "border-gray-400 text-gray-900 bg-gray-100";

      default:
        return base + "text-gray-700 bg-gray-50 border-black";
    }
  }
  return (
    <div className={getStyles()}>
      <span className="block sm:inline">{props.message}</span>
    </div>
  );
}

interface IServerErrorAlert {
  status: number;
  data: any;
  config?: any;
  children?: ReactElement<any, any>;
}
export function ServerExceptionAlert(props: IServerErrorAlert) {
  function getAlertStyles() {
    return "red";
  }
  return (
    <div className="pt-64 px-64">
      <BasicAlert
        color={getAlertStyles()}
        header={props.data.message}
      ></BasicAlert>
      {props.children}
    </div>
  );
}
