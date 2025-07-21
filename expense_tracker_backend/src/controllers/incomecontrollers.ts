import Income from "../models/incomemodel";
import Goal from "../models/goalmodel";
import mongoose from "mongoose";

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
        isGoalAdd?:boolean,
        goalCreditAmount?:boolean    
    };
}
const validateUserId = (userIdString: string | undefined): mongoose.Types.ObjectId | null => {
    if (!userIdString || !mongoose.Types.ObjectId.isValid(userIdString)) {
        return null;
    }
    return new mongoose.Types.ObjectId(userIdString);
};


const getUserIncome = async (req: RequestFormat, res: Response): Promise<void> => {
    try {
        const userId = validateUserId(req.user?.userId);
        if (!userId) {
            res.status(400).json({
                success: false,
                message: 'Invalid or missing user ID'
            });
            return;
        }

        const income = await Income.find({ userId })
            .sort({ date: -1 })
            .select('-__v');
        
        res.status(200).json({
            success: true, 
            data: income,
            count: income.length,
            message: income.length === 0 ? 'No income found' : undefined
        });
    } catch (error) {
        console.error('Income data Error', error); 
        res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
    }
};
const addIncome = async(req:RequestFormat,res:Response):Promise<void>=>{
}
const deleteIncome = async(req:RequestFormat,res:Response):Promise<void>=>{};


export{addIncome,getUserIncome,deleteIncome};