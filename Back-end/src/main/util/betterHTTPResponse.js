function betterHTTPResponse(status, message, details){
    return {
        status:status,
        message:message,
        details:details
    }
}

module.exports = {betterHTTPResponse}