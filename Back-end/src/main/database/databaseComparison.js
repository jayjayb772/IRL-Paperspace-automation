const {insertUser} = require("./databaseFunctions");
const {insertMachine} = require("./databaseFunctions");
const {insertReservation} = require("./databaseFunctions");
const {betterError} = require("../util/betterError");
const {searchMachines} = require("./databaseFunctions");
const {searchReservations} = require("./databaseFunctions");
const {searchUsers} = require("./databaseFunctions");


async function insertUserIfDoesNotExist(user, user_id) {
    return new Promise(((resolve, reject) => {
        searchUsers(user_id).then(row => {
            if(row.length < 1){
                insertUser(user).then(res=>{
                    resolve(res)
                }).catch(err=>{
                    reject(err)
                })
            }else {
                resolve("user exists")
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
                resolve("machine exists")
            }
        }).catch(err => {
            reject(betterError(501, "error in db comparison machine", `${machine_id}\n${err}`))
        })
    }))
}

async function insertReservationIfDoesNotExist(reservation, reservation_id) {
    return new Promise(((resolve, reject) => {
        searchReservations(reservation_id).then(row => {
            if(row.length < 1){
                insertReservation(reservation).then(res=>{
                    resolve(res)
                })
            }else {
                resolve("reservation exists")
            }
        }).catch(err => {
            reject(betterError(501, "error in db comparison reservation", `${reservation_id}\n${err}`))
        })
    }))
}

module.exports = {insertUserIfDoesNotExist, insertMachineIfDoesNotExist, insertReservationIfDoesNotExist}