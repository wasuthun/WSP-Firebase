var {firestore,cors,successResponseGet,errorResponse} = require('./admin.js')
var accountsRef = firestore.collection('accounts')
var customerRef = firestore.collection('customers')

const isUsernameTaken = function (req,res){
    return cors(req,res,()=>{
        if(req.method === 'POST'){
            let username = req.get('username')
            let res_data = {}
            let checkAccount = accountsRef.where('username','==',username).get()
                .then(snap => {
                    if(!snap.empty){
                        res_data['return_code'] = "400"
                        res_data['descrip'] = 'Username is already taken.'                        
                    } else {
                        res_data['return_code'] = "200"
                        res_data['descrip'] = 'Username is available.'
                    }
                    successResponseGet(res,res_data)
                    return
                })
        } else {
            errorResponse(res,"Error request method")
        }
    })
}

const isEmailTaken = function (req,res){
    return cors(req,res,()=>{
        if(req.method === 'POST'){
            let email = req.get('email')
            let res_data = {}
            let checkAccount = accountsRef.where('email','==',email).get()
                .then(snap => {
                    if(!snap.empty){
                        res_data['return_code'] = "400"
                        res_data['descrip'] = 'Email is already taken.'                        
                    } else {
                        res_data['return_code'] = "200"
                        res_data['descrip'] = 'Email is available.'
                    }
                    successResponseGet(res,res_data)
                    return
                })
        } else {
            errorResponse(res,"Error request method")
        }
    })
}

const getAccountList = function (req,res){
    return cors(req,res,()=>{
        if(req.method ==='GET'){
            let res_data = {}
            res_data['return_code'] = "200"
            res_data['descrip'] = 'success to get the list of accounts.'
            res_data['accounts'] = []
            let getAccount = accountsRef.get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let eachAcount = doc.data()
                        eachAcount['accountID'] = doc.id
                        res_data['accounts'].push(eachAcount)
                    })
                    successResponseGet(res,res_data)
                    return res_data
                }).catch(err=>{
                    errorResponse(res,err.details)
                })
        } 
        else {
            errorResponse(res,"Error request method")
        }
    })
}

const addAccount = function (req,res){
    return cors(req,res,()=>{
        if(req.method === 'POST'){
            let username = req.get('username')
            let password = req.get('password')
            let email = req.get('email')
            let name = req.get('name')
            let gender = req.get('gender')
            let bday = req.get('bday')
            let address = req.get('address')
            let province = req.get('province')
            let district = req.get('district')
            let zipCode = req.get('zipCode')
            let phone = req.get('phone')
            let point = 0
            let orderHistory = []

            let customerID = 0
            let checkAccount = accountsRef.where('username','==',username).get()
            .then(snap =>{
                if(!snap.empty){
                    errorResponse(res,"Username already taken")
                    Promise.break
                }
                return
            }).then(() => {
                let data = {
                    'name':name,
                    'email':email,
                    'gender':gender,
                    'phone':phone,
                    'bday':bday,
                    'address':address,
                    'province':province,
                    'district':district,
                    'zipCode':zipCode
                } 
                return customerRef.add(data)
            })
            .then(ref => {
                customerID = ref.id
                let data = {
                    'username':username,
                    'password':password,
                    'email':email,
                    'customerID':customerID,
                    'point':point,
                    'orderHistory':orderHistory
                } 
                return accountsRef.add(data)
            })
            .then(() => {
                let res_data = {}
                        res_data['return_code'] = '200'
                        res_data['descrip'] = 'Success to write on db'
                        res_data['username'] = username
                        successResponseGet(res,res_data)
                        return
            })
        }  else {
            errorResponse(res,"Error request method")
        }
    })
}

const login = function (req,res){
    return cors(req,res,()=>{
        if(req.method==='POST'){
            let username = req.get('username')
            let password = req.get('password')

            var account = accountsRef.where('username','==',username).where('password','==',password).get().then(snap=>{
                let res_data = {}
                if(!snap.empty){
                    res_data['return_code'] = '200'
                    res_data['descrip'] = 'login success'
                    snap.forEach(doc=>{
                        res_data['account'] = doc.data() 
                        delete res_data['account'].password
                    })
                } else {
                    res_data['return_code'] = '400'
                    res_data['descrip'] = 'wrong username or password'
                }
                successResponseGet(res,res_data)
                return snap
            }).catch(err=>{
                errorResponse(res,err.details)
            })
        }
        else {
            errorResponse(res,"Error request method")
        }
    })
}

const getAccountByUsername = function (req,res){
    return cors(req,res,()=>{
        if(req.method==='POST'){
            let username = req.get('username')

            var account = accountsRef.where('username','==',username).get().then(snap=>{
                let res_data = {}
                
                if(!snap.empty){
                    res_data['return_code'] = '200'
                    res_data['descrip'] = 'Success to query account from username.'
                    snap.forEach(doc=>{
                        res_data['account'] = doc.data() 
                        delete res_data['account'].password
                    })
                } else {
                    res_data['return_code'] = '400'
                    res_data['descrip'] = 'Username not founded.'
                }
                successResponseGet(res,res_data)
                return snap
            }).catch(err=>{
                errorResponse(res,err.details)
            })
        }
        else {
            errorResponse(res,"Error request method")
        }
    })
}

const loginToAdmin = function (req,res){
    return cors(req,res,()=>{
        if(req.method==='POST'){
            let username = req.get('username')
            let password = req.get('password')

            var account = accountsRef.where('username','==',username).where('password','==',password).where('isAdmin','==',true).get().then(snap=>{
                let res_data = {}
                if(!snap.empty){
                    res_data['return_code'] = '200'
                    res_data['descrip'] = 'Login to administration mode success.'
                    snap.forEach(doc=>{
                        res_data['account'] = doc.data().username 
                        delete res_data['account'].password
                        delete res_data['account'].isAdmin
                    })
                } else {
                    res_data['return_code'] = '400'
                    res_data['descrip'] = 'Login to administration mode failed.'
                }
                successResponseGet(res,res_data)
                return snap
            }).catch(err=>{
                errorResponse(res,err.details)
            })
        }
        else {
            errorResponse(res,"Error request method")
        }
    })
}

module.exports = {
    addAccount,isUsernameTaken,isEmailTaken,getAccountList,login,getAccountByUsername,loginToAdmin,
}


