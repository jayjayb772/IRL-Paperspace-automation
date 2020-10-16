let db, mId, rId, uId = require('./databaseMocks')
function addReservation(start_ts = "2020-04-08T14:00:00.000000-05:00", end_ts= "2020-04-08T14:45:00.000000-05:00", status = "COMPLETE"){
    let insert = 'INSERT INTO t_reservations (reservation_id, user_id, start_ts, end_ts, status) VALUES (?,?,?,?,?)'
    let params = []
    params.push(`${rId}`)
    params.push(`Test${rId}`)
    params.push(`${start_ts}`)
    params.push(`${end_ts}`)
    params.push(`${status}`)
    db.run(insert, params)
    rId++;
}

function addUser(paperspaceEmail = null, verifiedInPaperspace = 0, paperspaceUserId = null, assignedMachine = null, reservations ="[]" ){
    let insert = 'INSERT INTO t_users (user_id, name, email_address, paperspace_email_address, verified_in_paperspace, paperspace_user_id, assigned_machine, reservations) VALUES (?,?,?,?,?,?,?,?)'
    let params = []
    params.push(`${uId}`)
    params.push(`test ${uId}`)
    params.push(`test${uId}@depaul.edu`)
    params.push(paperspaceEmail)
    params.push(verifiedInPaperspace)
    params.push(paperspaceUserId)
    params.push(assignedMachine)
    params.push(reservations)
    db.run(insert, params)
    uId++;
}

function addMachine(inUse = 0, state = "ready", assigned_to= null){
    let insert = 'INSERT INTO t_machines (machine_id, machine_name, in_use, state, assigned_to) VALUES (?,?,?,?,?)'
    let params = []
    params.push(`test${mId}`)
    params.push(`TEST${mId}`)
    params.push(inUse)
    params.push(state)
    params.push(assigned_to)
    db.run(insert, params)
    mId++;
}
