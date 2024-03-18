const joi = require("joi");

function validateType(obj)
{
    const schema = joi.object({
        class_id : joi.number().required(),
        name:joi.string().trim().required(),
        description:joi.string().trim()
    })
    return schema.validate(obj)
}


module.exports=validateType ;
