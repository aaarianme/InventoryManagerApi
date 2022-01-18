import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
interface IElementProps {
  clickHandler: Function;
  defaultValue?: string | null;
  defaultDisplay?: string | null;
  fetchFrom?: string | null;
  defaultItems?: any | null;
  isHidden?: boolean;
}
/**
 *
 * @param props either defaultValue or defaultDisplay must be given. defaultValue has priority over defaultDisplay. fetchFrom is a link where the data is given in {displayName:string,value:string} format. defaultItems must follow the same format. isHidden is false by defualt.
 * @returns a dropdown menu that returns value to a function but shows displayName
 */
export default function DropDownItem(props: IElementProps) {
  const openerButton: any = useRef();
  const [dropdownItems, dropdownItemsSetter] = useState([]);

  /**
   * if the items in a dropdown are all loaded it will display the component
   */
  const [itemsLoaded, loadedSetter] = useState(false);

  const [dropdownDisplayValue, setDropDownDisplayValue] = useState<string>();

  const [isOpen, isOpenSetter] = useState<boolean>(false);

  /**
   * the component still gets its data. but it wont be visible. default is false
   */
  const [isHidden, isHiddenSetter] = useState(props.isHidden);

  /**
   *
   * @param path the url to the api end point. should return an array of {displayName:string,Value:string}
   */
  const getItems = async function (path: any) {
    if (path !== null && path !== undefined) {
      return await axios.get(path);
    }
    return undefined;
  };

  useEffect(() => {
    //window.addEventListener('click', ev => openerButton.current.contains(ev.target)==false && isOpenSetter(false));

    loadedSetter(false);
    const loadUpItems = async () => {
      var res = await getItems(props.fetchFrom);
      if (res == undefined) dropdownItemsSetter(props.defaultItems);
      else if (props.defaultItems !== undefined && props.defaultItems !== null)
        dropdownItemsSetter(props.defaultItems.concat(res.data.items));
      else dropdownItemsSetter(res.data.items);
      loadedSetter(true);
    };
    loadUpItems();
  }, []);

  useEffect(() => {
    if (props.defaultValue !== undefined) {
      let objArr: any = Object.values(dropdownItems);
      if (objArr.length > 0) {
        let foundItem = objArr.find(
          (item: any) => item.value === props.defaultValue
        );
        if (foundItem === undefined) {
          if (props.defaultDisplay != null)
            setDropDownDisplayValue(props.defaultDisplay);
          else setDropDownDisplayValue(objArr[0].displayName);
          return;
        }
        setDropDownDisplayValue(foundItem.displayName);
      }
      return;
    }
    if (props.defaultDisplay != null)
      setDropDownDisplayValue(props.defaultDisplay);
    return;
  }, [dropdownItems, props.defaultValue, props.defaultDisplay]);

  function internalClickHandler(ev: any, valueToPass: string) {
    ev.preventDefault();
    isOpenSetter(false);
    setDropDownDisplayValue(ev.target.text);
    props.clickHandler(valueToPass);
  }

  return (
    <>
      {!isHidden && itemsLoaded && (
        <div className="relative inline-block text-left">
          <div>
            <button
              ref={openerButton}
              type="button"
              onClick={() =>
                isOpen ? isOpenSetter(false) : isOpenSetter(true)
              }
              className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none "
              id="menu-button"
              aria-expanded="true"
              aria-haspopup="true"
            >
              {dropdownDisplayValue}
              <svg
                className="-mr-1 ml-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
          {isOpen && (
            <div className="z-40 origin-top-right absolute right-0 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1" role="none">
                {dropdownItems.map(
                  (item: { value: string; displayName: string }) => (
                    <a
                      onClick={(ev) => {
                        ev.persist();
                        internalClickHandler(ev, item.value);
                      }}
                      className={
                        "text-gray-700 cursor-pointer block px-4 py-2 text-sm "
                      }
                    >
                      {item.displayName}
                    </a>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
