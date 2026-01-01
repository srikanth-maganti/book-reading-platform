
import Joi from 'joi';

const bookschema=Joi.object({
    book:Joi.object({
        Title:Joi.string()
            .min(3)
            .max(30)
            .required(),
        Author:Joi.string()
            .required(),
        Image:Joi.string().allow("",null),
        Price:Joi.number()
            .required(),
        Quantity:Joi.number()
            .required(),
        ISBN:Joi.string()
            .required(),
        Language:Joi.string()
            .required(),
        Category:Joi.string(),
        Condition:Joi.string(),
        Pages:Joi.number(),
        Publisher:Joi.string(),
        PublishedYear:Joi.string(),
        Description:Joi.string()
    }).required(),
})
export default  bookschema;