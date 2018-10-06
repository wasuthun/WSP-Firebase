const functions = require('firebase-functions');
const admin = require('firebase-admin')
const cors = require('cors')({origin: true});

admin.initializeApp(functions.config().firebase)

var firestore = admin.firestore()

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
module.exports = {
    firestore,cors,functions,errorResponse,successResponseGet,
}