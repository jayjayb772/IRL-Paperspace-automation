const {paperspaceDiscordMessage} = require("../util/discordMessage");
const {updateReservation} = require("./databaseFunctions");
const {insertUser} = require("./databaseFunctions");
const {insertMachine} = require("./databaseFunctions");
const {insertReservation} = require("./databaseFunctions");
const {betterError} = require("../util/betterError");
const {searchMachines} = require("./databaseFunctions");
const {searchReservationsById} = require("./databaseFunctions");
const {searchUsers} = require("./databaseFunctions");


async function insertUserIfDoesNotExist(user, user_id) {
    return new Promise(((resolve, reject) => {
        searchUsers(user_id).then(row => {
            if(row === undefined){
                insertUser(user).then(res=>{
                    paperspaceDiscordMessage("New User", `New User ${user_id}`, "Confirm that they have created a paperspace account.\nGet their email and add them to the team")
                    resolve(res)
                }).catch(err=>{
                    reject(err)
                    paperspaceDiscordMessage("New User", `New User ${user_id}`, "Confirm that they have created a paperspace account.\nGet their email and add them to the team", "#ff0000")
                })
            }else {
                reject("user exists")
            }
            }).catch(err => {
            reject(betterError(501, "error in db comparison user", `${user_id}\n${err}`))
        })
    }))
}

async function insertMachineIfDoesNotExist(machine, machine_id) {
    return new Promise(((resolve, reject) => {
        searchMachines(machine_id).then(row => {
            if(row.length < 1){
                insertMachine(machine).then(res=>{
                    resolve(res)
                })
            }else {
                reject("machine exists")
            }
        }).catch(err => {
            reject(betterError(501, "error in db comparison machine", `${machine_id}\n${err}`))
        })
    }))
}

async function insertReservationIfDoesNotExist(reservation, reservation_id) {
    return new Promise(((resolve, reject) => {
        searchReservationsById(reservation_id).then(row => {
            if(row.length < 1){
                insertReservation(reservation).then(res=>{
                    resolve(res)
                    paperspaceDiscordMessage("New reservation", `New reservation at ${reservation.start_ts} for user ${reservation.user_id}`, "Make sure user is ready for reservation")
                })
            }else {
                // if(row[0].status !== reservation.status){
                //     updateReservation(reservation_id, reservation.status).then(res=>{
                //         resolve(res)
                //     }).catch(err=>{
                //         reject(err)
                //     })
                // }else{
                    reject("reservation exists")
               // }
            }
        }).catch(err => {
            reject(betterError(501, "error in db comparison reservation", `${reservation_id}\n${err}`))
        })
    }))
}

module.exports = {insertUserIfDoesNotExist, insertMachineIfDoesNotExist, insertReservationIfDoesNotExist}