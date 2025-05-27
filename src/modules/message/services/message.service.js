import messageModel from "../../../DB/model/Message.model.js";
import userModel from "../../../DB/model/User.model.js";
import { asyncHandler } from "../../../utils/error/error.handler.js";
import { successResponse } from "../../../utils/successResponse/success.response.js";

export const sendMessage = asyncHandler(
    async (req, res, next) => {
        const { message, recipientId } = req.body

        if (! await userModel.findOne({ _id: recipientId, isDeleted: false })) {
            return next(new Error('in valid acc Id', { cause: 404 }))
        }

        const newMessage = await messageModel.create({ message, recipientId })

        return successResponse({ res, data: { newMessage }, status: 201 })
    }
)