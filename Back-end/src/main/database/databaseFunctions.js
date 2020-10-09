const db = require('./database');

//TODO SEARCH TABLE
//region Search tables
function searchReservations(reservation_id = null) {
    let sql = 'SELECT * FROM t_reservations'
    let params = []
    if (reservation_id) {
        sql = sql + ' WHERE reservation_id=?'
        params[0] = reservation_id
    }
    return db.all(sql, params, (err, rows) => {
        if (err) {
            //Throw error
        } else {
            return rows;
        }
    })
}

function searchUsers(user_id = null) {
    let sql = 'SELECT * FROM t_users'
    let params = []
    if (user_id) {
        sql = sql + ' WHERE user_id=?'
        params[0] = user_id
    }
    return db.all(sql, params, (err, rows) => {
        if (err) {
            //Throw error
        } else {
            return rows;
        }
    })
}

function searchMachines(machine_id = null) {
    let sql = 'SELECT * FROM t_machines'
    let params = []
    if (machine_id) {
        sql = sql + ' WHERE machine_id=?'
        params[0] = machine_id
    }
    return db.all(sql, params, (err, rows) => {
        if (err) {
            //Throw error
        } else {
            return rows;
        }
    })
}

//endregion

//TODO INSERT TO TABLE

//TODO UPDATE TABLE

//

module.exports = {searchReservations, searchUsers, searchMachines}
