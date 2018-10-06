const {functions,cors,firestore,successResponseGet,errorResponse,} = require('./admin.js')

const getCategory = require('./category')
const {getCustomerList,getCustomer,updateCustomerInfo,addCustomer,} = require('./customer.js')
const {addAccount,isUsernameTaken,isEmailTaken,getAccountList,login,getAccountByUsername,} = require('./account.js')
const {addProduct,getProductList,} = require('./product.js')
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

var productsRef = firestore.collection('products')

//Account
exports.addAccount = functions.https.onRequest(addAccount)
exports.isUsernameTaken = functions.https.onRequest(isUsernameTaken)
exports.isEmailTaken = functions.https.onRequest(isEmailTaken)
exports.getAccountList = functions.https.onRequest(getAccountList)
exports.login = functions.https.onRequest(login)
exports.getAccountByUsername = functions.https.onRequest(getAccountByUsername)

//Customer
exports.getCustomerList = functions.https.onRequest(getCustomerList)
exports.addCustomer = functions.https.onRequest(addCustomer)
exports.updateCustomerInfo = functions.https.onRequest(updateCustomerInfo)
exports.getCustomer = functions.https.onRequest(getCustomer)

//Product
exports.addProduct = functions.https.onRequest(addProduct)
exports.getProductList = functions.https.onRequest(getProductList)

//Category
exports.getCategory = functions.https.onRequest(getCategory)

//Orders




