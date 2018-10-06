var {firestore,cors,successResponseGet,errorResponse} = require('./admin.js')
var customerRef = firestore.collection('customers')

const getCustomerList = function (req,res) {
    return cors(req,res,()=>{
        if(req.method === 'GET'){
            var customersList = customerRef.get()
                .then(snapshot => {
                    let res_data = {}
                    res_data['return_code'] = '200'
                    res_data['descrip'] = 'success to get the list of customers'
                    customers = []
                    snapshot.forEach(doc => {
                        let eachCustomer = doc.data()
                        eachCustomer['customerID'] = doc.id
                        customers.push(eachCustomer)
                    })
                    res_data['customers'] = customers 
                    successResponseGet(res,res_data)
                    return snapshot
                }).catch(err=>{
                    errorResponse(res,err.details)
                })
        } else {
            errorResponse(res,"Error request method")
        }
    })
}
const getCustomer = function(req,res){
    return cors(req,res,()=>{
        if(req.method === 'POST'){
            let customerID = req.get('customerID')
            var customer = customerRef.doc(customerID).get().then(doc=>{
                let res_data = {}
                if(doc.exists){
                    res_data['return_code'] = '200'
                    res_data['descrip'] = 'success to find customer'
                    res_data['customer'] = doc.data()
                } else{
                    res_data['return_code'] = '400'
                    res_data['descrip'] = 'failed to find customer'
                }
                successResponseGet(res,res_data)
                return doc
            }).catch(err=>{
                errorResponse(res,err.details)
            })
        }else {
            errorResponse(res,"Error request method")
        }
    })
}
const addCustomer = function (req,res){
    return cors(req,res,()=>{
        if(req.method === 'POST'){
            let customerName = req.get('name')
            let customerPhone = req.get('phone')
            let customerAddress = req.get('address')
            let customerEmail = req.get('email')
            let orderHistory = []

            let data = {}
            data['customerName'] = customerName
            data['customerPhone'] = customerPhone
            data['customerAddress'] = customerAddress
            data['customerEmail'] = customerEmail
            data['orderHistory'] = orderHistory
            var addCustomer = customerRef.add(data).then(ref => {
                let res_data = {}
                res_data['return_code'] = '200'
                res_data['descrip'] = 'Success to write on db'
                res_data['customerID'] = ref.id
                successResponseGet(res,res_data)
                return ref.id
            }).catch(err=>{
                errorResponse(res,err.details)
            })
        }else {
            errorResponse(res,"Error request method")
        }
    })
}

const updateCustomerInfo = function (req,res){
    return cors(req,res,()=>{
        if(req.method === 'POST'){
            let customerID = req.get('customerID')
            let customerName = req.get('name')
            let customerPhone = req.get('phone')
            let customerAddress = req.get('address')
            let customerEmail = req.get('email')

            let changeCustomerInfo = customerRef.doc(customerID).update({
                'customerName':customerName,
                'customerPhone':customerPhone,
                'customerAddress':customerAddress,
                'customerEmail':customerEmail
            }).then(ref=>{
                res_data={}
                res_data['return_code'] = '200'
                res_data['descrip'] = 'success to update the data'

                successResponseGet(res,res_data)
                return ref
            }).catch(err=>{
                errorResponse(res,err.details)
            })
        }else {
            errorResponse(res,"Error request method")
        }
    })
}
module.exports = {
    getCustomerList,getCustomer,updateCustomerInfo,addCustomer,
}