const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')

const login = (username, password)=> {
    //防止sql注入
    //有escape函数在下面引用的时候就不需要单引号了
    username=escape(username)
    

    //生成加密密码
    password = genPassword(password)
    password=escape(password)

    const sql = `
        select username, realname from users where username=${username} and password=${password};
    `
    //返回的都是数组的形式，但是在这里只会返回一个元素
    return exec(sql).then(rows => {
        return rows[0] || {}
    })
}
module.exports = {
    login
}