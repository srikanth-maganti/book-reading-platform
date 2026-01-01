
class ApiError extends Error
{
    constructor(status,message,errors=[],stack="")
    {   super();
        this.status=status;
        this.message=message;
        this.errors=errors;
        this.success=false;
        if(stack)
        {
            this.stack=stack;
        }
        else{
            Error.captureStackTrace(this, this.constructor);
        }
        
    }
}
export {ApiError};