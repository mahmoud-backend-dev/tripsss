const joi = require("joi");

function validateClass(obj)
{
    const schema = joi.object({
        name:joi.string().trim().required(),
        description:joi.string().trim()
    })
    return schema.validate(obj)
}


module.exports=validateClass ;
