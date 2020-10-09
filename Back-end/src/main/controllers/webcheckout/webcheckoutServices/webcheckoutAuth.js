const request = require('request')
const {betterError} = require("../../../util/betterError");

/*

var request = require('sync-request');

// Pre 4.5.0 base URI
// var host = "http://localhost/webcheckout";

// Post 4.5.0 base URI
var host = "http://localhost";

var userid = "worker1";
var password = "seekrit";

var checkoutCenter = { _class: 'checkoutCenter', oid: 53207831, name: 'Idea Realization Lab'};

var resourceType = { _class: 'resourceType', oid: 385718885, name: "Virtual Computers"};

var postBody = {};

// ============================================================
// Authenticate to the API
// ============================================================

postBody.sessionid = "";
postBody.userid = userid;
postBody.password = password;

var res = request('POST', host + '/rest/session/start', {json: postBody});
var postRes = JSON.parse(res.body.toString('utf-8'));

// Get my own person object
var me = postRes.payload.agent;

// Extract the session id
var sessionid = postRes.sessionid;

// ============================================================
// Set my session Checkout Center
// ============================================================

postBody = {};
postBody.sessionid = sessionid;
postBody.checkoutCenter = checkoutCenter;

res = request('POST', host + '/rest/session/setSessionScope', {json: postBody});
postRes = JSON.parse(res.body.toString('utf-8'));
 */

//

//TODO Get Session ID
async function getSessionId() {
    return new Promise((resolve, reject) => {
        let postBody = {
            "sessionid": "",
            "userid": `${process.env.WEBCHECKOUT_UN}`,
            "password": `${process.env.WEBCHECKOUT_PWD}`
        }

        let options = {
            headers: {},
            body: JSON.stringify(postBody)
        }
        request.post(`${process.env.WEBCHECKOUT_HOST}/rest/session/start`, options, (err, res) => {
            if (err) {
                reject(betterError(501,"Error in start new session",{res, err}))
            }
            let resBody = JSON.parse(res.body);
            console.log(resBody)
            let sessionid = resBody.session.sessionid
            resolve(sessionid)
        })
    }).catch(err => {
        throw  betterError(500,"Error in get session ID",err);
    })
}

//TODO Set Session Scope with ID
async function setSessionScope(sessionId) {
    return new Promise(((resolve, reject) => {
        let postBody = {
            "sessionid": `${sessionId}`,
            "checkoutCenter": {"_class": "checkoutCenter", "oid": 53207831, "name": "Idea Realization Lab"}
        }
        let options = {
            "headers": {},
            "body": JSON.stringify(postBody)
        }

        request.post(`${process.env.WEBCHECKOUT_HOST}/rest/session/setSessionScope`, options, (err, res) => {
            if (err) {
                reject(betterError(501,"Error in set scope",{res, err}))
            } else {
                process.env.SID = sessionId
                resolve("Successfully set Scope")
            }
        })
    })).catch(err => {
        throw betterError(500,"Error in set session scope",err);
    })
}


//TODO LOGIN-> Set Session Scope-> Return Session id
async function startNewSession() {
    return new Promise((async (resolve, reject) => {
        let sid = await getSessionId()
        setSessionScope(sid).then(res => {
            resolve(res);
        }).catch(err => {
            reject(betterError(500,"Error in start new session",err))
        })
    }))
}

module.exports = {getSessionId, setSessionScope, startNewSession}
