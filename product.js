var {firestore,cors,successResponseGet,errorResponse} = require('./admin.js')
var productsRef = firestore.collection('products')

const getProductList = (req,res) => {
    return cors(req,res,()=>{
        if(req.method === 'GET'){
            var productList = productsRef.get()
                .then(snapshot => {
                    let res_data = {}
                    res_data['return_code'] = '200'
                    res_data['descrip'] = 'success to get the list of products'
                    products = []
                    snapshot.forEach(doc => {
                        let eachProduct = doc.data()
                        eachProduct['productID'] = doc.id
                        products.push(eachProduct)
                    })
                    res_data['products'] = products 
                    successResponseGet(res,res_data)
                    return snapshot
                }).catch(err=>{
                    errorResponse(res,err.details)
                })
        }else {
            errorResponse(res,"Error request method")
        }
    })
}

const addProduct = (req,res) => {
    return cors(req,res,() => {
        if(req.method === 'POST'){

            let productName = req.get('name')
            let productPrice = req.get('price')
            let categoryID = req.get('categoryID')
            let productDetail = req.get('detail')

            let data = {}
            data['productName'] = productName
            data['productPrice'] = productPrice
            data['productDetail'] = productDetail
            data['categoryID'] = categoryID

            var productAdded = productsRef.add(data).then(ref => {
                let res_data = {}
                res_data['return_code'] = '200'
                res_data['descrip'] = 'Success to write on db'
                res_data['productID'] = ref.id
                successResponseGet(res,res_data)
                return
            }).catch(err=>{
                errorResponse(res,err.details)
            })
        }else {
            errorResponse(res,"Error request method")
        }
    })
}

module.exports = {
    addProduct,getProductList,
}