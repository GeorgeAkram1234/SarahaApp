import joi from "joi"
import { Types } from "mongoose";


export const validationObjectId = (value, helper) => {
    return Types.ObjectId.isValid(value) ? true :helper.message("invalid object id")
}


export const generalFields = {
    email: joi.string().email({ minDomainSegments: 2, maxDomainSegments: 3, tlds: { allow: ['com', 'net', 'edu'] } }),
    userName: joi.string().alphanum().case('upper').min(2).max(30).messages({
        "any.required": "username is required",
        'string.min': "min is 2 characters",
        'string.empty': "username can't be empty",
    }),
    password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[#&<>@\"~:$^%{}?])/)),
    confirmationPassword: joi.string().valid(joi.ref('password')),
    phone: joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)),
    id: joi.string().custom(validationObjectId),
    'accept-language': joi.string().valid('en', 'ar')
}




export const validation = (schema) => {
    return (req, res, next) => {
        const inputData = { ...req.body, ...req.query, ...req.params }
        if (req.headers['accept-language']) {
            inputData['accept-language'] = req.headers['accept-language']
        }
        const validationResult = schema.validate(inputData, { abortEarly: false })
        if (validationResult.error) {
            return res.status(400).json({ message: "validation error", validationResult: validationResult.error.details })
        }
        return next()
    }
}


export const validation_custom = (schema) => {
    return (req, res, next) => {
        const validationErrors = []
        for (const key of Object.keys(schema)) {
            const validationResult = schema[key].validate(req[key], { abortEarly: false })
            if (validationResult.error) {
                validationErrors.push({ key, err: validationResult.error.details })
            }
        }
        if (validationErrors.length > 0) {
            return res.status(400).json({ message: "validation error", validationResult: validationErrors })
        }
        return next()
    }
}