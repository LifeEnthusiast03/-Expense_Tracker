import { Response } from "express";
import Expense from "../models/expensemodel";
import Budget from "../models/budgetmodel";
import mongoose from "mongoose";
import { ExpenseRequestFormat } from "../types/expensetype";
import {validateUserId,validateExpenseId,validateExpenseData} from '../validator/expensevalidator'


// Get user expenses
const getUserExpense = async (req: ExpenseRequestFormat, res: Response): Promise<void> => { 
    try {
        const userId = validateUserId(req.user?.userId);
        if (!userId) {
            res.status(400).json({
                success: false,
                message: 'Invalid or missing user ID'
            });
            return;
        }

        const expenses = await Expense.find({ userId })
            .sort({ date: -1 }) 
            .select('-__v');
        
        res.status(200).json({
            success: true, 
            data: expenses,
            count: expenses.length,
            message: expenses.length === 0 ? 'No expenses found' : undefined
        });
    } catch (error) {
        console.error('Expense data Error', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
    }
};

// Get expenses with pagination and filtering
const getExpenses = async (req: ExpenseRequestFormat, res: Response): Promise<void> => {
    try {
        const userId = validateUserId(req.user?.userId);
        if (!userId) {
            res.status(400).json({
                success: false,
                message: 'Invalid or missing user ID'
            });
            return;
        }

        const { page = 1, limit = 10, category, startDate, endDate } = req.query;

        // Build query
        const query: any = { userId };
        
        if (category) {
            query.category = category;
        }
        
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate as string);
            if (endDate) query.date.$lte = new Date(endDate as string);
        }

        const skip = (Number(page) - 1) * Number(limit);
        
        const [expenses, total] = await Promise.all([
            Expense.find(query)
                .sort({ date: -1 })
                .skip(skip)
                .limit(Number(limit))
                .select('-__v'),
            Expense.countDocuments(query)
        ]);

        res.status(200).json({
            success: true,
            data: expenses,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / Number(limit)),
                totalItems: total,
                itemsPerPage: Number(limit)
            },
            message: expenses.length === 0 ? 'No expenses found' : undefined
        });

    } catch (error) {
        console.error('Get expenses error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Add expense
const addExpense = async (req: ExpenseRequestFormat, res: Response): Promise<void> => {
    try {
        const userId = validateUserId(req.user?.userId);
        if (!userId) {
            res.status(400).json({
                success: false,
                message: 'Invalid or missing user ID'
            });
            return;
        }

        const { category, amount, title, description, date } = req.body;

        
        const validationErrors = validateExpenseData(req.body);
        if (validationErrors.length > 0) {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            });
            return;
        }

        const expenseDate = date ? new Date(date) : new Date();
        
        
        if (isNaN(expenseDate.getTime())) {
            res.status(400).json({
                success: false,
                message: 'Invalid date format'
            });
            return;
        }

        const expenseData = {
            title: title.trim(),
            category, 
            amount,
            date: expenseDate,
            userId: userId,
            description: description?.trim() || undefined
        };

        
        const expense = await Expense.create(expenseData);

        // Update budget current amount if budget exists
        let updatedBudget = null;
        try {
            updatedBudget = await Budget.updateCurrentAmount(
                userId, 
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
                expense: {
                    _id: expense._id,
                    title: expense.title,
                    category: expense.category,
                    amount: expense.amount,
                    date: expense.date,
                    description: expense.description,
                    createdAt: expense.createdAt,
                    updatedAt: expense.updatedAt
                },
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
        
        // Handle specific mongoose validation errors
        if (error instanceof mongoose.Error.ValidationError) {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            });
            return;
        }
        
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Add expense with budget check
const addExpenseWithBudgetCheck = async (req: ExpenseRequestFormat, res: Response): Promise<void> => {
    try {
        const userId = validateUserId(req.user?.userId);
        if (!userId) {
            res.status(400).json({
                success: false,
                message: 'Invalid or missing user ID'
            });
            return;
        }

        const { category, amount, title, description, date } = req.body;


        const validationErrors = validateExpenseData(req.body);
        if (validationErrors.length > 0) {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            });
            return;
        }

        const expenseDate = date ? new Date(date) : new Date();
        

        if (isNaN(expenseDate.getTime())) {
            res.status(400).json({
                success: false,
                message: 'Invalid date format'
            });
            return;
        }

        // Find active budget for this category
        const budget = await Budget.findOne({
            userId: userId,
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
            userId: userId,
            description: description?.trim() || undefined
        };

        const expense = await Expense.create(expenseData);

        // Update budget current amount if budget exists
        let updatedBudget = null;
        if (budget) {
            try {
                updatedBudget = await Budget.updateCurrentAmount(
                    userId, 
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
                expense: {
                    _id: expense._id,
                    title: expense.title,
                    category: expense.category,
                    amount: expense.amount,
                    date: expense.date,
                    description: expense.description,
                    createdAt: expense.createdAt,
                    updatedAt: expense.updatedAt
                },
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
        
        // Handle specific mongoose validation errors
        if (error instanceof mongoose.Error.ValidationError) {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            });
            return;
        }
        
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Delete expense
const deleteExpense = async (req: ExpenseRequestFormat, res: Response): Promise<void> => {
    try {
        const userId = validateUserId(req.user?.userId);
        if (!userId) {
            res.status(400).json({
                success: false,
                message: 'Invalid or missing user ID'
            });
            return;
        }

        const expenseId = validateExpenseId(req.params.id);
        if (!expenseId) {
            res.status(400).json({
                success: false,
                message: 'Invalid or missing expense ID'
            });
            return;
        }

        // Find and delete the expense
        const deletedExpense = await Expense.findOneAndDelete({
            _id: expenseId,
            userId: userId
        }).select('-__v');

        if (!deletedExpense) {
            res.status(404).json({
                success: false,
                message: 'Expense not found or you do not have permission to delete it'
            });
            return;
        }

        // Update budget by subtracting the deleted expense amount
        try {
            await Budget.updateCurrentAmount(
                userId,
                deletedExpense.category,
                -deletedExpense.amount,
                deletedExpense.date
            );
        } catch (budgetError) {
            console.error('Budget update error after expense deletion:', budgetError);
            // Continue execution even if budget update fails
        }

        res.status(200).json({
            success: true,
            message: 'Expense deleted successfully',
            data: deletedExpense
        });

    } catch (error) {
        console.error('Delete expense error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


export {
    getUserExpense, 
    getExpenses,
    addExpense, 
    addExpenseWithBudgetCheck,
    deleteExpense
};