const {functions,cors,firestore,successResponseGet,errorResponse,} = require('./admin.js')

const getCategory = require('./category')
const {getCustomerList,getCustomer,updateCustomerInfo,addCustomer,} = require('./customer.js')
const {getFeedbackList,addFeedback} = require('./feedback.js')
const {addAccount,isUsernameTaken,isEmailTaken,getAccountList,login,getAccountByUsername,loginToAdmin,} = require('./account.js')
const {addProduct,getProductList,getProductListByCategoryname} = require('./product.js')
const {addProductToCartByUsername,getCartByUsername,checkoutByUsername} = require('./cart.js')

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
exports.loginToAdmin = functions.https.onRequest(loginToAdmin)
exports.getAccountByUsername = functions.https.onRequest(getAccountByUsername)

//Customer
exports.getCustomerList = functions.https.onRequest(getCustomerList)
exports.addCustomer = functions.https.onRequest(addCustomer)
exports.updateCustomerInfo = functions.https.onRequest(updateCustomerInfo)
exports.getCustomer = functions.https.onRequest(getCustomer)

//Product
exports.addProduct = functions.https.onRequest(addProduct)
exports.getProductList = functions.https.onRequest(getProductList)
exports.getProductListByCategoryname = functions.https.onRequest(getProductListByCategoryname)

//Category
exports.getCategory = functions.https.onRequest(getCategory)

//Orders

//carts
exports.addProductToCartByUsername = functions.https.onRequest(addProductToCartByUsername)
exports.getCartByUsername = functions.https.onRequest(getCartByUsername)
exports.checkoutByUsername = functions.https.onRequest(checkoutByUsername)

//feedback
exports.getFeedbackList = functions.https.onRequest(getFeedbackList)
exports.addFeedback = functions.https.onRequest(addFeedback)






