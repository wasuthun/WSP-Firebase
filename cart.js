var {firestore,cors,successResponseGet,errorResponse} = require('./admin.js')
var cartRef = firestore.collection('carts')
var productRef = firestore.collection('products')


const addProductToCartByUsername = ((req,res)=>{
    return cors(req,res,() => {
        if(req.method === 'POST'){
            let username = req.get('username')
            let productID = req.get('productID')
            let quantity = req.get('quantity')
            let productPrice = -1
            let productData = {}
            
            let addToCart = productRef.doc(productID).get().then(ref => {
                if(ref.exists){
                    let productData = ref.data()
                    productPrice = parseInt(productData['productPrice']) * parseInt(quantity)
                }
                return cartRef.doc(username).collection('products').doc(productID).get()
            })
            .then(snap => {
                if(snap.exists){
                    productData = snap.data()
                    let newQuantity = parseInt(productData['quantity'])+parseInt(quantity)
                    let newProductPrice = parseInt(productData['productPrice'])+parseInt(productPrice)
                    productData['quantity'] = newQuantity
                    productData['productPrice'] = newProductPrice
                } else {
                    productData['productID'] = productID
                    productData['quantity'] = quantity
                    productData['productPrice'] = productPrice
                }
                return cartRef.doc(username).collection('products').doc(productID).set(productData)
            })
            .then(ref => {
                let res_data = {}
                res_data['return_code'] = '200'
                res_data['descrip'] = 'Success to write on db'
                successResponseGet(res,res_data)
                return ref.id
            }).catch(err=>{
                errorResponse(res,err.details)
            })
        }
    })
})

const getCartByUsername = ((req,res)=>{
    return cors(req,res,() => {
        if(req.method === 'POST'){
            let username = req.get('username')
            let cart = []
            let res_data = {}
            let getCart = cartRef.doc(username).get()
            .then(ref => {
                    res_data['username'] = username
                    return cartRef.doc(username).collection('products').get()
            })
            .then(snap => {
                if(snap !== null){
                    snap.forEach(product => {
                        let productData = product.data()
                        cart.push(productData)
                    })
                    res_data['return_code'] = '200'
                    res_data['descrip'] = 'Success to find cart of username' 
                    res_data['cart'] = cart
                    successResponseGet(res,res_data)  
                }
                return
            }).catch(error=>{
                res_data['return_code'] = '400'
                res_data['descrip'] = 'Cart not found for this username' 
                successResponseGet(res,res_data)
            })
        }
    })
})

module.exports = {
    addProductToCartByUsername,getCartByUsername,
}
