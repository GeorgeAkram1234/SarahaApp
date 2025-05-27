import { Router } from "express";
import { freezeProfile, profile, shareProfile, updatePassword, updateProfile } from "./services/user.service.js";
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import { endpoint } from "./user.endpoint.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from '../user/user.validation.js'

const router = Router()

router.get("/profile"
    , authentication()
    , authorization(endpoint.profile)
    , profile)

router.get("/profile/:userId",
    validation(validators.shareProfile)
    , shareProfile)


router.patch("/profile",
    validation(validators.updateProfile)
    , authentication()
    , authorization(endpoint.profile)
    , updateProfile)

router.patch("/profile/password",
    validation(validators.updatePassword)
    , authentication()
    , authorization(endpoint.profile)
    , updatePassword)

router.delete("/profile"
    , authentication()
    , authorization(endpoint.profile)
    , freezeProfile)




export default router