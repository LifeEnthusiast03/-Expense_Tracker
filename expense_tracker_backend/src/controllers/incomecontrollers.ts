import Income from "../models/incomemodel";
import Goal from "../models/goalmodel";
import mongoose from "mongoose";
import {Response} from "express";
import { IncomeRequestFormat } from "../types/incometype";
import {validateUserId, 
        validateGoalId, 
        validateIncomeId, 
        validateAddIncomeData,
        sanitizeAddIncomeData } from '../validator/incomevalidator'

const addIncome = async (req: IncomeRequestFormat, res: Response): Promise<void> => {
    try {
        const userId = validateUserId(req.user?.userId);
        if (!userId) {
            res.status(400).json({
                success: false,
                message: 'Invalid or missing user ID'
            });
            return;
        }

        // Validate request data (includes goal validation)
        const validation = validateAddIncomeData(req.body);
        if (!validation.isValid) {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            });
            return;
        }

        // Sanitize data
        const sanitizedData = sanitizeAddIncomeData(req.body);

        // Handle goal-related operations
        let goalData = null;
        if (sanitizedData.addToGoal === true) {
            // Additional goal validation (already validated in validateAddIncomeData)
            const goalIdValidation = validateGoalId(sanitizedData.goalId);
            if (!goalIdValidation.isValid) {
                res.status(400).json({
                    success: false,
                    message: 'Goal validation failed',
                    errors: goalIdValidation.errors
                });
                return;
            }

            goalData = {
                goalId: goalIdValidation.goalId!,
                goalAmount: sanitizedData.goalAmount!
            };
        }

        // Start transaction for atomic operations
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Create income record
            const newIncome = new Income({
                title: sanitizedData.title,
                category: sanitizedData.category,
                amount: sanitizedData.amount,
                date: sanitizedData.date,
                userId: userId,
                description: sanitizedData.description
            });

            const savedIncome = await newIncome.save({ session });
            
            
            const incomeId = savedIncome._id as mongoose.Types.ObjectId;

            let updatedGoal = null;
            // Handle goal association if specified
            if (goalData) {
                // Find the goal and verify it belongs to the user AND is not completed
                const goal = await Goal.findOne({
                    _id: goalData.goalId,
                    userId: userId,
                    isCompleted: false
                }).session(session);

                if (!goal) {
                    throw new Error('Goal not found, already completed, or does not belong to user');
                }

                // Additional business logic validation
                const potentialTotal = goal.currentAmount + goalData.goalAmount;
                if (potentialTotal > goal.targetAmount) {
                    throw new Error(`Adding ${goalData.goalAmount} would exceed goal target. Maximum you can add: ${goal.targetAmount - goal.currentAmount}`);
                }

                // Prevent duplicate income sources (optional business rule)
                const existingSource = goal.incomeSources?.find(
                    source => source.incomeId.toString() === incomeId.toString()
                );
                if (existingSource) {
                    throw new Error('This income is already associated with the goal');
                }

                // Add income source to goal
                goal.incomeSources = goal.incomeSources || [];
                goal.incomeSources.push({
                    incomeId: incomeId,
                    amount: goalData.goalAmount
                });

                // Update goal's current amount
                updatedGoal = await goal.addAmount(goalData.goalAmount);
            }

            await session.commitTransaction();

            res.status(201).json({
                success: true,
                data: {
                    income: savedIncome,
                    goalUpdated: !!updatedGoal,
                    goalInfo: updatedGoal ? {
                        goalId: updatedGoal._id,
                        goalName: updatedGoal.name,
                        addedAmount: goalData?.goalAmount,
                        currentAmount: updatedGoal.currentAmount,
                        targetAmount: updatedGoal.targetAmount,
                        progressPercentage: updatedGoal.progressPercentage,
                        isCompleted: updatedGoal.isCompleted
                    } : null
                },
                message: updatedGoal ? 'Income added and goal updated successfully' : 'Income added successfully'
            });

        } catch (transactionError) {
            await session.abortTransaction();
            throw transactionError;
        } finally {
            session.endSession();
        }

    } catch (error) {
        console.error('Add income error:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Internal server error'
        });
    }
};
const getUserIncome = async (req: IncomeRequestFormat, res: Response): Promise<void> => {
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
        console.error('Get income error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
const deleteIncome = async (req: IncomeRequestFormat, res: Response): Promise<void> => {
    try {
        const userId = validateUserId(req.user?.userId);
        if (!userId) {
            res.status(400).json({
                success: false,
                message: 'Invalid or missing user ID'
            });
            return;
        }

        // Validate income ID
        const validation = validateIncomeId(req.params.id);
        if (!validation.isValid) {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            });
            return;
        }

        const incomeId = validation.incomeId!;

        // Start transaction for atomic operations
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Find the income record and verify ownership
            const income = await Income.findOne({
                _id: incomeId,
                userId: userId
            }).session(session);

            if (!income) {
                res.status(404).json({
                    success: false,
                    message: 'Income record not found or does not belong to user'
                });
                return;
            }

            // Find goals that have this income as a source
            const goalsWithThisIncome = await Goal.find({
                userId: userId,
                'incomeSources.incomeId': incomeId
            }).session(session);

            // Update goals by removing the income source and adjusting amounts
            for (const goal of goalsWithThisIncome) {
                // Find the income source in the goal
                const incomeSource = goal.incomeSources?.find(
                    source => source.incomeId.toString() === incomeId.toString()
                );

                if (incomeSource) {
                    // Remove the amount from goal's current amount
                    const newCurrentAmount = Math.max(0, goal.currentAmount - incomeSource.amount);
                    
                    // Update goal
                    await goal.updateAmount(newCurrentAmount);

                    // Remove the income source from the array
                    goal.incomeSources = goal.incomeSources?.filter(
                        source => source.incomeId.toString() !== incomeId.toString()
                    ) || [];

                    await goal.save({ session });
                }
            }

            // Delete the income record
            await Income.findByIdAndDelete(incomeId).session(session);

            await session.commitTransaction();

            res.status(200).json({
                success: true,
                message: 'Income deleted successfully',
                data: {
                    deletedIncome: income,
                    updatedGoalsCount: goalsWithThisIncome.length
                }
            });

        } catch (transactionError) {
            await session.abortTransaction();
            throw transactionError;
        } finally {
            session.endSession();
        }

    } catch (error) {
        console.error('Delete income error:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Internal server error'
        });
    }
};

export { addIncome, getUserIncome, deleteIncome };