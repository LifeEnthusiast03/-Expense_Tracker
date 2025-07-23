import mongoose from 'mongoose'
import {ValidationResult,AddIncomeData,VALID_INCOME_CATEGORIES} from '../types/incometype'



export const validateUserId = (userIdString: string | undefined): mongoose.Types.ObjectId | null => {
    if (!userIdString || !mongoose.Types.ObjectId.isValid(userIdString)) {
        return null;
    }
    return new mongoose.Types.ObjectId(userIdString);
};


export const validateGoalId = (goalIdString: string | undefined): ValidationResult & { goalId?: mongoose.Types.ObjectId } => {
    const errors: string[] = [];

    if (!goalIdString) {
        errors.push('Goal ID is required');
        return { isValid: false, errors };
    }

    if (!mongoose.Types.ObjectId.isValid(goalIdString)) {
        errors.push('Invalid goal ID format');
        return { isValid: false, errors };
    }

    return {
        isValid: true,
        errors: [],
        goalId: new mongoose.Types.ObjectId(goalIdString)
    };
};


export const validateIncomeId = (incomeIdString: string | undefined): ValidationResult & { incomeId?: mongoose.Types.ObjectId } => {
    const errors: string[] = [];

    if (!incomeIdString) {
        errors.push('Income ID is required');
        return { isValid: false, errors };
    }

    if (!mongoose.Types.ObjectId.isValid(incomeIdString)) {
        errors.push('Invalid income ID format');
        return { isValid: false, errors };
    }

    return {
        isValid: true,
        errors: [],
        incomeId: new mongoose.Types.ObjectId(incomeIdString)
    };
};


export const validateAddIncomeData = (data: AddIncomeData): ValidationResult => {
    const errors: string[] = [];

    // Validate title
    if (!data.title) {
        errors.push('Title is required');
    } else {
        const trimmedTitle = data.title.toString().trim();
        if (trimmedTitle.length < 2) {
            errors.push('Title must be at least 2 characters long');
        }
        if (trimmedTitle.length > 100) {
            errors.push('Title cannot exceed 100 characters');
        }
    }

    // Validate category
    if (!data.category) {
        errors.push('Category is required');
    } else if (!VALID_INCOME_CATEGORIES.includes(data.category)) {
        errors.push(`Invalid category. Must be one of: ${VALID_INCOME_CATEGORIES.join(', ')}`);
    }

    // Validate amount
    if (data.amount === undefined || data.amount === null) {
        errors.push('Amount is required');
    } else {
        const amount = Number(data.amount);
        if (isNaN(amount)) {
            errors.push('Amount must be a valid number');
        } else if (amount <= 0) {
            errors.push('Amount must be greater than 0');
        } else if (amount > 999999.99) {
            errors.push('Amount cannot exceed 999,999.99');
        }
    }

    // Validate date (optional)
    if (data.date) {
        const date = new Date(data.date);
        if (isNaN(date.getTime())) {
            errors.push('Invalid date format');
        } else if (date > new Date()) {
            errors.push('Date cannot be in the future');
        }
    }

    // Validate description (optional)
    if (data.description && data.description.trim().length > 200) {
        errors.push('Description cannot exceed 200 characters');
    }

    // Enhanced goal-related validation
    if (data.addToGoal === true) {
        // Validate goal ID is provided
        if (!data.goalId) {
            errors.push('Goal ID is required when adding to goal');
        } else {
            // Validate goal ID format
            const goalValidation = validateGoalId(data.goalId);
            if (!goalValidation.isValid) {
                errors.push(...goalValidation.errors);
            }
        }

        // Validate goal amount
        if (data.goalAmount === undefined || data.goalAmount === null) {
            errors.push('Goal amount is required when adding to goal');
        } else {
            const goalAmount = Number(data.goalAmount);
            if (isNaN(goalAmount)) {
                errors.push('Goal amount must be a valid number');
            } else if (goalAmount <= 0) {
                errors.push('Goal amount must be greater than 0');
            } else if (data.amount && goalAmount > Number(data.amount)) {
                errors.push('Goal amount cannot exceed the income amount');
            }
        }
    } else if (data.addToGoal === false) {
        // If explicitly set to false, ensure no goal-related data is provided
        if (data.goalId) {
            errors.push('Goal ID should not be provided when not adding to goal');
        }
        if (data.goalAmount) {
            errors.push('Goal amount should not be provided when not adding to goal');
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};


export const sanitizeAddIncomeData = (data: AddIncomeData) => {
    return {
        title: data.title.toString().trim(),
        category: data.category,
        amount: Number(data.amount),
        date: data.date ? new Date(data.date) : new Date(),
        description: data.description ? data.description.toString().trim() : undefined,
        addToGoal: Boolean(data.addToGoal),
        goalAmount: data.goalAmount ? Number(data.goalAmount) : undefined,
        goalId: data.goalId ? data.goalId.toString().trim() : undefined
    };
};