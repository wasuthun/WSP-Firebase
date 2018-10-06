var {firestore,cors,successResponseGet,errorResponse} = require('./admin.js')
var categoryRef = firestore.collection('categories')

const getCategory = (req,res) => {
    return cors(req,res,()=>{
        if(req.method === 'GET'){
            var categorytList = categoryRef.get()
                .then(snapshot => {
                    let res_data = {}
                    res_data['return_code'] = '200'
                    res_data['descrip'] = 'success to get the list of category'
                    category = []
                    snapshot.forEach(doc => {
                        let type = doc.data()
                        type['categoryID'] = doc.id
                        category.push(type)
                    })
                    res_data['products'] = category 
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

module.exports = getCategory