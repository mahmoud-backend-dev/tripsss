const joi = require("joi");

function validateBlog(obj)
{
    const schema = joi.object({
        description:joi.string().trim().required(),
        date:joi.string().trim().required()
    })
    return schema.validate(obj)
}


module.exports=validateBlog ;
