const Joi = require("joi");

function validateOrder(obj) {
    const schema = Joi.object({
        name: Joi.string().trim().required(),
        trip_id: Joi.string().required(),
        number_of_person: Joi.number().integer().min(1).required(),
        arrivaldate: Joi.date().iso().required(), // Ensures ISO 8601 date format
        departuredate: Joi.date().iso().required(),
        flight_number: Joi.number().integer().required(),
        hotel_name: Joi.string().trim().required(),
        room_num: Joi.number().required(),
        user_id:Joi.number()
    });
    return schema.validate(obj);
}


module.exports=validateOrder ;

