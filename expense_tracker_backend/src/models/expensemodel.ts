import mongoose, { Document, Schema } from "mongoose";

interface IExpense extends Document {
    title: string;
    category: string;
    amount: number;
    date: Date;
    userId: mongoose.Types.ObjectId;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>({
    title: {
        type: String,
        required: [true, 'Expense title is required'],
        trim: true,
        minlength: [2, 'Title must be at least 2 characters'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: ['food', 'transport', 'housing', 'utilities', 'healthcare', 'entertainment', 'shopping', 'education', 'travel', 'other'],
            message: 'Please select a valid category'
        }
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0.01, 'Amount must be greater than 0'],
        max: [999999.99, 'Amount cannot exceed 999,999.99']
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
        default: Date.now
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [200, 'Description cannot exceed 200 characters']
    }
}, {
    timestamps: true
});

// Index for better query performance
expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1 });

const Expense = mongoose.model<IExpense>('Expense', expenseSchema);

export default Expense;