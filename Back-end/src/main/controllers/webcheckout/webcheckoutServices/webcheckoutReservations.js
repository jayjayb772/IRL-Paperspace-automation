const request = require('request')
const {betterLogging} = require("../../../util/betterLogging");
const {insertReservationIfDoesNotExist} = require("../../../database/databaseComparison");
const {insertUserIfDoesNotExist} = require("../../../database/databaseComparison");
const {userDTO} = require("../../../database/dataObjects");
const {reservationDTO} = require("../../../database/dataObjects");
//TODO Broad schedule search with params

//TODO build params for search
const {betterError} = require("../../../util/betterError");

function reservationParams() {
    return {
        "sessionid": `${process.env.SID}`,
        "query": {"and": {"resourceType": {"_class": "resourceType", "oid": 385718885, "name": "Virtual Computers"}}},
        "properties": ["type", "startTime", "realStartTime", "endTime", "realEndTime",
            "scheduledBy", "scheduledResource", "patron"]
    }
}

const resFilter = function(res){
    if(res.type === "TURNAROUND-TIME" || res.type === "OFFLINE-COMPLETED"){
        return false
    }
    return true;
}


async function getReservations() {
    return new Promise((async (resolve, reject) => {
        let postBody = reservationParams()
        let options = {
            "headers": {},
            "body": JSON.stringify(postBody)
        }
        request.post(`${process.env.WEBCHECKOUT_HOST}/rest/resourceSchedule/search`, options, (err, res) => {
            if (err) {
                reject({res, err})
            } else {
                let parsedBody = JSON.parse(res.body)
                betterLogging("getReservations", "parsed body", parsedBody)
                let reservationSchedules = parsedBody.payload.result
                betterLogging("getReservations", "res schedules", reservationSchedules)

                if (parsedBody.payload.count < 1) {
                    reject(betterError(501, "No reservations returned", {err, res}))
                }
                resolve(reservationSchedules.filter(resFilter));
            }
        })
    })).catch(err => {
        throw betterError(500, "Error getting reservations from wco", err);
    })
}

//TODO Get active

//TODO Get Past


//TODO parse response

//TODO build DB Entity to pass to DB
async function getReservationsAndUpdateDB(){
    return new Promise(async (resolve, reject) => {
        let errors = []
        await getReservations().then(async (wcoResObjects)=>{
                for await(const reservation of wcoResObjects) {

                    let resObj = reservationDTO(reservation);
                    let userObj = userDTO(reservation.patron);
                    await insertUserIfDoesNotExist(userObj, userObj.user_id).then(res => {
                        //console.log(`${userObj.user_id}\n${res}\n`)
                    }).catch(err => {
                        errors.push(err)
                    })
                    await insertReservationIfDoesNotExist(resObj, resObj.reservation_id).then(res => {
                        //console.log(`${resObj.reservation_id}\n${res}\n\n\n`)
                    }).catch(err => {
                        errors.push(err)
                    })

                }
        }).catch(err=>{
            errors.push(err)
        })
        if(errors.length > 1){
            resolve(`Finished with the following errors:\n${errors}`)
        }
        resolve("Finished with no errors")
    })
}

//TODO DB stuff



module.exports = {getReservations, getReservationsAndUpdateDB}