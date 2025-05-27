import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const signup = joi.object().keys({
    email: generalFields.email.required(),
    userName: generalFields.userName.required(),
    password: generalFields.password.required(),
    confirmationPassword: generalFields.confirmationPassword.valid(joi.ref('password')).required(),
    phone: generalFields.phone.required(),
}).required().options({ allowUnknown: true })



export const login = joi.object().keys({
    email: generalFields.email.required(),
    password: generalFields.password.required(),
}).required().options({ allowUnknown: false })


export const signup_custom = {
    body: joi.object().keys({
        email: joi.string().email({ minDomainSegments: 2, maxDomainSegments: 3, tlds: { allow: ['com', 'net', 'edu'] } }).required(),
        userName: joi.string().alphanum().case('upper').min(2).max(30).required(),
        password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[#&<>@\"~:$^%{}?])$/)).required(),
        confirmationPassword: joi.string().valid(joi.ref('password')).required(),
        phone: joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)).required()

    }).required().options({ allowUnknown: false })
    ,
    params: joi.object().keys({
        id: joi.boolean().required()
    }).required().options({ allowUnknown: false }),

    headers: joi.object().keys({
        'accept-language': joi.string().valid('en', 'ar')
    }).required().options({ allowUnknown: true }),

}
