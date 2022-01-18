import React, { useState, useEffect } from "react";

interface IDatePicker {
  selectedDate: string | null;
  onChange: Function;
  initialCallBack?: boolean;
}
export default function DatePicker(props: IDatePicker) {
  const dateVal =
    props.selectedDate === null || props.selectedDate == undefined
      ? new Date()
      : new Date(props.selectedDate);
  const month = dateVal?.getMonth() + 1 ?? null;
  const day = dateVal?.getDate() ?? null;
  const year = dateVal?.getFullYear() ?? null;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ];

  function notifyOnChange(val: Date | null) {
    console.log("im passing", val);
    props.onChange(val?.toLocaleDateString() ?? null);
  }

  function onMonthChange(val: string | null) {
    notifyOnChange(new Date(`${year}-${val}-${day}`));
  }
  function onDayChange(val: number | null) {
    notifyOnChange(new Date(`${year}-${month}-${val}`));
  }
  function onYearChange(val: number | null) {
    notifyOnChange(new Date(`${val}-${month}-${day}`));
  }
  return (
    <>
      <div
        className={
          "px-2 pt-2 pb-2 border rounded flex flex-row gap-1 text-sm justify-center flex " +
          (props.selectedDate != null ? "" : "bg-gray-50")
        }
      >
        <div className="relative">
          <select
            value={year?.toString() ?? "****"}
            onChange={(ev) => onYearChange(parseInt(ev.target.value))}
            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-state"
          >
            <option>
              {(dateVal === null
                ? new Date().getFullYear()
                : dateVal.getFullYear()) - 1}
            </option>
            <option>
              {dateVal === null
                ? new Date().getFullYear()
                : dateVal.getFullYear()}
            </option>
            <option>
              {(dateVal === null
                ? new Date().getFullYear()
                : dateVal.getFullYear()) + 1}
            </option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        <div className="relative">
          <select
            value={month == null ? "**" : monthNames[month - 1]}
            onChange={(ev) => onMonthChange(ev.target.value)}
            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-state"
          >
            {monthNames.map((name) => (
              <option>{name}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        <div className="relative">
          <select
            value={day == null ? "*" : day}
            onChange={(ev) => onDayChange(parseInt(ev.target.value))}
            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-state"
          >
            {days.map((i) => (
              <option>{i}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
