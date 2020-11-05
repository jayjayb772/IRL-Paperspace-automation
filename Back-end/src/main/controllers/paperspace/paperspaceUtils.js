const {betterLogging}= require("../../util/betterLogging");
const {betterError} = require("../../util/betterError");
const paperspace_node = require('paperspace-node');
const {updateUser} = require("../../database/databaseFunctions");
const {insertMachineIfDoesNotExist} = require("../../database/databaseComparison");
const {machineDTO} = require("../../database/dataObjects");

const paperspace = paperspace_node({
    apiKey: process.env.PAPERSPACE_API_KEY
});

//region machines
async function listMachines(options={}) {
    return new Promise(((resolve, reject) => {
        try {
            paperspace.machines.list(options, async function (err, res) {
                if (err) {
                    reject(betterError(501, "Paperspace Machines api call fail", err.message));
                }
                if(res.length < 1){
                   reject(betterError(404, "Cannot find Open Machine", "Filtering of machine list by state returned zero matching machines"))
                }
                let errors = [];
                    for await (const machine of res) {
                        let machineObj = machineDTO(machine);
                        await insertMachineIfDoesNotExist(machineObj, machineObj.machine_id).then(res => {
                        }).catch(err => {
                            errors.push(err)
                        })
                    }

                resolve(`${JSON.stringify(res)}\nAdded machines to db with the following errors\n${errors}`);

            })
        } catch (err) {
            reject(betterError(501, "CATCH ERROR", err));
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
                console.log(err,res)
                betterLogging("setMachineAccess", "set access error", err)
                betterLogging("setMachineAccess", "set access response", res)
                if(err){
                    reject(betterError(err.status,"Paperspace Users api call fail",err.message));
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
                    reject(betterError(err.statusCode, "Paperspace Users api call fail", err.message));
                }
                if(res.length < 1){
                    reject(betterError(404, "Cannot find User", "User not found in paperspace team. Please contact the IRL to be invited"))
                }
                resolve(res);
            })
        } catch (err) {
            reject(betterError(501, err, err))
        }
    }))
}

function buildUserVerifiedObject(paperspaceUser){
    return{
        paperspace_user_id:paperspaceUser.id,
        verified_in_paperspace:1
    }
}


async function verifyUserInPaperspace(user){
    console.log("In verify")
    return new Promise(((resolve, reject) => {
        listUsers({email:user.paperspace_email_address}).then(res=>{
            if(res.length !== 1){
                reject(betterError(404, "Cannot find user in paperspace", `User ${user.user_id} not found in paperspace with email ${user.paperspace_email_address}`))
            }
            console.log(res)
            let updateBody = buildUserVerifiedObject(res[0]);
            updateUser(user.user_id, updateBody).then(res=>{
                let body = {
                    dbRes: res
                }
                resolve(body)
            }).catch(err=>{
                reject(betterError(500, err, err))
            })
        }).catch(err=>{
            console.log(err)
            reject(err)
        })
    }))
}
//endregion


module.exports = {listMachines, setMachineAccess, listUsers, verifyUserInPaperspace}