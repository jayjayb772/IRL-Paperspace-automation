const {describe, it, beforeEach} = require("@jest/globals");
const request = require('supertest')
const app = require('../../../../app')
const {searchOpenMachines} = require("../../../main/database/databaseFunctions");
const {listUsers, setMachineAccess} = require('../../../main/controllers/paperspace/paperspaceUtils')
const {addUser} = require('./../../utils/databaseMocks')
let db = require('./../../utils/databaseMocks')




jest.mock('../../../main/controllers/paperspace/paperspaceUtils')
// jest.mock('../../../main/database/databaseFunctions')
listUsers.mockResolvedValue(db.all('SELECT * FROM t_users where user_id="1"', [], (err, rows)=>{return rows}))
// searchOpenMachines.mockResolvedValue({
//     "machine_id": "TEST",
//     "machine_name": "IRLTEST",
//     "in_use": 0,
//     "state": "ready",
//     "assigned_to": null
// })
setMachineAccess.mockResolvedValue({})
addUser()
db.all('SELECT * FROM t_users', [], (err, rows)=>{console.log(rows)})



describe('Access Endpoints', () => {
    it('Test base access path', async () => {
        const res = await request(app)
            .get('/access/')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toStrictEqual({msg:"access Controller home"})
    });

    it('Test give access', async () => {
        let reqBod = {
            name:"Ja",
            email:"jayjayb100@msn.com"
        }
        const res = await request(app)
            .post('/access/give-access-from-email')
            .send(reqBod)
        expect(res.statusCode).toEqual(200)
        expect(res.text).toEqual('Gave jayjayb100@msn.com access to paperspace machine TEST')
        expect(db.all('SELECT * FROM t_users', [], (err, rows)=>{
            return {
                err:err,
                rows:JSON.stringify(rows)
            }
        })).toEqual({err:undefined, rows:[{"lol":"111"}]})
    });
})