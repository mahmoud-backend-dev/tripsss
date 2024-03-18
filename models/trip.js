const joi = require("joi");

function validateTrip(obj)
{
    const schema = joi.object({
        id:joi.string(),
        price:joi.number().required(),
        name:joi.string().trim().required(),
        duration:joi.string().trim().required(),
        vehicle:joi.string().trim().required(),
        gudinjg:joi.string().trim().required(),
        description:joi.string().trim().required(),
        type:joi.number(),
    })
    return schema.validate(obj)
}


module.exports=validateTrip ;
