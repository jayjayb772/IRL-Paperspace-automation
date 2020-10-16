const md5 = require("md5");
const {searchUsersEmail} = require("../../../database/databaseFunctions");
const {searchOpenMachines} = require("../../../database/databaseFunctions");
const {searchUsers} = require("../../../database/databaseFunctions");
const {betterError} = require("../../../util/betterError");
const {betterLogging}= require("../../../util/betterLogging");
const {listMachines, listUsers, setMachineAccess} = require("../paperspaceUtils");

//region giveAccess
//TODO RE WRITE THESE WITH THE DATABASES IN MIND
function giveAccessFromEmail(reqBody) {
    return new Promise((async (resolve, reject) => {
        try {

            betterLogging("giveAccessFromEmail", "Starting process", reqBody)
            let user = await listUsers({email:reqBody.email})
            betterLogging("giveAccessFromEmail", "finished getting user", user)
            let openMachine = await searchOpenMachines().catch(err => {
                console.log(err)
                reject(betterError(500, "Error getting open machine", JSON.stringify(err)))
            })
            betterLogging("giveAccessFromEmail", "finished getting machine", openMachine)
            let setAccessResponse = await setMachineAccess(user[0].id, openMachine.machine_id, true)
            setAccessResponse.machineId = openMachine.machine_id
            betterLogging("giveAccessFromEmail", "finished setting access", setAccessResponse)
            resolve(setAccessResponse);
        } catch (err) {
            betterLogging("giveAccessFromEmail", "CATCH ERROR", err)
            reject(betterError(501,err,err))
        }
    }))
}
//endregion

//region revokeAccess
//TODO RE WRITE THESE WITH THE DATABASES IN MIND
function revokeAccessFromEmail(reqBody) {
    return new Promise((async (resolve, reject) => {
        try {
            betterLogging("revokeAccessFromEmail", "Starting process", reqBody)
            let user = await searchUsersEmail(reqBody.email).catch(err => {
                throw betterError(500, "Error getting reservation list", JSON.stringify(err))
            })
            betterLogging("revokeAccessFromEmail", "finished getting user", user)
            let assignedMachineId = "psfyw98r0"
            betterLogging("revokeAccessFromEmail", "finished getting machine", assignedMachineId)
            let setAccessResponse = await setMachineAccess(user.paperspace_user_id, assignedMachineId, false).catch(err=>{
                console.log(err)
            })
            setAccessResponse.machineId = assignedMachineId
            betterLogging("revokeAccessFromEmail", "finished setting access", setAccessResponse)
            resolve(setAccessResponse);
        } catch (err) {
            betterLogging("revokeAccessFromEmail", "CATCH ERROR", err)
            reject(betterError(500, "bad", err))
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

function loginAsGuest(reqBody){
    return new Promise((async (resolve, reject) => {
        try {
            searchUsers(reqBody.user_id).then(rows=>{
                if(rows < 1 || rows >1 ){
                    reject(betterError(404, "Could not find user",  "cant find user"))
                }
                resolve("success")
            })
        }catch(err){
            reject(betterError(401, "Not authorized", "Could not verify credentials"))
        }
    }))
}
module.exports = {giveAccessFromEmail, revokeAccessFromEmail, loginToSite}