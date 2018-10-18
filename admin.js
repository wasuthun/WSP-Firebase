const functions = require('firebase-functions');
const admin = require('firebase-admin')
const cors = require('cors')({origin: true});

admin.initializeApp(functions.config().firebase)
var firestore = admin.firestore()
firestore.settings({timestampsInSnapshots: true})

//in minute
const THDifTimeZone = 420

function errorResponse(res,errMsg){
    res.contentType('application/json')
    let res_data = {}
    res_data['return_code'] = "500"
    res_data['descrip'] = errMsg
    res.send(JSON.stringify(res_data))
}

function successResponseGet(res,data){
    res.contentType('application/json')
    res.send(JSON.stringify(data))
}

function getCurrentTime() {
    var now = new Date()
    var timeTH = new Date(now.valueOf() + THDifTimeZone * 60000);
    return timeTH.toLocaleString()
}

module.exports = {
    firestore,cors,functions,errorResponse,successResponseGet,getCurrentTime,
}