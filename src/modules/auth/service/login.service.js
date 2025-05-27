import userModel from "../../../DB/model/User.model.js";
import { successResponse } from "../../../utils/successResponse/success.response.js";
import { compareHash } from "../../../utils/security/hash.js";
import { asyncHandler } from "../../../utils/error/error.handler.js";
import { generateToken } from "../../../utils/security/token.js";
import { roleTypes } from "../../../middleware/auth.middleware.js";


export const login = asyncHandler(
    async (req, res, next) => {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })
        if (!user) {
            return next(new Error("In-valid Account", { cause: 404 }))
        }
        if (!user.confirmEmail) {
            return next(new Error("please confirm your email first", { cause: 400 }))
        }
        
        if (!compareHash({ plainText: password, hashValue: user.password })) {
            return next(new Error("In-valid Account credential", { cause: 400 }))
        }
        const token = generateToken({
            payload: { id: user._id, isLoggedIn: true },
            signature: user.role == roleTypes.User ?
                process.env.TOKEN_SIGNATURE :
                process.env.TOKEN_SIGNATURE_ADMIN,
            options: { expiresIn: 3600 }
        })
        if (user.isDeleted) {
            user.isDeleted = false;
            await user.save()
        }

        return successResponse({ res, message: "Done", data: { token } })
    }
)

