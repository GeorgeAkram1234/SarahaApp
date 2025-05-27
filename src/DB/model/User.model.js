import mongoose, { model, Schema } from "mongoose";
import { roleTypes } from "../../middleware/auth.middleware.js";

const userSchema = new Schema({
    userName: {
        type: String,
        required: [true, 'please enter your usersName'],
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        default: 'male'
    },
    confirmEmail: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: Object.values(roleTypes),
        default: roleTypes.User
    },
    phone: String,
    image: String,
    DOB: Date,
    changePasswordTime: Date,
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

const userModel = mongoose.models.User || model("User", userSchema)
export default userModel