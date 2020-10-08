const {md5} = require("md5");
const {betterError} = require("../../../util/betterError");
const {betterLogging}= require("../../../util/betterLogging");
const {listMachines, listUsers, setMachineAccess} = require("../paperspaceUtils");

//region giveAccess
function giveAccessFromEmail(reqBody) {
    return new Promise((async (resolve, reject) => {
        try {
            betterLogging("giveAccessFromEmail", "Starting process", reqBody)
            let user = await listUsers({email:reqBody.email})
            betterLogging("giveAccessFromEmail", "finished getting user", user)
            let openMachine = await listMachines({state:"ready"})
            betterLogging("giveAccessFromEmail", "finished getting machine", openMachine)
            let setAccessResponse = await setMachineAccess(user[0].id, openMachine[0].id, true)
            setAccessResponse.machineId = openMachine[0].id
            betterLogging("giveAccessFromEmail", "finished setting access", setAccessResponse)
            resolve(setAccessResponse);
        } catch (err) {
            betterLogging("giveAccessFromEmail", "CATCH ERROR", err)
            reject(err)
        }
    }))
}
//endregion

//region revokeAccess
function revokeAccessFromEmail(reqBody) {
    return new Promise((async (resolve, reject) => {
        try {
            betterLogging("revokeAccessFromEmail", "Starting process", reqBody)
            let user = await listUsers({email:reqBody.email})
            betterLogging("revokeAccessFromEmail", "finished getting user", user)
            let assignedMachine = await listMachines({userId: user.id})
            betterLogging("revokeAccessFromEmail", "finished getting machine", assignedMachine)
            let setAccessResponse = await setMachineAccess(user[0].id, assignedMachine[0].id, false)
            setAccessResponse.machineId = assignedMachine[0].id
            betterLogging("revokeAccessFromEmail", "finished setting access", setAccessResponse)
            resolve(setAccessResponse);
        } catch (err) {
            betterLogging("revokeAccessFromEmail", "CATCH ERROR", err)
            reject(err)
        }
    }))
}
//endregion

function loginToSite(reqBody){
    return new Promise((async (resolve, reject) => {
        try {
            if(reqBody.name === process.env.DEFAULT_USER && reqBody.password === md5(process.env.DEFAULT_PASSWORD)){
                resolve("Success")
            }else{
                reject(betterError(401, "Not authorized", "Could not verify credentials"))
            }
        }catch(err){
            reject(betterError(401, "Not authorized", "Could not verify credentials"))
        }
    }))
}
module.exports = {giveAccessFromEmail, revokeAccessFromEmail, loginToSite}