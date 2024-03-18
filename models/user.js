const joi = require("joi");

function validateUser(obj)
{
    const schema = joi.object({
        name:joi.string().trim().required(),
        mail:joi.string().trim().required(),
        pass:joi.string().trim().required(),
    })
    return schema.validate(obj)
}

function validateLogin(obj)
{
    const schema = joi.object({
        mail:joi.string().trim().required(),
        pass:joi.string().trim().required()
    })
    return schema.validate(obj)
}

function validateEmail(obj)
{
    const schema = joi.object({
        mail:joi.string().trim().required(),
    })
    return schema.validate(obj)
}

function validateResetpass(obj)
{
    const schema = joi.object({
        mail:joi.string().trim().required(),
        pass:joi.string().trim().required(),
        code:joi.string().trim().required(),
    })
    return schema.validate(obj)
}

module.exports={validateUser,validateLogin,validateEmail,validateResetpass} ;
