import { Request, Response } from "express";
import User from "../models/usermodel";
import Income from "../models/incomemodel";
import Expense from "../models/expensemodel";
import Budget from "../models/budgetmodel";
import Goal from "../models/goalmodel"; 
import mongoose from "mongoose";

interface RequestFormat extends Request {
    user: {
        userId: string;
        email: string;
    };
}

// Helper function to validate userId
const validateUserId = (userIdString: string | undefined): mongoose.Types.ObjectId | null => {
    if (!userIdString || !mongoose.Types.ObjectId.isValid(userIdString)) {
        return null;
    }
    return new mongoose.Types.ObjectId(userIdString);
};

const getUserInfo = async (req: RequestFormat, res: Response): Promise<void> => {
    try {
        const userId = validateUserId(req.user?.userId);
        if (!userId) {
            res.status(400).json({
                success: false, 
                message: "Invalid or missing user ID"
            });
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error("User data Error", error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const getUserBudget = async (req: RequestFormat, res: Response): Promise<void> => {
    try {
        const userId = validateUserId(req.user?.userId);
        if (!userId) {
            res.status(400).json({
                success: false, 
                message: 'Invalid or missing user ID'
            });
            return;
        }

        const budget = await Budget.find({ userId })
            .sort({ createdAt: -1 })
            .select('-__v');
        
        res.status(200).json({
            success: true,
            data: budget,
            count: budget.length,
            message: budget.length === 0 ? 'No budgets found' : undefined
        });
    } catch (error) {
        console.error('Budget fetching error', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const getUserGoal = async (req: RequestFormat, res: Response): Promise<void> => {
    try {
        const userId = validateUserId(req.user?.userId);
        if (!userId) {
            res.status(400).json({
                success: false,
                message: 'Invalid or missing user ID'
            });
            return;
        }

        const goals = await Goal.find({ userId })
            .sort({ createdAt: -1 })
            .select('-__v');
        
        res.status(200).json({
            success: true,
            data: goals,
            count: goals.length,
            message: goals.length === 0 ? 'No goals found' : undefined
        });
    } catch (error) {
        console.error("Goal fetching error", error);
        res.status(500).json({
            success: false, 
            message: 'Internal server error' 
        });
    }
};



export {
    getUserInfo,
    getUserBudget,
    getUserGoal,
   
};