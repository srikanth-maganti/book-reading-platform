import bookschema from "../utils/schema.js";
import {ApiError} from "../utils/api_error.js";
export function validatebook(req,res,next)
{
    let {error}=bookschema.validate(req.body);
    if(error)
    {
        let msg=error.details.map(el=>el.message).join(",");
        throw new ApiError(400,msg);
    }
    next();
    
}