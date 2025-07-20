import mongoose, { Document, Schema, Model } from "mongoose";

interface IBudget extends Document {
    title: string;
    category: string;
    budgetAmount: number;
    currentAmount: number; // New field to track current spending
    period: 'weekly' | 'monthly' | 'yearly';
    startDate: Date;
    endDate: Date;
    userId: mongoose.Types.ObjectId;
    isActive: boolean;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    // Instance methods
    isExceeded(): boolean;
    isCurrent(): boolean;
}

interface IBudgetModel extends Model<IBudget> {
    // Static methods
    updateCurrentAmount(
        userId: mongoose.Types.ObjectId, 
        category: string, 
        amount: number, 
        expenseDate: Date
    ): Promise<IBudget | null>;
    
    recalculateCurrentAmount(
        budgetId: mongoose.Types.ObjectId
    ): Promise<IBudget | null>;
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
    currentAmount: {
        type: Number,
        default: 0,
        min: [0, 'Current amount cannot be negative'],
        max: [999999.99, 'Current amount cannot exceed 999,999.99']
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

// Virtual field to get remaining amount
budgetSchema.virtual('remainingAmount').get(function() {
    return this.budgetAmount - this.currentAmount;
});

// Virtual field to get percentage used
budgetSchema.virtual('percentageUsed').get(function() {
    return (this.currentAmount / this.budgetAmount) * 100;
});

// Method to check if budget is exceeded
budgetSchema.methods.isExceeded = function() {
    return this.currentAmount > this.budgetAmount;
};

// Method to check if budget is current (within date range)
budgetSchema.methods.isCurrent = function() {
    const now = new Date();
    return now >= this.startDate && now <= this.endDate;
};

// Static method to update budget amount when expense is added
budgetSchema.statics.updateCurrentAmount = async function(userId: mongoose.Types.ObjectId, category: string, amount: number, expenseDate: Date) {
    try {
        const budget = await this.findOne({
            userId,
            category,
            isActive: true,
            startDate: { $lte: expenseDate },
            endDate: { $gte: expenseDate }
        });

        if (budget) {
            budget.currentAmount += amount;
            await budget.save();
            return budget;
        }
        return null;
    } catch (error) {
        console.error('Error updating budget current amount:', error);
        throw error;
    }
};

// Static method to recalculate current amount for a budget
budgetSchema.statics.recalculateCurrentAmount = async function(budgetId: mongoose.Types.ObjectId) {
    try {
        const budget = await this.findById(budgetId);
        if (!budget) return null;

        const Expense = mongoose.model('Expense');
        
        const result = await Expense.aggregate([
            {
                $match: {
                    userId: budget.userId,
                    category: budget.category,
                    date: {
                        $gte: budget.startDate,
                        $lte: budget.endDate
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSpent: { $sum: '$amount' }
                }
            }
        ]);

        budget.currentAmount = result[0]?.totalSpent || 0;
        await budget.save();
        return budget;
    } catch (error) {
        console.error('Error recalculating budget current amount:', error);
        throw error;
    }
};

const Budget = mongoose.model<IBudget, IBudgetModel>('Budget', budgetSchema);

export default Budget;