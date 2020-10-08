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


//TODO Get Session ID

//TODO Set Session Scope with ID

//TODO LOGIN-> Set Session Scope-> Return Session id
