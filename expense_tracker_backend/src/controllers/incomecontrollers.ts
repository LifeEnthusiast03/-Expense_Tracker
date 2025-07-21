import Income from "../models/incomemodel";
import Goal from "../models/goalmodel";
import GoalCredit from "../models/goalcredtmodel";
import { Request,Response } from "express";
interface RequestFormat extends Request {
    user: {
        userId: string;
        email: string;
    };
    body: {
        category: string; 
        amount: number;   
        title: string;
        description?: string; 
        date?: Date;    
    };
}

const addIncome = async(req:RequestFormat,res:Response):Promise<void>=>{}
const addIncomeWithGoal = async(req:RequestFormat,res:Response):Promise<void>=>{}

export{addIncome,addIncomeWithGoal};