import mongoose ,{Document,Schema} from "mongoose";
import bcrypt from 'bcrypt';

interface User extends Document{
    username:string,
    email:string,
    password:string,
    createdAt:Date,
    updatedAt:Date
}

const userSchema = new Schema<User>({
   username:{
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters']
    },
    email:{
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password:{
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
    }
},{
    timestamps:true
});


userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    if(error){
    next(error as Error);
    }
  }
});
userSchema.methods.comparePassword = async function(candidatePassword:string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model<User>('User',userSchema);

export default User;