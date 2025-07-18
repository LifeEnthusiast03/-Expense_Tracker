import mongoose, { Document, Schema } from "mongoose";

interface IGoal extends Document {
    name: string;
    description?: string;
    targetAmount: number;
    currentAmount: number;
    priority: 'low' | 'medium' | 'high';
    targetDate: Date;
    isCompleted: boolean;
    userId: mongoose.Types.ObjectId;
    goalCredit?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const goalSchema = new Schema<IGoal>({
    name: {
        type: String,
        required: [true, 'Goal name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [300, 'Description cannot exceed 300 characters']
    },
    targetAmount: {
        type: Number,
        required: [true, 'Target amount is required'],
        min: [1, 'Target amount must be greater than 0'],
        max: [9999999.99, 'Target amount cannot exceed 9,999,999.99']
    },
    currentAmount: {
        type: Number,
        required: [true, 'Current amount is required'],
        default: 0,
        min: [0, 'Current amount cannot be negative']
    },
    priority: {
        type: String,
        required: [true, 'Priority is required'],
        enum: {
            values: ['low', 'medium', 'high'],
            message: 'Priority must be low, medium, or high'
        },
        default: 'medium'
    },
    targetDate: {
        type: Date,
        required: [true, 'Target date is required']
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    goalCredit: {
        type: Schema.Types.ObjectId,
        ref: 'GoalCredit'
    }
}, {
    timestamps: true
});

// Indexes for better query performance
goalSchema.index({ userId: 1, isCompleted: 1 });
goalSchema.index({ userId: 1, priority: 1 });
goalSchema.index({ userId: 1, targetDate: 1 });

// // Virtual for progress percentage
// goalSchema.virtual('progressPercentage').get(function() {
//     return Math.round((this.currentAmount / this.targetAmount) * 100 * 100) / 100;
// });

// // Virtual for remaining amount
// goalSchema.virtual('remainingAmount').get(function() {
//     return this.targetAmount - this.currentAmount;
// });

// // Virtual for days remaining
// goalSchema.virtual('daysRemaining').get(function() {
//     const today = new Date();
//     const timeDiff = this.targetDate.getTime() - today.getTime();
//     return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
// });

// // Method to add money to goal
// goalSchema.methods.addAmount = async function(amount: number) {
//     if (amount <= 0) {
//         throw new Error('Amount must be greater than 0');
//     }
    
//     this.currentAmount += amount;
    
//     // Check if goal is completed
//     if (this.currentAmount >= this.targetAmount) {
//         this.currentAmount = this.targetAmount;
//         this.isCompleted = true;
//     }
    
//     return await this.save();
// };

// // Method to update current amount directly
// goalSchema.methods.updateAmount = async function(newAmount: number) {
//     if (newAmount < 0) {
//         throw new Error('Amount cannot be negative');
//     }
    
//     this.currentAmount = newAmount;
    
//     // Check if goal is completed
//     this.isCompleted = this.currentAmount >= this.targetAmount;
    
//     return await this.save();
// };

// // Static method to get active goals
// goalSchema.statics.getActiveGoals = async function(userId: mongoose.Types.ObjectId) {
//     return await this.find({ userId, isCompleted: false }).sort({ priority: -1, targetDate: 1 });
// };

// // Static method to get completed goals
// goalSchema.statics.getCompletedGoals = async function(userId: mongoose.Types.ObjectId) {
//     return await this.find({ userId, isCompleted: true }).sort({ updatedAt: -1 });
// };

// // Static method to get goals by priority
// goalSchema.statics.getGoalsByPriority = async function(userId: mongoose.Types.ObjectId, priority: string) {
//     return await this.find({ userId, priority, isCompleted: false }).sort({ targetDate: 1 });
// };

const Goal = mongoose.model<IGoal>('Goal', goalSchema);

export default Goal;