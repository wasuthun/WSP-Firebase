var {firestore,cors,successResponseGet,errorResponse} = require('./admin.js')
var ordersRef = firestore.collection('orders')

exports.getOrderList = functions.https.onRequest((req,res) => {
    return cors(req,res,()=>{
        if(req.method === 'GET'){
            var orderList = ordersRef.get()
                .then(snapshot => {
                    let res_data = {}
                    res_data['return_code'] = '200'
                    res_data['descrip'] = 'success to get the list of orders'
                    orders = []
                    snapshot.forEach(doc => {
                        let eachOrder = doc.data()
                        eachOrder['orderID'] = doc.id
                        orders.push(eachOrder)
                    })
                    res_data['orders'] = orders 
                    successResponseGet(res,res_data)
                    return snapshot
                }).catch(err=>{
                    errorResponse(res,err.details)
                })
        } else {
            errorResponse(res,"Error request method")
        }
    })
})