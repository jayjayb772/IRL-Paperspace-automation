const md5 = require("md5");
const {searchMachines} = require("../../../database/databaseFunctions");
const {updateMachine} = require("../../../database/databaseFunctions");
const {updateReservationInfo} = require("../../../database/databaseFunctions");
const {updateUser} = require("../../../database/databaseFunctions");
const {betterHTTPResponse} = require("../../../util/betterHTTPResponse");
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

async function giveAccessFromID(reqBody){
    return new Promise(async (resolve, reject) => {
        try {
            console.log(reqBody)
            let user = await searchUsers(reqBody.userid).catch(err => {
                throw betterError(500, "Error getting reservation list", JSON.stringify(err))
            })
            console.log(JSON.stringify(user))

            //Get first machine with in_use === 0
            let machine = await searchOpenMachines().catch(err => {
                throw betterError(500, "Error getting open machine", JSON.stringify(err))
            })
            //console.log(JSON.stringify(machine))
            //console.log(machine.machine_id)
            //set machine assigned to user
            //set machine in_use to 1
            let machineUpdateInfo = {
                in_use: 1,
                assigned_to: user.paperspace_user_id
            }

            //set user assigned machine to machine
            let userUpdateInfo = {
                assigned_machine: machine.machine_id
            }
            //set reservation to active
            let reservationUpdateInfo = {
                status: "ACTIVE"
            }
            //set access for userID to machine
            let accessRes = await setMachineAccess(user.paperspace_user_id, machine.machine_id, true).catch(err => {
                throw betterError(500, "Error setting machine access", JSON.stringify(err))
            })
            let updateMachineRes = await updateMachine(machine.machine_id, machineUpdateInfo).catch(err => {
                throw betterError(500, "Error updating machine", JSON.stringify(err))
            })
            let updateUserRes = await updateUser(user.user_id, userUpdateInfo).catch(err => {
                throw betterError(500, "Error updating user", JSON.stringify(err))
            })
            //console.log(`Gave ${user.user_id} access to ${machine.machine_id}`)
            resolve(betterHTTPResponse(200, `Gave ${user.user_id} access to ${machine.machine_id}`, "Success"))
            //find email with id
            //give ps access
            //updateDB
        }catch(err){
            reject(betterHTTPResponse(500,err,"Error in giveAccess"))
        }})
}



async function revokeAccessFromID(reqBody){
    return new Promise(async (resolve, reject) => {
        try {
            console.log(reqBody)
            let user = await searchUsers(reqBody.userid).catch(err => {
                throw betterError(500, "Error getting user list", JSON.stringify(err))
            })
            console.log(JSON.stringify(user))

            //Get first machine with in_use === 0
            let machine = await searchMachines(user.assigned_machine)
            //console.log(JSON.stringify(machine))
            //console.log(machine.machine_id)
            //set machine assigned to user
            //set machine in_use to 1
            let machineUpdateInfo = {
                in_use: 0,
                assigned_to: null
            }

            //set user assigned machine to machine
            let userUpdateInfo = {
                assigned_machine: null
            }
            //set reservation to active
            //set access for userID to machine
            let accessRes = await setMachineAccess(user.paperspace_user_id, machine.machine_id, false).catch(err => {
                throw betterError(500, "Error setting machine access", JSON.stringify(err))
            })
            let updateMachineRes = await updateMachine(machine.machine_id, machineUpdateInfo).catch(err => {
                throw betterError(500, "Error updating machine", JSON.stringify(err))
            })
            let updateUserRes = await updateUser(user.user_id, userUpdateInfo).catch(err => {
                throw betterError(500, "Error updating user", JSON.stringify(err))
            })
            //console.log(`Gave ${user.user_id} access to ${machine.machine_id}`)
            resolve(betterHTTPResponse(200, `Revoked ${user.user_id} access to ${machine.machine_id}`, "Success"))
            //find email with id
            //give ps access
            //updateDB
        }catch(err){
            reject(betterHTTPResponse(500,err,"Error in giveAccess"))
        }})
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
module.exports = {giveAccessFromEmail, revokeAccessFromEmail, loginToSite, giveAccessFromID, revokeAccessFromID}