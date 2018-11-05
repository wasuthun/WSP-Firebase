var {firestore,cors,successResponseGet,errorResponse,getCurrentTime,} = require('./admin.js')
var cartRef = firestore.collection('carts')
var orderRef = firestore.collection('orders')
var productRef = firestore.collection('products')
var accountsRef = firestore.collection('accounts')

const addProductToCartByUsername = ((req,res)=>{
    return cors(req,res,() => {
        if(req.method === 'POST'){
            let username = req.get('username')
            let productID = req.get('productID')
            let quantity = req.get('quantity')
            let productPrice = -1
            let productData = {}
            let productName = ""
            
            let addToCart = productRef.doc(productID).get().then(ref => {
                if(ref.exists){
                    let productData = ref.data()
                    productPrice = parseInt(productData['productPrice'])
                    productName = productData['productName']
                }
                return cartRef.doc(username).collection('products').doc(productID).get()
            })
            .then(snap => {
                if(snap.exists){
                    productData = snap.data()
                    let newQuantity = parseInt(productData['quantity'])+parseInt(quantity)
                    productData['quantity'] = newQuantity
                } else {
                    productData['productName'] = productName
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

const removeProductFromCart = ((req,res)=>{
    return cors(req,res,() => {
        if(req.method === 'POST'){
            let username = req.get('username')
            let productID = req.get('productID')
            let quantity = req.get('quantity')
            
            let productInCart = {}

            let removeProduct = cartRef.doc(username).collection('products').doc(productID).get()
            .then(ref => {
                if(ref.exists){
                    productInCart = ref.data()
                    productInCart['quantity'] -= quantity
                    if(productInCart['quantity'] <= 0){
                        return cartRef.doc(username).collection('products').doc(productID).delete()
                    }
                    else {
                        return cartRef.doc(username).collection('products').doc(productID).set(productInCart)
                    }
                }
                else{
                    throw new Error('product not found in '+username+'\'s cart.')
                }
            })
            .then(ref => {
                let res_data = {}
                res_data['return_code'] = '200'
                res_data['descrip'] = 'Success to delete '+productID+' from '+username
                successResponseGet(res,res_data)
                return ref
            }).catch(err=>{
                errorResponse(res,err.details)
            })
    }})
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

const checkoutByUsername = ((req,res)=>{
    return cors(req,res,() => {
        if(req.method === 'POST'){
            let username = req.get('username')
            let products = []
            let promotions = []
            let res_data = {}
            let order_data = {}
            let orderHistory = []
            let amount = 0
            let customerID = "none"
            let accountID = "none"
            let currentTime = getCurrentTime()

            var batch = firestore.batch()

            let a = accountsRef.where('username','==',username).get()
            //check username and get customerid
            .then(snap => {
                if(!snap.empty){
                    snap.forEach(ref => {
                        var customer = ref.data()
                        customerID = customer.customerID
                        orderHistory = customer.orderHistory
                        accountID = ref.id
                    })
                }
                else {
                    throw new Error('Username not found.')
                }
                return cartRef.doc(username).collection('promotions').get()
            })
            //get promotions and remove from cart
            .then(snap => {
                if(!snap.empty){
                    snap.forEach(promotion => {
                        let promotionData = promotion.data()
                        price =  parseInt(promotionData.promotionPrice) * parseInt(promotionData.quantity)
                        amount += price
                        promotions.push(promotionData)
                        batch.delete(promotion.ref)
                    })
                }
                return cartRef.doc(username).collection('products').get()
            })
            //get products in cart and remove from cart then record data to orders.
            .then(snap => {
                snap.forEach(product => {
                    let productData = product.data()
                    price =  parseInt(productData.productPrice) * parseInt(productData.quantity)
                    amount += price                    
                    products.push(productData)
                    batch.delete(product.ref)
                })
                order_data['username'] = username
                order_data['customerID'] = customerID
                order_data['products'] = products
                order_data['promotions'] = promotions
                order_data['orderAmount'] = amount
                order_data['orderDate'] = currentTime
                order_data['orderStatus'] = 'Not paid'

                batch.commit()
                return orderRef.add(order_data)
            })
            .then(ref => {
                orderHistory.push(ref.id)

                res_data['return_code'] = '200'
                res_data['descrip'] = 'Success to checkout the cart of '+username 
                res_data['orderID'] = ref.id
                
                //update order history
                return accountsRef.doc(accountID).update({
                    orderHistory:orderHistory
                })

            })
            .then(ref => {
                successResponseGet(res,res_data)
                return
            })
        }
    })
})

module.exports = {
    addProductToCartByUsername,getCartByUsername,checkoutByUsername,removeProductFromCart,
}
