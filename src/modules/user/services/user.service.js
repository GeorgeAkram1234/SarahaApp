import messageModel from "../../../DB/model/Message.model.js"
import userModel from "../../../DB/model/User.model.js"
import { asyncHandler } from "../../../utils/error/error.handler.js"
import { generateDecryption } from "../../../utils/security/encryption.js"
import { compareHash, generateHash } from "../../../utils/security/hash.js"
import { successResponse } from "../../../utils/successResponse/success.response.js"

export const profile = asyncHandler(
    async (req, res, next) => {

        req.user.phone = generateDecryption({ cipherText: req.user.phone })
        const messages = await messageModel.find({ recipientId: req.user._id }).populate([{
            path : "recipientId",
            select : "-password"
        }])
        return successResponse({ res, message: "user Profile", data: { user: req.user, messages } })
    }
)

export const updateProfile = asyncHandler(
    async (req, res, next) => {
        const user = await userModel.findByIdAndUpdate(req.user._id, req.body,
            { new: true, runValidators: true })
        return successResponse({ res, message: "updated Profile", data: { user } })
    }
)

export const updatePassword = asyncHandler(
    async (req, res, next) => {
        const { password, oldPassword } = req.body
        if (!compareHash({ plainText: oldPassword, hashValue: req.user.password })) {
            return next(new Error('invalid old password', { cause: 409 }))
        }
        const hashPassword = generateHash({ plainText: password, salt: process.env.SALT_ROUND })
        const user = await userModel.findByIdAndUpdate(req.user._id, { password: hashPassword, changePasswordTime: Date.now() },
            { new: true, runValidators: true })

        return successResponse({ res, message: "updated password", data: { user } })
    }
)

export const freezeProfile = asyncHandler(
    async (req, res, next) => {

        const user = await userModel.findByIdAndUpdate(req.user._id, { isDeleted: true, changePasswordTime: Date.now() })
        return successResponse({ res, message: "updated password", data: { user } })
    }
)

export const shareProfile = asyncHandler(
    async (req, res, next) => {

        const user = await userModel.findOne({ _id: req.params.userId, isDeleted: false }).select("userName email image -_id")
        return user ? successResponse({ res, message: "shared profile", data: { user } }) :
            next(new Error("invalid account id", { cause: 404 }))
    }
)
