import { Request } from "express";
export interface ExpenseRequestFormat extends Request {
    user: {
        userId: string;
        email: string;
    };
    body: {
        category: string; 
        amount: number;   
        title: string;
        description?: string; 
        date?: Date | string;    
    };
}