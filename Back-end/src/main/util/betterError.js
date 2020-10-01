function betterError(errorStatus, message, details){
    let errString = {
        "statusCode":errorStatus,
        "message":message,
        "details":details
    }
    return errString
}

module.exports ={betterError}