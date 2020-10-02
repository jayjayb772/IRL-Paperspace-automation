const {betterLogging}= require("../../util/betterLogging");
const {listMachines, listUsers, setMachineAccess} = require("./paperspaceUtils");

const {betterError} = require("../../util/betterError");

//region giveAccess
function giveAccessFromEmail(reqBody) {
    return new Promise((async (resolve, reject) => {
        try {
            betterLogging("giveAccessFromEmail", "Starting process", reqBody)
            let user = await listUsers({email:reqBody.email})
            betterLogging("giveAccessFromEmail", "finished getting user", user)
            let openMachine = await listMachines({state:"ready"})
            betterLogging("giveAccessFromEmail", "finished getting machine", openMachine)
            let setAccessResponse = await setMachineAccess(user.id, openMachine.id, true)
            setAccessResponse.machineId = openMachine.id
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
            let user = await findUserByEmail(reqBody.email)
            betterLogging("revokeAccessFromEmail", "finished getting user", user)
            let assignedMachine = await listMachines({userId: user.id})
            betterLogging("revokeAccessFromEmail", "finished getting machine", assignedMachine)
            let setAccessResponse = await setMachineAccess(user.id, assignedMachine[0].id, false)
            setAccessResponse.machineId = assignedMachine.id
            betterLogging("revokeAccessFromEmail", "finished setting access", setAccessResponse)
            resolve(setAccessResponse);
        } catch (err) {
            betterLogging("revokeAccessFromEmail", "CATCH ERROR", err)
            reject(err)
        }
    }))
}
//endregion


module.exports = {giveAccessFromEmail, revokeAccessFromEmail}