import { Request,Response } from "express";
import Income from "../models/incomemodel";
import Expense from "../models/expensemodel";
import Budget from "../models/budgetmodel";
import Goal from "../models/goalmodel";


interface RequestFormat extends Request {
user: {
    userId: string;
    email: string;
};
}
//This is for geting last 4 weak data of income and expense (weekly agrigated)
const getWeaksData = async(req:RequestFormat,res:Response):Promise<void>=>{}
//This is for geting weekly data by date wise
const getWeaklyData = async(req:RequestFormat,res:Response):Promise<void>=>{}
//This is for geting last 12 months data month wise
const getMonthsData = async(req:RequestFormat,res:Response):Promise<void>=>{}
//this is for last 1 month data wiht daily day wise
const getMonthlyData = async(req:RequestFormat,res:Response):Promise<void>=>{}
//this is for geting last 12 month saving data
const getMonthSavingData = async(req:RequestFormat,res:Response):Promise<void>=>{}
//this is for geting monthly avarage
const getMonthAvarageExpense = async(req:RequestFormat,res:Response):Promise<void>=>{}
//this is for geting the highest expense day of the month
const getMonthHighestExpenseDay = async(req:RequestFormat,res:Response):Promise<void>=>{}
//this is for geting last last 6 month saving percetage
const getSavingPercentage = async(req:RequestFormat,res:Response):Promise<void>=>{}
//this is for geting last 6 month catagory wise spending data
const getCatagoryExpense = async(req:RequestFormat,res:Response):Promise<void>=>{}

