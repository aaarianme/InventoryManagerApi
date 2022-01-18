import axios from 'axios';
import React,{useState,useEffect,useRef} from 'react';

/**
 * This GETs data from url in format [loaded,data,getFunction]
 * @param {*} url within the app
 * @returns 
 */
export function useFetch(defaultState:any)
{
    const [loaded,loadedSetter]=useState(false); //when fetch is over loaded=true
    const[data,dataSetter]=useState(defaultState); //res.data
    const dataStorage=useRef({}); //cache the response
    let source=axios.CancelToken.source(); //cancel token
    useEffect(() => {

        return () => {
            
            console.log("CANCELED");
            source.cancel("AXIOS CANCELED");
        }
    }, []) // request cleanup
    
    /**
     * 
     * @param url 
     * @param lookInCache look in casch results? default is true
     * @returns 
     */
    const getData=async function (url:string,lookInCache=true) {
        if(url==null || url=="") return;

        if(lookInCache && dataStorage.current[url]!==null && dataStorage.current[url]!==undefined)
        {
            console.log("from cashce");
            dataSetter(dataStorage.current[url]);
            loadedSetter(true);
            return;

        }
        loadedSetter(false);
        let res : any =(await axios.get(url,{cancelToken:source.token}));
        dataSetter(res);
        console.log("response in useFethc is for url",url,res);
        loadedSetter(true);
        dataStorage.current[url]=res;        
    }


    
    return[loaded,data,getData]
}

export function usePost() {

    const postData=async function(url:string,dataObj:any=null,param:any=null) {
        if(url==null || url=="")
            return;
        var res=await axios.post(url,dataObj,{params:param});
        console.log("response in usePost",res);

        return res;        
    }

    return postData

    
    
}

export function useGetRequest() {
    const dataStorage=useRef({});
    let source=axios.CancelToken.source();//cancel token
    useEffect(() => {
        return () => {
            source.cancel("AXIOS CANCELED");
        }
    }, []) //request cleanup
    const getRequest=async(url:string,lookInCache=false)=>{
        if(lookInCache===true && dataStorage[url]!==null && dataStorage[url]!==undefined){
            return dataStorage.current[JSON.parse(url)];
            
        }
        console.log(url)
        let res=(await axios.get(url,{cancelToken:source.token}));
        console.log("response in useRequest",res);
        dataStorage.current[JSON.stringify(url)]=res;
        return res;
    }
    return getRequest;
    
}