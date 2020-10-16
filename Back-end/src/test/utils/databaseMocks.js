const sqlite3 = require("sqlite3");

const DBSOURCE = 'reservationsDBTEST.sqlite'

let uId = 1;
let rId = 1;
let mId = 1;

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQLiteTEST database.')
        //region INIT DB
        //Create t_reservations
        db.run(`CREATE TABLE t_reservations (
            reservation_id text PRIMARY KEY,
            user_id text,
            start_ts timestamp,
            end_ts timestamp,
            status text
            )`,
            (err) => {
                if (err) {
                    db.all('SELECT * FROM t_reservations', [], (err, rows) => {
                        if (err) {
                            console.log(err)
                            return;
                        }
                        rId = parseInt(rows[rows.length-1].reservation_id) +1
                        //console.log(rows)
                    })
                } else {
                    // Table just created, creating some rows
                    let insert = 'INSERT INTO t_reservations (reservation_id, user_id, start_ts, end_ts, status) VALUES (?,?,?,?,?)'
                    db.run(insert, ["1", "Test1", "2020-04-08T14:00:00.000000-05:00", "2020-07-08T15:00:00.000000-05:00", "COMPLETE"])
                    //console.log('HERE');
                    rId++
                }
            });

        //Create t_users
        db.run(`CREATE TABLE t_users (
            user_id text PRIMARY KEY,
            name text,
            email_address text,
            paperspace_email_address text,
            verified_in_paperspace integer,
            paperspace_user_id text,
            assigned_machine text,
            reservations text
            )`,
            (err) => {
                if (err) {
                    db.all('SELECT * FROM t_users', [], (err, rows) => {
                        if (err) {
                            console.log(err)
                            return;
                        }
                        uId = parseInt(rows[rows.length-1].user_id) +1
                        //console.log(rows)
                    })
                } else {
                    // Table just created, creating some rows
                    let insert = 'INSERT INTO t_users (user_id, name, email_address, paperspace_email_address, verified_in_paperspace, paperspace_user_id, assigned_machine, reservations) VALUES (?,?,?,?,?,?,?,?)'
                    db.run(insert, ["1", "test U1", "test1@depaul.edu", null, 0, null, null, "{[]}"])
                    //console.log('HERE');
                    uId++

                }
            });

        //Create t_machines
        db.run(`CREATE TABLE t_machines (
            machine_id text PRIMARY KEY,
            machine_name text,
            in_use integer,
            state text,
            assigned_to text
                        )`,
            (err) => {
                if (err) {
                    db.all('SELECT * FROM t_machines', [], (err, rows) => {
                        if (err) {
                            console.log(err)
                            return;
                        }
                        mId = parseInt(rows[rows.length-1].machine_id) +1
                        //console.log(rows)
                    })
                } else {
                    // Table just created, creating some rows
                    let insert = 'INSERT INTO t_machines (machine_id, machine_name, in_use, state, assigned_to) VALUES (?,?,?,?,?)'
                    db.run(insert, ["1", "TEST1", 0, "ready", null])
                    //console.log('HERE');
                    mId++
                }
            });
        //endregion
    }
});

module.exports = [db, mId, rId, uId]

