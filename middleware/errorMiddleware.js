const errorHandler = (err,req,res,next) => {
    const statusCode = res.statusCode ? res.statusCode : 500
    // If in response 
    res.status(statusCode)

    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
} 


// To override the default express error handler you pass in 'err' and then request and response and then 'next' to call in any further middleware.

module.exports = {
    errorHandler,
}