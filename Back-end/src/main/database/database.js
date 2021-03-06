const sqlite3 = require('sqlite3').verbose()
const md5 = require('md5')

let DBSOURCE = process.env.NODE_ENV==='test' ? "reservationsDBTEST.sqlite" : "reservationsDB.sqlite"


let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.error(err.message)
        throw err
    } else {
        console.log(`Connected to the SQLite database ${DBSOURCE}.`)
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
                        console.log(rows)
                    })
                } else {
                    // Table just created, creating some rows
                    let insert = 'INSERT INTO t_reservations (reservation_id, user_id, start_ts, end_ts, status) VALUES (?,?,?,?,?)'
                    db.run(insert, ["CK-89852", "JBENDE11", "2020-10-08T14:00:00.000000-05:00", "2020-10-08T15:00:00.000000-05:00", "COMPLETE"])
                    console.log('HERE');
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
                        console.log(rows)
                    })
                } else {
                    // Table just created, creating some rows
                    let insert = 'INSERT INTO t_users (user_id, name, email_address, paperspace_email_address, verified_in_paperspace, paperspace_user_id, assigned_machine, reservations) VALUES (?,?,?,?,?,?,?,?)'
                    db.run(insert, ["TEST111", "test user", "test111@depaul.edu", null, 0, null, null, "{[]}"])
                    console.log('HERE');
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
                        console.log(rows)
                    })
                } else {
                    // Table just created, creating some rows
                    let insert = 'INSERT INTO t_machines (machine_id, machine_name, in_use, state, assigned_to) VALUES (?,?,?,?,?)'
                    db.run(insert, ["psfyw98r0", "IRL1", 0, "ready", null])
                    console.log('HERE');
                }
            });
        //endregion
    }
});

//DB INIT Function with all tables and rows


module.exports = db