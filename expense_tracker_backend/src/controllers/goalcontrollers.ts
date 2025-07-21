import { Request,Response } from "express";
import Income from "../models/incomemodel";
import Goal from "../models/goalmodel";

interface RequestFormat extends Request {
    user: {
        userId: string;
        email: string;
    };
}

const addGoal = async(req:RequestFormat,res:Response):Promise<void>=>{}
const getGoal = async(req:RequestFormat,res:Response):Promise<void>=>{}
