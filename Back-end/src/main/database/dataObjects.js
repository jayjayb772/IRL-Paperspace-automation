
function machineDTO(machineInfo){
    return {
        "machine_id":machineInfo.id,
        "machine_name":machineInfo.name,
        "in_use":0,
        "state":machineInfo.state,
        "assigned_to":machineInfo.userId ? machineInfo.userId : null
    }
}

function machineEntity(machineRow){
    return {
        "machine_id":machineRow.machine_id,
        "machine_name":machineRow.machine_name,
        "in_use":machineRow.in_use,
        "state":machineRow.state,
        "assigned_to":machineRow.assigned_to
    }
}

function userDTO(patronInfo, reservation = []){
    return{
        user_id:patronInfo.userid,
        name:patronInfo.name,
        email_address:`${patronInfo.userid}@depaul.edu`,
        paperspace_email_address: null,
        verified_in_paperspace: 0,
        paperspace_user_id: null,
        assigned_machine: null,
        reservations:`${reservation}`,
    }
}

function userEntity(userRow){
    return{
        user_id: userRow.user_id,
        name:userRow.name,
        email_address:userRow.email_address,
        paperspace_email_address:userRow.paperspace_email_address,
        verified_in_paperspace: userRow.verified_in_paperspace,
        paperspace_user_id: userRow.paperspace_user_id,
        assigned_machine: userRow.assigned_machine,
        reservations:userRow.reservations,
    }
}

function reservationDTO(reservationInfo){
    return{
        reservation_id: reservationInfo.name,
        user_id:reservationInfo.patron.userid,
        start_ts:reservationInfo.startTime,
        end_ts:reservationInfo.endTime,
        status:reservationInfo.type
    }
}

function reservationEntity(reservationRow){
    return{
        reservation_id: reservationRow.reservation_id,
        user_id:reservationRow.user_id,
        start_ts:reservationRow.start_ts,
        end_ts:reservationRow.end_ts,
        status:reservationRow.status
    }
}

module.exports = {machineDTO, machineEntity, userDTO, userEntity, reservationDTO, reservationEntity}