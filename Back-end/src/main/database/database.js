const sqlite3 = require('sqlite3').verbose()
const md5 = require('md5')

const DBSOURCE = "reservationsDB.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.error(err.message)
        throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE t_reservations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text,
            depaul_id text,
            email text UNIQUE,
            paperspace_email text,
            start_ts timestamp,
            end_ts timestamp,
            status text,
            CONSTRAINT email_unique UNIQUE (email)
            )`,
            (err) => {
                if (err) {
                    db.all('SELECT * FROM t_reservations', [], (err, rows)=>{
                        if (err) {
                            console.log(err)
                            return;
                        }
                        console.log(rows)
                    })
                }else{
                    // Table just created, creating some rows
                    let insert = 'INSERT INTO t_reservations (name, depaul_id, email, paperspace_email, start_ts, end_ts, status) VALUES (?,?,?,?,?,?,?)'
                    db.run(insert, ["admin","1912123","admin@example.com","admin@example.com", 1602108000, 1602072000, "completed"])
                    console.log('HERE');
                }
            });
    }
});

//res statuses
//new
//upcoming
//active
//complete
//cancelled
/*
const addReservation = function(entity){
    let insert = 'INSERT INTO t_reservations (name, email, paperspace_email, start_ts, end_ts) VALUES (?,?,?,?,?)'
    db.run(insert, [entity.name,entity.email,entity.paperspace_email, entity.start_ts, entity.end_ts, "new"])
    console.log(`added new reservation for ${entity.name}`);
    //check if email is valid!!!!!
}
*/
//const searchReservations

//const checkReservationsStart

//const changeReservationStatus


/*
*
*
 */


module.exports = db