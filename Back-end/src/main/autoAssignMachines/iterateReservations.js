const {betterError} = require("../util/betterError");
const {searchReservationsByStatus} = require("../database/databaseFunctions");
const moment = require('moment');
const {searchMachines} = require("../database/databaseFunctions");
const {updateReservationInfo} = require("../database/databaseFunctions");
const {updateReservation} = require("../database/databaseFunctions");
const {updateUser} = require("../database/databaseFunctions");
const {updateMachine} = require("../database/databaseFunctions");
const {setMachineAccess} = require("../controllers/paperspace/paperspaceUtils");
const {searchOpenMachines} = require("../database/databaseFunctions");
const {searchUsers} = require("../database/databaseFunctions");

async function iterateReservationsGive() {
    return await new Promise((async (resolve, reject) => {
        try {
            //get list of reservations with type "RESERVATION"
            let listRes = await searchReservationsByStatus("RESERVATION").catch(err => {
                throw betterError(500, "Error getting reservation list", err)
            })
            //get curTime with moment
            let curTime = moment()
            console.log(curTime)
            console.log('\n')
            let actions = []
            //for res in Reservations
            for await (const reservation of listRes) {
                let resActions = {
                    resId: reservation.reservation_id,
                    actions:[]
                }
                try {
                    let resMoment = moment(reservation.start_ts)
                    let minsUntilRes = resMoment.diff(curTime, 'minutes')
                    //if, curTime.until(start_ts) is less than 5 minutes
                    if (minsUntilRes < 5) {
                        //Get user
                        let user = await searchUsers(reservation.user_id).catch(err => {
                            throw betterError(500, "Error getting reservation list", JSON.stringify(err))
                        })
                        console.log(JSON.stringify(user))

                        //Get first machine with in_use === 0
                        let machine = await searchOpenMachines().catch(err => {
                            throw betterError(500, "Error getting open machine", JSON.stringify(err))
                        })
                        console.log(JSON.stringify(machine))
                        console.log(machine.machine_id)
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
                        let accessRes = await setMachineAccess(user.paperspace_user_id, machine.machine_id,true).catch(err => {
                            throw betterError(500, "Error setting machine access", JSON.stringify(err))
                        })
                        resActions.actions.push(accessRes)
                        let updateMachineRes = await updateMachine(machine.machine_id, machineUpdateInfo).catch(err => {
                            throw betterError(500, "Error updating machine", JSON.stringify(err))
                        })
                        resActions.actions.push(updateMachineRes)
                        let updateReservationRes = await updateReservationInfo(reservation.reservation_id, reservationUpdateInfo).catch(err => {
                            throw betterError(500, "Error updating reservation", JSON.stringify(err))
                        })
                        resActions.actions.push(updateReservationRes)
                        let updateUserRes = await updateUser(user.user_id, userUpdateInfo).catch(err => {
                            throw betterError(500, "Error updating user", JSON.stringify(err))
                        })
                        resActions.actions.push(updateUserRes)
                        console.log(`Gave ${user.user_id} access to ${machine.machine_id}`)
                        resActions.success = "success";
                        actions.push(resActions)
                    }else{
                        resActions.err = "Not yet"
                        actions.push(resActions)
                    }

                } catch (err) {
                    resActions.err = JSON.stringify(err)
                    actions.push(resActions)
                }
            }
            resolve(actions)
        } catch (err) {
            reject(JSON.stringify(err))
        }
    }))
}

async function iterateReservationsRevoke() {
    return await new Promise((async (resolve, reject) => {
        try {
            //get list of reservations with type "RESERVATION"
            let listRes = await searchReservationsByStatus("ACTIVE").catch(err => {
                throw betterError(500, "Error getting reservation list", err)
            })
            if(listRes.length <1 ){
                resolve("No active reservations")
            }
            //get curTime with moment
            let curTime = moment()
            let actions = []
            //for res in Reservations
            for await (const reservation of listRes) {
                let resActions = {
                    resId: reservation.reservation_id
                }
                try {
                    let resMoment = moment(reservation.end_ts)
                    let minsSinceRes = resMoment.diff(curTime, 'minutes')
                    console.log(minsSinceRes)
                    if (minsSinceRes <= -5) {
                        //Get user
                        let user = await searchUsers(reservation.user_id).catch(err => {
                            throw betterError(500, "Error getting reservation list", JSON.stringify(err))
                        })

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
                        let reservationUpdateInfo = {
                            status: "COMPLETE"
                        }

                        //set access for userID to machine
                        let accessRes = await setMachineAccess(user.paperspace_user_id, user.assigned_machine,false).catch(err => {
                            throw betterError(500, "Error setting machine access", JSON.stringify(err))
                        })
                        actions.push(accessRes)
                        let updateMachineRes = await updateMachine(user.assigned_machine, machineUpdateInfo).catch(err => {
                            throw betterError(500, "Error updating machine", JSON.stringify(err))
                        })
                        actions.push(updateMachineRes)
                        let updateReservationRes = await updateReservationInfo(reservation.reservation_id, reservationUpdateInfo).catch(err => {
                            throw betterError(500, "Error updating reservation", JSON.stringify(err))
                        })
                        actions.push(updateReservationRes)
                        let updateUserRes = await updateUser(user.user_id, userUpdateInfo).catch(err => {
                            throw betterError(500, "Error updating user", JSON.stringify(err))
                        })
                        actions.push(updateUserRes)
                        console.log(`Took access from ${user.user_id} for machine ${user.assigned_machine}`)
                        resActions.success = "success";
                        actions.push(resActions)
                    }else{
                        resActions.err = "Not yet"
                        actions.push(resActions)
                    }

                } catch (err) {
                    resActions.err = JSON.stringify(err)
                    actions.push(resActions)
                }
            }
            resolve(actions)
        } catch (err) {
            reject(JSON.stringify(err))
        }
    }))
}

module.exports = {iterateReservationsGive, iterateReservationsRevoke}
