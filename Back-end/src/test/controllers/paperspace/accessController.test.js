const {describe, it} = require("@jest/globals");
const request = require('supertest')
const app = require('../../../../app')

describe('Access Endpoints', () => {
    it('Test base access path', async () => {
        const res = await request(app)
            .get('/access/')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toStrictEqual({msg:"access Controller home"})
    });
})