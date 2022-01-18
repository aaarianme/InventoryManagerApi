import { link } from 'fs'
import React from 'react'
enum Colors{
    tealBlue="bg-tealblue",
    darkRed="bg-darkred"
}
interface INavBarProps{
    header:string,
    color:any
}
export function NavBar(props:INavBarProps) {
    return (
        <nav className={props.color ?? "bg-tealblue"}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 header-text">
          <div className="flex justify-between h-12">
                <div className="flex items-center header-font">
                    <a href="/u/mydashboard" className="bg-dark-700 text-white text-xl cursor-pointer px-2 py-1 rounded-lg rounded-lg  bbfont">
                        {props.header}
                    </a>
                </div>
            </div>
        
        </div>
        </nav>
    )
}

interface ISolidNavBar{
    header:string,
    color?:any,
    link:string
}
export function SolidNavBar(props:ISolidNavBar) {
    return (
        <nav className={props.color ?? "bg-tealblue"}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 header-text">
          <div className="flex justify-between h-12">
                <div className="flex items-center subtext-font">
                    <a href={props.link} className="bg-dark-700 text-white text-xl cursor-pointer px-2 py-1 rounded-lg rounded-lg  bbfont">
                        {props.header}
                    </a>
                </div>
            </div>
        
        </div>
        </nav>
    )
}
