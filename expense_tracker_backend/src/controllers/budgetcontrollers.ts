import { Request,Response } from "express";
import Expense from "../models/expensemodel";
import Budget from "../models/budgetmodel";

interface RequestFormat extends Request {
    user: {
        userId: string;
        email: string;
    };
}

const addBudget = async(req:RequestFormat,res:Response):Promise<void>=>{}
const getBudget = async(req:RequestFormat,res:Response):Promise<void>=>{}
