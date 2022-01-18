import React, { ReactElement,useState,useEffect } from 'react'
import ReactDOM from 'react-dom';
/**
 * This function could take a ReactElement to be initialized. Use setPopUp to set a new popUp or removePopUp to remove the current popUp.
 * @param initialPopUp The current popUp, if applicable.
 * @returns a popUpmanager Class.
 */
export default function usePopUpManager(initialPopUp?:ReactElement) {
    
    class manager{
        public popUp? : ReactElement<any,any>;
        public isVisible :boolean ;
        public constructor(popUpComp?:ReactElement<any,any>, isVisible:boolean=false){
            this.popUp=popUpComp;
            if(popUpComp === null || popUpComp === undefined) this.isVisible=false;
            else this.isVisible=isVisible;
        }
          
        public setPopUp(popUpComp?:ReactElement<any,any>){
            this.removePopUp();
            setpopUpManager(new manager(popUpComp,true));
        }
        public removePopUp(){
            setpopUpManager(new manager());
        }
        public returnPopUp(popUpComp:ReactElement){
            return ReactDOM.createPortal(popUpComp,document.body)
        }
    }
    const [popUpManager, setpopUpManager] = useState<manager>(new manager(initialPopUp,true));

    return popUpManager
}
