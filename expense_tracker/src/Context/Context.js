import React,{createContext,useReducer} from "react";
import AppReducer from "./AppReducer";
const initialState=[];

 export const expenseTrackerContex = createContext(initialState);

 export const Trackprovider=({children})=>{
        const [transaction,dispatch]=useReducer(AppReducer,initialState);
        const deleteTransaction=(id)=>{
            dispatch({
                type:"DELETE_TRANSACTION",
                payload:id
            })
        }
        const addTransaction=(transaction)=>{
            dispatch({
                type:"ADD_TRANSACTION",
                payload:transaction
            })
        }
        return(
            <expenseTrackerContex.Provider value={{
                deleteTransaction,
                addTransaction,
                transaction
            }}>
            {children}
        </expenseTrackerContex.Provider>
        )
        
 }

