var {firestore,cors,successResponseGet,errorResponse} = require('./admin.js')
var feedbackRef = firestore.collection('feedback')

const getFeedbackList = function (req,res) {
    return cors(req,res,()=>{
        if(req.method === 'GET'){
            var customersList = feedbackRef.get()
                .then(snapshot => {
                    let res_data = {}
                    res_data['return_code'] = '200'
                    res_data['descrip'] = 'success to get feedback list.'
                    feedbacks = []
                    snapshot.forEach(doc => {
                        let eachFeedback = doc.data()
                        eachFeedback['feedbackID'] = doc.id
                        feedbacks.push(eachFeedback)
                    })
                    res_data['feedbacks'] = feedbacks 
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

const addFeedback = function (req,res){
    return cors(req,res,()=>{
        if(req.method === 'POST'){
            let username = req.get('name')
            let feedback = req.get('feedback')

            let data = {}
            data['username'] = username
            data['feedback'] = feedback
            var addFeedback = feedbackRef.add(data).then(ref => {
                let res_data = {}
                res_data['return_code'] = '200'
                res_data['descrip'] = 'Success to write on db'
                res_data['feedbackID'] = ref.id
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

module.exports = {
    getFeedbackList,addFeedback,
}