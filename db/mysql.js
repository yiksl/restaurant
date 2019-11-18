const mysql = require('mysql')
const { MYSQL_CONF } = require('../conf/db')

//创建连接对象
const con = mysql.createConnection(MYSQL_CONF)

//开始连接
con.connect()

//统一执行sql函数
function exec(sql){
    const promise = new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if(err){
                reject(err)
                return
            }
            resolve(result)
        })
    })
    return promise
}
//不用con.end()关闭，不然定义完这个函数后就直接关了，就让这个连接一直开着，就可以多次调用这个函数
module.exports = {
    exec, 
    escape: mysql.escape
}