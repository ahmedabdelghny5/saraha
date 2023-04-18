import joi from 'joi'

export const sendMessage = {
    params: joi.object().required().keys({
        reciverId: joi.string().min(24).max(24).required()
    }),
    body: joi.object().required().keys({
        // message: joi.object({
        //     message: joi.string().required(),
        //     num: joi.number().integer().required()
        // }).required()
        message: joi.array().items(
            joi.object({
                message: joi.string().required(),
                num: joi.number().integer().required()
            }).required(),
            joi.boolean().required()
        )
    })
}