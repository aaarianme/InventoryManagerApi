import React,{useState,useEffect} from 'react';
import qs from 'querystring';
import {useHistory} from 'react-router';


function setQueryParamsWithNoNullsAllowed(currentParams:object,newParams:object={}) {
    
    let combinedFilters={...currentParams,...newParams};

    let keyValuePairArr=Object.entries(combinedFilters).filter(x=> x[1]!="" && x[1]!=null);

    var newFiltersObject={};
    for (let i = 0; i < keyValuePairArr.length; i++) {
        newFiltersObject[keyValuePairArr[i][0]]=keyValuePairArr[i][1];
        
    }
    return newFiltersObject;
    
}

/**
 * 
 * @param {*} initialParams give the initial params available in the url
 * @param {*} followupFunction what function to call with new set of searchParams right after params have been added to the url. Function must take in "fullQueryParams" 
 * @returns 
 */
export default function useSearchParams(initialParams:object,followupFunction:Function=()=>{return null}):[object,Function]
{
    const history=useHistory();
    const [params,paramsSetter]=useState(setQueryParamsWithNoNullsAllowed(initialParams));

    useEffect(() => {
        history.push("?"+qs.stringify(params));
        if(followupFunction instanceof Function)
        {
            let fullQueryParams=(qs.stringify(params)==null ? null : ("?"+qs.stringify(params)));
            followupFunction(fullQueryParams);
        }    }, [params])

    const setFilters=(newParam:{key:string,value:string})=> {
        let newSetOfParams=setQueryParamsWithNoNullsAllowed(params,newParam);
        paramsSetter(newSetOfParams);
    }
    
    return[params,setFilters]
}