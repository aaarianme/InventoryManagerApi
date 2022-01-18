import React, { ReactElement, useEffect } from "react";

interface ITab {
  id?: string;
  label?: string | null;
  children: ReactElement<any, any>;
  wrapperClasses?: string | "";
  onActive?: Function;
  onHeaderClick?: Function;
  isButton?: boolean;
  OnLeave?: Function;
  rightSide?: boolean;
  className?: string;
}
/**
 * A tab must have a TabPage parent. It is used to seperate tabs in a tabPage component. You could use and set 'Id' for code readiblity improvemnt when editing. Id is not used withing the tab
 * @param props Must contain children. Could contain a wrapperClasses string for its classes and a label that could be accessed by a tabPage Coponent as its header. Has onLeave and onActive events.
 * @returns
 */
export default function Tab(props: ITab) {
  return <div className={props.wrapperClasses}>{props.children}</div>;
}
