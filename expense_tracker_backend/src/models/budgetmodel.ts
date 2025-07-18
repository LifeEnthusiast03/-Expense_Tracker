import mongoose, { Document, Schema } from "mongoose";

interface IBudget extends Document {
    title: string;
    category: string;
    budgetAmount: number;
    period: 'weekly' | 'monthly' | 'yearly';
    startDate: Date;
    endDate: Date;
    userId: mongoose.Types.ObjectId;
    isActive: boolean;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const budgetSchema = new Schema<IBudget>({
    title: {
        type: String,
        required: [true, 'Budget title is required'],
        trim: true,
        minlength: [2, 'Title must be at least 2 characters'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: ['food', 'transport', 'housing', 'utilities', 'healthcare', 'entertainment', 'shopping', 'education', 'travel', 'total', 'other'],
            message: 'Please select a valid category'
        }
    },
    budgetAmount: {
        type: Number,
        required: [true, 'Budget amount is required'],
        min: [0.01, 'Budget amount must be greater than 0'],
        max: [999999.99, 'Budget amount cannot exceed 999,999.99']
    },
    period: {
        type: String,
        required: [true, 'Budget period is required'],
        enum: {
            values: ['weekly', 'monthly', 'yearly'],
            message: 'Period must be weekly, monthly, or yearly'
        }
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: [200, 'Description cannot exceed 200 characters']
    }
}, {
    timestamps: true
});

// Compound index to prevent duplicate budgets for same category and period
budgetSchema.index({ userId: 1, category: 1, period: 1, startDate: 1 }, { unique: true });

// // Index for better query performance
// budgetSchema.index({ userId: 1, isActive: 1 });
// budgetSchema.index({ userId: 1, period: 1 });

// // Method to check if budget is current (within date range)
// budgetSchema.methods.isCurrent = function() {
//     const now = new Date();
//     return now >= this.startDate && now <= this.endDate;
// };

// // Method to get spent amount for this budget
// budgetSchema.methods.getSpentAmount = async function() {
//     const Expense = mongoose.model('Expense');
    
//     const result = await Expense.aggregate([
//         {
//             $match: {
//                 userId: this.userId,
//                 category: this.category === 'total' ? { $exists: true } : this.category,
//                 date: {
//                     $gte: this.startDate,
//                     $lte: this.endDate
//                 }
//             }
//         },
//         {
//             $group: {
//                 _id: null,
//                 totalSpent: { $sum: '$amount' }
//             }
//         }
//     ]);
    
//     return result[0]?.totalSpent || 0;
// };

// // Method to get remaining budget
// budgetSchema.methods.getRemainingAmount = async function() {
//     const spentAmount = await this.getSpentAmount();
//     return this.budgetAmount - spentAmount;
// };

// // Static method to get all active budgets for a user
// budgetSchema.statics.getActiveBudgets = async function(userId: mongoose.Types.ObjectId) {
//     const now = new Date();
//     return await this.find({
//         userId,
//         isActive: true,
//         startDate: { $lte: now },
//         endDate: { $gte: now }
//     });
// };

// // Static method to create monthly budget
// budgetSchema.statics.createMonthlyBudget = async function(userId: mongoose.Types.ObjectId, category: string, amount: number, title: string, year: number, month: number) {
//     const startDate = new Date(year, month - 1, 1);
//     const endDate = new Date(year, month, 0); // Last day of month
    
//     return await this.create({
//         title,
//         category,
//         budgetAmount: amount,
//         period: 'monthly',
//         startDate,
//         endDate,
//         userId
//     });
// };

// // Static method to create weekly budget
// budgetSchema.statics.createWeeklyBudget = async function(userId: mongoose.Types.ObjectId, category: string, amount: number, title: string, weekStartDate: Date) {
//     const endDate = new Date(weekStartDate);
//     endDate.setDate(endDate.getDate() + 6); // 7 days total
    
//     return await this.create({
//         title,
//         category,
//         budgetAmount: amount,
//         period: 'weekly',
//         startDate: weekStartDate,
//         endDate,
//         userId
//     });
// };

// // Static method to create yearly budget
// budgetSchema.statics.createYearlyBudget = async function(userId: mongoose.Types.ObjectId, category: string, amount: number, title: string, year: number) {
//     const startDate = new Date(year, 0, 1); // January 1st
//     const endDate = new Date(year, 11, 31); // December 31st
    
//     return await this.create({
//         title,
//         category,
//         budgetAmount: amount,
//         period: 'yearly',
//         startDate,
//         endDate,
//         userId
//     });
// };

const Budget = mongoose.model<IBudget>('Budget', budgetSchema);

export default Budget;