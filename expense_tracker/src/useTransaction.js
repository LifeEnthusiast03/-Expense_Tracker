import { useContext } from "react";
import { expenseTrackerContex } from "../src/Context/Context";
import { incomeCategories,expenseCategories,resetCategories } from "./Constants/Constant";


const useTransaction = (title) => {
    resetCategories();
    console.log(title);
    
    const  {transaction}=useContext(expenseTrackerContex);
    const catagories = (title === "income") 
    ? incomeCategories.map(c => ({ ...c })) 
    : expenseCategories.map(c => ({ ...c }));


    const currenttransation=transaction.filter((t)=>t.type===title);
    const total=currenttransation.reduce((acc,curr)=>acc+=curr.amount,0);
    
    currenttransation.forEach((t)=>{
            const catagory=catagories.find((c)=>c.type===t.category);
            console.log(catagory);
            
            if(catagory){
                catagory.amount+=t.amount;
                console.log("yes i have changes the amont");
                console.log(catagory.amount);
                console.log(catagory);
                
            } 
    })
    const filterdTranscation=catagories.filter((c)=> c.amount>0);
    const chartdata={
            dataset:[
                {
                    data:filterdTranscation.map((c)=>c.amount),
                    backgroundcolour:filterdTranscation.map((c)=>c.color)
                }
            ],
            labals:filterdTranscation.map((c)=>c.type)
    }

    console.log(chartdata);
    
    

    return {total,chartdata}
}
export default useTransaction;