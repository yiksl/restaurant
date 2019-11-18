var express = require('express');
var router = express.Router();
const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel }  = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

router.get('/list', (req, res, next) =>{
    let page = req.query.page || ''

    const result = getList(page)
    //返回的也是个promise
    return result.then(listData => {
        res.json(
            new SuccessModel(listData)
        )
    })
});

//不是用express框架的时候，所有的都要用函数把json转成string返回，因为http底层不支持json格式
router.get('/detail', (req, res, next) =>{
    let id = req.query.id
    let name= req.query.name
    const result = getDetail(id, name)
    return result.then(data => {
        res.json(
            new SuccessModel(data)
        )
    })
});


module.exports = router;