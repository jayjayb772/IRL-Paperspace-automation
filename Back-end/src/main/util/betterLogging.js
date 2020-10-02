function betterLogging(func, message, data={}) {
    console.log(`Log from ${func}`);
    console.log(message);
    console.log(`Data: ${JSON.stringify(data)}`);
    console.log('\n');
}

module.exports = {betterLogging}