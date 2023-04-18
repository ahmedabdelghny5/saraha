
import joi from 'joi'


export const signup = {

    body: joi.object().required().keys({
        name: joi.string().min(2).max(15).required(),
        email: joi.string().email().required().messages({
            'any.required': 'Plz send u email',
            'any.empty': 'Plxz fill in u email',
            'string.email': "plz enter valid email",
            // 'string.base':"email accept string value only"

        }),
        password: joi.string()
            .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
        cPassword: joi.string().valid(joi.ref('password')).required()
    })
}

export const signin = {
    body: joi.object().required().keys({
        email: joi.string().email().required(),
        password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required()
    })
    // query: joi.object().required().keys({
    //     flag: joi.boolean().sensitive({ enabled: true }).truthy('1')
    //         .falsy('0').required()
    // })
}

export const checkToken = {
    params: joi.object().required().keys({
        token: joi.string().required()
    })
}