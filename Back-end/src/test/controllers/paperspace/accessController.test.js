const {describe, it} = require("@jest/globals");
const request = require('supertest')
const app = require('../../../../app')
const {searchOpenMachines} = require("../../../main/database/databaseFunctions");
const {listUsers, setMachineAccess} = require('../../../main/controllers/paperspace/paperspaceUtils')
jest.mock('../../../main/controllers/paperspace/paperspaceUtils')
jest.mock('../../../main/database/databaseFunctions')
listUsers.mockResolvedValue([{
    "id": "u2r5shka",
    "email": "jayjayb100@msn.com",
    "firstname": null,
    "lastname": null,
    "isAdmin": true,
    "isOwner": false,
    "dtCreated": "2020-09-17T15:07:31.980Z",
    "teamId": "teof8hqgn"
}])
searchOpenMachines.mockResolvedValue({
    "machine_id": "TEST",
    "machine_name": "IRLTEST",
    "in_use": 0,
    "state": "ready",
    "assigned_to": null
})
setMachineAccess.mockResolvedValue({})


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
    });
})