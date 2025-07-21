import { Request, Response } from "express";
import User from "../models/usermodel";
import Income from "../models/incomemodel";
import Expense from "../models/expensemodel";
import Budget from "../models/budgetmodel";
import Goal from "../models/goalmodel";
import GoalCredit from "../models/goalcredtmodel";

interface RequestFormat extends Request {
    user: {
        userId: string;
        email: string;
    };
}

const getUserInfo = async (req: RequestFormat, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(400).json({
                success: false, // Fixed: was true
                message: "User ID is required" // Fixed typo
            });
            return;
        }

        const user = await User.findById(userId); // Removed Document type annotation
        if (!user) {
            res.status(404).json({ // Changed from 400 to 404
                success: false, // Fixed typo: was succuss
                message: 'No user found' // Fixed typo: was messsage
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

const getUserExpense = async (req: RequestFormat, res: Response): Promise<void> => { 
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(400).json({
                success: false,
                message: 'User ID is required',
            });
            return;
        }

        const expenses = await Expense.find({ userId }); // Renamed variable for clarity
        
        if (!expenses || expenses.length === 0) {
            res.status(404).json({
                success: false,
                message: 'No expenses found for user'
            });
            return;
        }

        res.status(200).json({
            success: true, // Fixed typo: was sucess
            data: expenses
        });
    } catch (error) {
        console.error('Expense data Error', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
    }
};

const getUserIncome = async (req: RequestFormat, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(400).json({
                success: false,
                message: 'User ID is required',
            });
            return;
        }

        const income = await Income.find({ userId });
        
        if (!income || income.length === 0) {
            res.status(404).json({
                success: false,
                message: 'No income found for user'
            });
            return;
        }

        res.status(200).json({
            success: true, 
            data: income
        });
    } catch (error) {
        console.error('Income data Error', error); // Fixed error message
        res.status(500).json({ // Changed from 400 to 500
            success: false,
            message: 'Internal server error' // Fixed typo
        });
    }
};

const getUserBudget = async (req: RequestFormat, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(400).json({
                success: false, 
                message: 'User ID is required'
            });
            return;
        }

        const budget = await Budget.find({ userId });
        
        if (!budget || budget.length === 0) {
            res.status(404).json({ 
                success: false, 
                message: 'No budget found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: budget
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
        const userId = req.user?.userId;
        if (!userId) {
            res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
            return;
        }

        const goals = await Goal.find({ userId }); 
        
        if (!goals || goals.length === 0) {
            res.status(404).json({ 
                success: false, 
                message: 'No goals found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: goals
        });
    } catch (error) {
        console.error("Goal fetching error", error);
        res.status(500).json({
            success: false, // Fixed: was true
            message: 'Internal server error' // Fixed typo: was 'Internal status error'
        });
    }
};

const getUserGoalCredit = async (req: RequestFormat, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(400).json({
                success: false, 
                message: 'User ID is required'
            });
            return;
        }

        const goalCredit = await GoalCredit.findOne({ userId });
        
        if (!goalCredit) {
            res.status(404).json({ 
                success: false, 
                message: 'No goal credit found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: goalCredit
        });
    } catch (error) {
        console.error("Goal credit fetching error", error); 
        res.status(500).json({
            success: false, 
            message: 'Internal server error' 
        });
    }
};


export {
    getUserInfo,
    getUserExpense,
    getUserIncome,
    getUserBudget,
    getUserGoal,
    getUserGoalCredit
};