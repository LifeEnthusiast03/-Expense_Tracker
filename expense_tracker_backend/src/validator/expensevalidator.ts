
import mongoose from 'mongoose'

export const validateUserId = (userIdString: string | undefined): mongoose.Types.ObjectId | null => {
    if (!userIdString || !mongoose.Types.ObjectId.isValid(userIdString)) {
        return null;
    }
    return new mongoose.Types.ObjectId(userIdString);
};

export const validateExpenseId = (expenseIdString: string | undefined): mongoose.Types.ObjectId | null => {
    if (!expenseIdString || !mongoose.Types.ObjectId.isValid(expenseIdString)) {
        return null;
    }
    return new mongoose.Types.ObjectId(expenseIdString);
};

export const validateExpenseData = (data: any): string[] => {
    const errors: string[] = [];
    
    if (!data.category) {
        errors.push('Category is required');
    }
    
    if (!data.amount || data.amount <= 0) {
        errors.push('Valid amount is required');
    }
    
    if (!data.title || data.title.trim().length === 0) {
        errors.push('Title is required');
    }
    
    const validCategories = ['food', 'transport', 'housing', 'utilities', 'healthcare', 'entertainment', 'shopping', 'education', 'travel', 'other'];
    if (data.category && !validCategories.includes(data.category)) {
        errors.push('Invalid category');
    }
    
    return errors;
};