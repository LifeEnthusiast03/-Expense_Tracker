
import { Request } from "express";

// Validation result interface
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

// Interface for add income validation
export interface AddIncomeData {
    title: string;
    category: string;
    amount: number;
    date?: Date;
    description?: string;
    addToGoal?: boolean;
    goalAmount?: number;
    goalId?: string; 
}

// Valid income categories
export const VALID_INCOME_CATEGORIES = [
    'salary', 'freelance', 'business', 'investment', 
    'rental', 'gift', 'bonus', 'other'
];

 export interface IncomeRequestFormat extends Request {
    user: {
        userId: string;
        email: string;
    };
    body:AddIncomeData;
    params: {
        id?: string;
    };
}