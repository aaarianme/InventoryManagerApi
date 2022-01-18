import React, { useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";
interface ILoadingTrigger {
  children: any;
  isLoaded: boolean | false;
  loadingText?: string | "Loading";
  wrapperClassesForLoading?: string | "";
}
export default function LoadingTrigger(props: ILoadingTrigger) {
  useEffect(() => {
    console.log(props);
  }, [props]);
  return (
    <>
      {props.isLoaded === true ? (
        props.children
      ) : (
        <div className={props.wrapperClassesForLoading}>
          <LoadingSpinner loadingText={props.loadingText}></LoadingSpinner>
        </div>
      )}
    </>
  );
}
