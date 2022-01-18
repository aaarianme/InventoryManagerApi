import React from 'react'

/**
 * 
 * @param {*} props Takes in loadingText that is displayed under loading widget 
 * @returns 
 */
function LoadingSpinner(props:any) {
    return (
        <>
            <div className="text-center">
            <div className="lds-default">
            <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            <label className="block text-dark-700 cgfont">{props.loadingText!=null? props.loadingText : "Loading"}</label>
            </div>
            
        </>
    )
}

export default LoadingSpinner
