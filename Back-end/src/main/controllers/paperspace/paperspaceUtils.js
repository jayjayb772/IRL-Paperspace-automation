const {betterLogging}= require("../../util/betterLogging");
const {betterError} = require("../../util/betterError");
const paperspace_node = require('paperspace-node');

const paperspace = paperspace_node({
    apiKey: process.env.PAPERSPACE_API_KEY
});

//region machines
function listMachines(options={}) {
    return new Promise(((resolve, reject) => {
        try {
            paperspace.machines.list(options, function (err, res) {
                betterLogging("listMachines", "list function error", err)
                betterLogging("listMachines", "list function response", res)
                if (err) {
                    reject(betterError(err.statusCode, "Paperspace Machines api call fail", err.message));
                }
                if(res.length < 1){
                   reject(betterError(404, "Cannot find Open Machine", "fltering of machine list by state returned zero matching machines"))
                }
                resolve(res);
            })
        } catch (err) {
            betterLogging("listMachines", "CATCH ERROR", err)
            reject(err);
        }
    }))
}

function setMachineAccess(userId, machineId, enableAccess) {
    return new Promise(((resolve, reject) => {
        try {
            betterLogging("setMachineAccess", "user id passed to func", userId)
            betterLogging("setMachineAccess", "machine id passed to func", machineId)
            betterLogging("setMachineAccess", "enable passed to func", enableAccess)
            paperspace.machines.setAccessForUser({
                machineId: machineId,
                userId: userId,
                enableAccess: enableAccess
            }, function(err, res) {
                betterLogging("setMachineAccess", "set access error", err)
                betterLogging("setMachineAccess", "set access response", res)
                if(err){
                    throw betterError(err.statusCode,"Paperspace Users api call fail",err.message);
                }
                resolve(res)
            });
        } catch (err) {
            reject(err);
        }
    }))
}

//endregion

//region users
// Lists users on Paperspace team
/* use Options to set filtering */
function listUsers(options={}) {
    return new Promise(((resolve, reject) => {
        try {
            betterLogging("listUsers", "beginning listusers", "hi")
            paperspace.users.list(options, function (err, res) {
                betterLogging("listUsers", "list function error", err)
                betterLogging("listUsers", "list function response", res)
                if (err) {
                    throw betterError(err.statusCode, "Paperspace Users api call fail", err.message);
                }
                if(res.length < 1){
                    reject(betterError(404, "Cannot find User", "fltering of user list by email returned zero matching users"))
                }
                resolve(res);
            })
        } catch (err) {
            reject(err)
        }
    }))
}
//endregion


module.exports = {listMachines, setMachineAccess, listUsers}