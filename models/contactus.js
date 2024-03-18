const joi = require("joi");

function validateContact(obj)
{
    const schema = joi.object({
        name:joi.string().trim().required(),
        mail:joi.string().trim().required(),
        description:joi.string().trim()
    })
    return schema.validate(obj)
}


module.exports=validateContact ;
