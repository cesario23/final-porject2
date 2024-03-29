const ErrorMessageHandlerClass = require("./ErrorMessageHandlerClass");

function dispatchErrorDevelopment (error, req, res){
    if (req.originalUrl.startsWith('/api')){
        return req.status(error.statusCode).json({
            status: error.status,
            error: error,
            message: error.message,
            stack: error.stack,
        });
    }
}
function dispatchErrorProduction (error, req, res){
    if(req.originalUrl.startsWith("/api")){
        if(error.isOperational){
            return res.status(error.statusCode).json({
                status: error.status,
                message: error.message,
            });
        }
        return res.status(error.statusCode).json({
            status: "Error",
            message: "something  went wrong Pleas contact us ",
        })
    }
}

function handleMongoDBDuplicate(err){   
    let errorMessageDuplicateKey = Object.keys(err.keyValue)[0];
    let errorMessageDuplicateValue = Object.values(err.keyValue)[0];

    let message = `${errorMessageDuplicateKey} - ${errorMessageDuplicateValue} is taken please choose another one`;
    return new ErrorMessageHandlerClass(message,400);
}


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    let error = {...err} ;
    error.message = error.message;

    if(error.code === 11000 || error.code === 11001){
       error = handleMongoDBDuplicate(error);
    }
    if(process.env.NODE_ENV === "development"){
        dispatchErrorDevelopment(error, req, res);
    }else{
        dispatchErrorProduction(error, req, res);
    }
}