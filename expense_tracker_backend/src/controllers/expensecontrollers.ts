import { Request, Response } from "express";
import Expense from "../models/expensemodel";
import Budget from "../models/budgetmodel";
import mongoose from "mongoose";

interface AuthenticateRequest extends Request {
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

const addExpense = async (req: AuthenticateRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { category, amount, title, description, date } = req.body;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'User authentication required'
            });
            return;
        }

        if (!category) {
            res.status(400).json({
                success: false,
                message: 'Category is required'
            });
            return;
        }

        if (!amount || amount <= 0) {
            res.status(400).json({
                success: false,
                message: 'Valid amount is required'
            });
            return;
        }

        if (!title || title.trim().length === 0) {
            res.status(400).json({
                success: false,
                message: 'Title is required'
            });
            return;
        }

        const validCategories = ['food', 'transport', 'housing', 'utilities', 'healthcare', 'entertainment', 'shopping', 'education', 'travel', 'other'];
        if (!validCategories.includes(category)) {
            res.status(400).json({
                success: false,
                message: 'Invalid category'
            });
            return;
        }

        const expenseDate = date ? new Date(date) : new Date();
        
        const expenseData = {
            title: title.trim(),
            category, 
            amount,
            date: expenseDate,
            userId: new mongoose.Types.ObjectId(userId),
            description: description?.trim() || undefined
        };

        // Create expense
        const expense = await Expense.create(expenseData);

        // Update budget current amount if budget exists
        let updatedBudget = null;
        try {
            updatedBudget = await Budget.updateCurrentAmount(
                new mongoose.Types.ObjectId(userId), 
                category, 
                amount, 
                expenseDate
            );
        } catch (budgetError) {
            console.error('Error updating budget amount:', budgetError);
            // Continue execution even if budget update fails
        }

        res.status(201).json({ 
            success: true,
            message: 'Expense added successfully', 
            data: {
                expense,
                budgetUpdated: !!updatedBudget,
                updatedBudget: updatedBudget ? {
                    id: updatedBudget._id,
                    currentAmount: updatedBudget.currentAmount,
                    budgetAmount: updatedBudget.budgetAmount,
                    remainingAmount: updatedBudget.budgetAmount - updatedBudget.currentAmount
                } : null
            }
        });

    } catch (error) {
        console.error('Add expense error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const addExpenseWithBudgetCheck = async (req: AuthenticateRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { category, amount, title, description, date } = req.body;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'User authentication required'
            });
            return;
        }

        if (!category || !amount || amount <= 0 || !title?.trim()) {
            res.status(400).json({
                success: false,
                message: 'Category, amount, and title are required'
            });
            return;
        }

        const validCategories = ['food', 'transport', 'housing', 'utilities', 'healthcare', 'entertainment', 'shopping', 'education', 'travel', 'other'];
        if (!validCategories.includes(category)) {
            res.status(400).json({
                success: false,
                message: 'Invalid category'
            });
            return;
        }

        const expenseDate = date ? new Date(date) : new Date();

        // Find active budget for this category
        const budget = await Budget.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            category,
            isActive: true,
            startDate: { $lte: expenseDate },
            endDate: { $gte: expenseDate }
        });

        let budgetWarning = null;
        let budgetInfo = null;

        if (budget) {
            const currentSpent = budget.currentAmount;
            const newTotal = currentSpent + amount;

            budgetInfo = {
                budgetAmount: budget.budgetAmount,
                currentSpent: currentSpent,
                newTotal: newTotal,
                remainingAfter: budget.budgetAmount - newTotal
            };

            if (newTotal > budget.budgetAmount) {
                budgetWarning = {
                    message: `This expense will exceed your ${category} budget`,
                    budgetAmount: budget.budgetAmount,
                    currentSpent: currentSpent,
                    newTotal: newTotal,
                    overage: newTotal - budget.budgetAmount
                };
            }
        }

        // Create expense
        const expenseData = {
            title: title.trim(),
            category,
            amount,
            date: expenseDate,
            userId: new mongoose.Types.ObjectId(userId),
            description: description?.trim() || undefined
        };

        const expense = await Expense.create(expenseData);

        // Update budget current amount if budget exists
        let updatedBudget = null;
        if (budget) {
            try {
                updatedBudget = await Budget.updateCurrentAmount(
                    new mongoose.Types.ObjectId(userId), 
                    category, 
                    amount, 
                    expenseDate
                );
            } catch (budgetError) {
                console.error('Error updating budget amount:', budgetError);
                // Continue execution even if budget update fails
            }
        }

        res.status(201).json({
            success: true,
            message: 'Expense added successfully',
            data: {
                expense,
                budgetInfo,
                budgetWarning,
                budgetUpdated: !!updatedBudget,
                updatedBudget: updatedBudget ? {
                    id: updatedBudget._id,
                    category: updatedBudget.category,
                    currentAmount: updatedBudget.currentAmount,
                    budgetAmount: updatedBudget.budgetAmount,
                    remainingAmount: updatedBudget.budgetAmount - updatedBudget.currentAmount,
                    percentageUsed: (updatedBudget.currentAmount / updatedBudget.budgetAmount) * 100,
                    isExceeded: updatedBudget.currentAmount > updatedBudget.budgetAmount
                } : null
            }
        });

    } catch (error) {
        console.error('Add expense error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export { addExpense, addExpenseWithBudgetCheck };