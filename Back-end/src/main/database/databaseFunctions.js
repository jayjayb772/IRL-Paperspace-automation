const db = require('./database');
const {betterError} = require("../util/betterError");

//region Reservations
async function searchReservationsById(reservation_id = null) {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM t_reservations'
        let params = []
        if (reservation_id) {
            sql = sql + ' WHERE reservation_id=?'
            params.push(reservation_id)
        }
        return db.all(sql, params, (err, rows) => {
            if (err) {
                reject(betterError(500, "Could not search reservations", `failed to search reservations ${err}`))
            } else {
                resolve(rows);
            }
        })
    })
}

async function searchReservationsByStatus(status = null) {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM t_reservations'
        let params = []
        if (status) {
            sql = sql + ' WHERE status=?'
            params.push(status)
        }
        return db.all(sql, params, (err, rows) => {
            if (err) {
                reject(betterError(500, "Could not search reservations", `failed to search reservations ${err}`))
            } else {
                resolve(rows);
            }
        })
    })
}

async function insertReservation(reservationData) {
    return new Promise((resolve, reject) => {
        let sql = 'INSERT INTO t_reservations (reservation_id, user_id, start_ts, end_ts, status) VALUES (?,?,?,?,?)'
        let params = [reservationData.reservation_id, reservationData.user_id, reservationData.start_ts, reservationData.end_ts, reservationData.status]
        return db.run(sql, params, (err) => {
            if (err) {
                reject(betterError(500, "failed to insert into t_reservations", `failed to insert ${reservationData}`))
            } else {
                resolve("Inserted into reservations")
            }
        })
    })
}

async function updateReservation(reservation_id, status) {
    return new Promise((resolve, reject) => {
        let sql = 'UPDATE t_reservations SET status=? WHERE reservation_id=?';
        let params = [status, reservation_id];
        db.run(sql, params, (err) => {
            if (err) {
                reject(betterError(500, "failed to update in t_reservations", `Failed to updated row ${reservation_id}`));
            } else {
                resolve(`Updated ${reservation_id}`)
            }
        })
    })
}


async function updateReservationInfo(reservation_id, updatedInfo) {
    return new Promise((resolve, reject) => {
        let sql = 'UPDATE t_reservations SET ';

        let params = [];
        if (updatedInfo.start_ts !== undefined) {
            sql = sql + 'start_ts=? '
            params.push(updatedInfo.start_ts)
        }
        if (updatedInfo.end_ts !== undefined) {
            if(params.length >= 1){
                sql= sql+', '
            }
            sql = sql + 'end_ts=? '
            params.push(updatedInfo.end_ts)
        }
        if (updatedInfo.status !== undefined) {
            if(params.length >=1  ){
                sql= sql+', '
            }
            sql = sql + 'status=? '
            params.push(updatedInfo.status)
        }

        sql = sql+' WHERE reservation_id=?'
        params.push(reservation_id)
        db.run(sql, params, (err) => {
            if (err) {
                reject(betterError(500, "failed to update in t_reservations", `Failed to updated row ${reservation_id} \n ${err}`));
            } else {
                resolve(`Updated ${reservation_id}`)
            }
        })
    })
}


//endregion

//region Users
async function searchUsers(user_id = null) {
    return new Promise((resolve, reject) => {
        console.log(user_id)
        let sql = 'SELECT * FROM t_users'
        let params = []
        if (user_id) {
            sql = sql + ' WHERE user_id=?'
            params.push(user_id)
        }
        return db.all(sql, params, (err, rows) => {
            if (err) {
                reject(betterError(500, "Could not search users", `failed to search users ${err}`))
            } else {
                if(user_id!==null){
                    resolve(rows[0])
                }else{
                resolve(rows);
            }}
        })
    })
}

async function searchUsersEmail(email) {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM t_users WHERE paperspace_email_address=?'
        let params = [email]
        return db.all(sql, params, (err, rows) => {
            if (err) {
                reject(betterError(500, "Could not search users", `failed to search users ${err}`))
            } else {
                resolve(rows[0])
            }
        })
    })
}

async function insertUser(userData) {
    return new Promise((resolve, reject) => {
        let sql = 'INSERT INTO t_users (user_id, name, email_address, paperspace_email_address, verified_in_paperspace, paperspace_user_id, assigned_machine, reservations) VALUES (?,?,?,?,?,?,?,?)'
        let params = [userData.user_id, userData.name, userData.email_address, userData.paperspace_email_address, userData.verified_in_paperspace, userData.paperspace_user_id, userData.assigned_machine, userData.reservations]
        return db.run(sql, params, (err) => {
            if (err) {
                reject(betterError(500, "failed to insert into t_users", `failed to insert ${userData}`))
            } else {
                resolve("Inserted into reservations")
            }
        })
    })
}

async function updateUser(user_id, updatedInfo) {
    console.log("Starting update")
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM t_users WHERE user_id = ?`, [user_id], (err, rows)=>{
            if(err){
                reject(betterError(500, "error finding user", `Error finding ${user_id}\n${err}`))
            }
            if(rows < 1){
                reject(betterError(404, "User does not exist", `User ${user_id} does not exist in system`))
            }
            if(rows > 1){
                reject(betterError(500, "Multiple rows returned", "multiple rows found for user"))
            }
        })
        let sql = 'UPDATE t_users SET ';
        let params = [];
        if (updatedInfo.email_address !== undefined) {
            if(params.length >= 1){
                sql= sql+', '
            }
            sql = sql + 'email_address=? '
            params.push(updatedInfo.email_address)
        }
        if (updatedInfo.paperspace_email_address !== undefined) {
            if(params.length >= 1){
                sql= sql+', '
            }
            sql = sql + 'paperspace_email_address=? '
            params.push(updatedInfo.paperspace_email_address)
            sql= sql+', '

            sql = sql + 'verified_in_paperspace=? '
            params.push(0)
        }
        if (updatedInfo.verified_in_paperspace !== undefined) {
            if(params.length >= 1){
                sql= sql+', '
            }
            sql = sql + 'verified_in_paperspace=? '
            params.push(updatedInfo.verified_in_paperspace)
        }
        if (updatedInfo.paperspace_user_id !== undefined) {
            if(params.length >= 1){
                sql= sql+', '
            }
            sql = sql + 'paperspace_user_id=? '
            params.push(updatedInfo.paperspace_user_id)
        }
        if (updatedInfo.assigned_machine !== undefined) {
            if(params.length >= 1){
                sql= sql+', '
            }
            sql = sql + 'assigned_machine=? '
            params.push(updatedInfo.assigned_machine)
        }
        if (updatedInfo.reservations !== undefined) {
            if(params.length >= 1){
                sql= sql+', '
            }
            sql = sql + 'reservations=? '
            params.push(updatedInfo.reservations)
        }
        if (params.length < 1) {
            reject(betterError(400, "nothing to update in user", `No updated info for user ${user_id}`));
        }
        sql = sql + 'WHERE user_id=?'
        params.push(user_id)
        db.run(sql, params, (err) => {
            if (err) {
                reject(betterError(500, "failed to update in t_users", `Failed to updated row ${user_id}\n${err}`));
            } else {
                resolve(`Updated ${user_id}`)
            }
        })
    })
}

async function deleteUser(user_id) {
    console.log("Starting delete")
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM t_users WHERE user_id = ?`, [user_id], (err, rows)=>{
            if(err){
                reject(betterError(500, "error finding user", `Error finding ${user_id}\n${err}`))
            }
            if(rows < 1){
                reject(betterError(404, "User does not exist", `User ${user_id} does not exist in system`))
            }
            if(rows > 1){
                reject(betterError(500, "Multiple rows returned", "multiple rows found for user"))
            }
        })
        let sql = 'DELETE FROM t_users WHERE user_id=?';
        let params = [user_id];
        db.run(sql, params, (err) => {
            if (err) {
                reject(betterError(500, "failed to Delete in t_users", `Failed to updated row ${user_id}\n${err}`));
            } else {
                resolve(`Deleted ${user_id}`)
            }
        })
    })
}

//endregion

//region Machine
async function searchMachines(machine_id = null) {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM t_machines'
        let params = []
        if (machine_id) {
            sql = sql + ' WHERE machine_id=?'
            params.push(machine_id)
        }
        return db.all(sql, params, (err, rows) => {
            if (err) {
                reject(betterError(500, "Could not search machines", `failed to search machines ${err}`))
            } else {
                if(machine_id!== null){
                    resolve(rows[0])
                }else{
                resolve(rows);
            }}
        })
    })
}

async function searchOpenMachines() {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM t_machines WHERE in_use=?'
        let params = [0]
        return db.all(sql, params, (err, rows) => {
            if (err) {
                reject(betterError(500, "Could not search machines", `failed to search machines ${err}`))
            } else {
                resolve(rows[0]);
            }
        })
    })
}

async function insertMachine(machineData) {
    return new Promise((resolve, reject) => {
        let sql = 'INSERT INTO t_machines (machine_id, machine_name, in_use, state, assigned_to) VALUES (?,?,?,?,?)'
        let params = [machineData.machine_id, machineData.machine_name, machineData.in_use, machineData.state, machineData.assigned_to]
        return db.run(sql, params, (err) => {
            if (err) {
                reject(betterError(500, "failed to insert into t_machines", `failed to insert ${machineData}`))
            } else {
                resolve("Inserted into machines")
            }
        })
    })
}

async function updateMachine(machine_id, updatedInfo) {
    return new Promise((resolve, reject) => {
        let sql = 'UPDATE t_machines SET ';
        let params = [];
        if (updatedInfo.in_use !== undefined) {
            if(params.length >= 1){
                sql= sql+', '
            }
            sql = sql + 'in_use=? '
            params.push(updatedInfo.in_use)
        }
        if (updatedInfo.state !== undefined) {
            if(params.length >= 1){
                sql= sql+', '
            }
            sql = sql + 'state=? '
            params.push(updatedInfo.state)
        }
        if (updatedInfo.assigned_to !== undefined) {
            if(params.length >= 1){
                sql= sql+', '
            }
            sql = sql + 'assigned_to=? '
            params.push(updatedInfo.assigned_to)
        }
        if (params.length < 1) {
            reject(betterError(400, "nothing to update in machine", `No updated info for machine ${machine_id}`));
        }
        sql = sql + 'WHERE machine_id=?'
        params.push(machine_id)
        db.run(sql, params, (err) => {
            if (err) {
                reject(betterError(500, "failed to update in t_machine", `Failed to updated row ${machine_id}`));
            } else {
                resolve(`Updated ${machine_id}`)
            }
        })
    })
}

async function deleteMachine(machine_id) {
    console.log("Starting delete")
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM t_machine WHERE machine_id = ?`, [machine_id], (err, rows)=>{
            if(err){
                reject(betterError(500, "error finding user", `Error finding ${machine_id}\n${err}`))
            }
            if(rows < 1){
                reject(betterError(404, "Machine does not exist", `User ${machine_id} does not exist in system`))
            }
            if(rows > 1){
                reject(betterError(500, "Multiple rows returned", "multiple rows found for user"))
            }
        })
        let sql = 'DELETE FROM t_machine WHERE machine_id=?';
        let params = [machine_id];
        db.run(sql, params, (err) => {
            if (err) {
                reject(betterError(500, "failed to Delete in t_users", `Failed to updated row ${machine_id}\n${err}`));
            } else {
                resolve(`Deleted ${machine_id}`)
            }
        })
    })
}

//endregion


module.exports = {
    searchReservationsById,
    searchReservationsByStatus,
    insertReservation,
    updateReservation,
    updateReservationInfo,
    searchUsers,
    searchUsersEmail,
    insertUser,
    updateUser,
    deleteUser,
    searchMachines,
    insertMachine,
    updateMachine,
    deleteMachine,
    searchOpenMachines
}
