const {betterError} = require("../../util/betterError");

const paperspace_node = require('paperspace-node');

const paperspace = paperspace_node({
    apiKey: process.env.PAPERSPACE_API_KEY
});


function betterLogging(func, message, data) {
    console.log(`Log from ${func}`);
    console.log(message);
    console.log(`Data: ${JSON.stringify(data)}`);
    console.log('\n');
}


//region helperFuncs
function listUsers() {
    return new Promise(((resolve, reject) => {
        try {
            betterLogging("listUsers", "beginning listusers", "hi")
            paperspace.users.list({}, function (err, res) {
                betterLogging("listUsers", "list function error", err)
                betterLogging("listUsers", "list function response", res)
                if (err) {
                    throw betterError(err.statusCode, "Paperspace Users api call fail", err.message);
                }
                resolve(res);
            })

        } catch (err) {
            reject(err)
        }
    }))
}

function findUserByEmail(emailAddress) {
    return new Promise(((resolve, reject) => {
        try {
            listUsers().then(userList => {
                betterLogging("findUserByEmail", "user List", userList)
                let usersFiltered = userList.filter(u => u.email === emailAddress);
                betterLogging("findUserByEmail", "user List filtered", usersFiltered)
                if (usersFiltered.length < 1) {
                    throw betterError(404, "Cannot find User", "Filter user list by email returned zero matching users")
                } else if (usersFiltered.length > 1) {
                    throw betterError(400, "Multiple users found from email address", `More than one user was returned when searching with the email address ${emailAddress}`)
                } else {
                    resolve(usersFiltered[0]);
                }
            }).catch(err => {
                reject(err);
            })
        } catch (err) {
            reject(err);
        }
    }))
}

function listMachines() {
    return new Promise(((resolve, reject) => {
        try {
            paperspace.machines.list({}, function (err, res) {
                betterLogging("listMachines", "list function error", err)
                betterLogging("listMachines", "list function response", res)
                if (err) {
                    throw betterError(err.statusCode, "Paperspace Machines api call fail", err.message);
                }
                resolve(res);
            })
        } catch (err) {
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


//region giveAccess
function giveAccessFromEmail(reqBody) {
    return new Promise((async (resolve, reject) => {
        try {
            betterLogging("giveAccessFromEmail", "Starting process", reqBody)
            let user = await findUserByEmail(reqBody.email)
            betterLogging("giveAccessFromEmail", "finished getting user", user)
            let openMachine = await getOpenMachines()
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

function getOpenMachines() {
    return new Promise(((resolve, reject) => {
        try {
            listMachines().then(machinesList => {
                betterLogging("getOpenMachines", "machine List", machinesList)
                let openMachines = machinesList.filter(m => m.state === "ready");
                betterLogging("getOpenMachines", "machine List filtered", openMachines)
                if (openMachines.length < 1) {
                    throw betterError(404, "Cannot find Open Machine", "Filter machine list by state returned zero matching machines")
                } else {
                    resolve(openMachines[0])
                }
            }).catch(err=>{
                betterLogging("getOpenMachines", "then catch err", err)
                reject(err);
            })
        } catch (err) {
            betterLogging("getOpenMachines", "try catch err", err)
            reject(err);
        }
    }))

}

//endregion


//region revokeAccess
function revokeAccessFromEmail(reqBody) {

}

function getMachineByAssignedId(userId) {

}

//endregion


module.exports = {giveAccessFromEmail}