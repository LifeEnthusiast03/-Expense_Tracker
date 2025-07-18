import mongoose, { Document, Schema } from "mongoose";

interface IGoalCredit extends Document {
    userId: mongoose.Types.ObjectId;
    amount: number;
    transactions: Array<{
        category: string;
        amount: number;
        addedAt: Date;
        incomeId?: mongoose.Types.ObjectId;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

const goalCreditSchema = new Schema<IGoalCredit>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        unique: true // Each user has only one goal credit account
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        default: 0,
        min: [0, 'Amount cannot be negative']
    },
    transactions: [{
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: ['salary', 'freelance', 'business', 'investment', 'rental', 'gift', 'bonus', 'other']
        },
        amount: {
            type: Number,
            required: [true, 'Transaction amount is required'],
            min: [0.01, 'Amount must be greater than 0']
        },
        addedAt: {
            type: Date,
            required: [true, 'Added time is required'],
            default: Date.now
        },
        incomeId: {
            type: Schema.Types.ObjectId,
            ref: 'Income'
        }
    }]
}, {
    timestamps: true
});

// // Index for better query performance
// goalCreditSchema.index({ userId: 1 });

// // Method to add credit amount with tracking
// goalCreditSchema.methods.addCredit = async function(amount: number, category: string, incomeId?: mongoose.Types.ObjectId) {
//     if (amount <= 0) {
//         throw new Error('Amount must be greater than 0');
//     }
    
//     if (!category) {
//         throw new Error('Category is required');
//     }
    
//     // Add to total amount
//     this.amount += amount;
    
//     // Add transaction record
//     this.transactions.push({
//         category,
//         amount,
//         addedAt: new Date(),
//         incomeId
//     });
    
//     return await this.save();
// };

// // Method to deduct credit amount (when transferring to goal)
// goalCreditSchema.methods.deductCredit = async function(amount: number) {
//     if (amount <= 0) {
//         throw new Error('Amount must be greater than 0');
//     }
    
//     if (amount > this.amount) {
//         throw new Error('Insufficient credit balance');
//     }
    
//     this.amount -= amount;
//     return await this.save();
// };

// // Method to get transactions by category
// goalCreditSchema.methods.getTransactionsByCategory = function(category?: string) {
//     if (category) {
//         return this.transactions.filter(t => t.category === category);
//     }
//     return this.transactions;
// };

// // Method to get total amount by category
// goalCreditSchema.methods.getTotalByCategory = function(category: string) {
//     return this.transactions
//         .filter(t => t.category === category)
//         .reduce((sum, t) => sum + t.amount, 0);
// };

// // Method to get category breakdown
// goalCreditSchema.methods.getCategoryBreakdown = function() {
//     const breakdown: { [key: string]: { count: number, total: number } } = {};
    
//     this.transactions.forEach(transaction => {
//         if (!breakdown[transaction.category]) {
//             breakdown[transaction.category] = { count: 0, total: 0 };
//         }
//         breakdown[transaction.category].count++;
//         breakdown[transaction.category].total += transaction.amount;
//     });
    
//     return breakdown;
// };

// // Static method to get or create goal credit for user
// goalCreditSchema.statics.getOrCreateGoalCredit = async function(userId: mongoose.Types.ObjectId) {
//     let goalCredit = await this.findOne({ userId });
    
//     if (!goalCredit) {
//         goalCredit = await this.create({ userId, amount: 0, transactions: [] });
//     }
    
//     return goalCredit;
// };

const GoalCredit = mongoose.model<IGoalCredit>('GoalCredit', goalCreditSchema);

export default GoalCredit;