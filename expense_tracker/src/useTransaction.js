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
    console.log(currenttransation,"this is the current traction");
    currenttransation.forEach((t)=>{
            const catagory=catagories.find((c)=>c.type===t.category);
            console.log(catagory);
            
            if(catagory){
                catagory.amount+=t.amount;
            } 
    })
    const filterdTranscation=catagories.filter((c)=> c.amount>0);
    console.log("i am in usetraction tranction");
        console.log(filterdTranscation,"this is the filteredtracstion");
        
    const chartdata = {
        labels: filterdTranscation.map((c) => c.type),  
        datasets: [
            {
                data: filterdTranscation.map((c) => c.amount),
                backgroundColor: filterdTranscation.map((c) => c.color) 
            }
        ]
    };

 
    
    

    return {total,chartdata}
}
export default useTransaction;