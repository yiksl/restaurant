//第四层controller层，只关心数据
const { exec } = require('../db/mysql')
const xss = require('xss')
const getList = (page) => {
    let sql = `select * from advice where 1=1 `
    if(page){
        sql += `and page='${page}' `
    }

    // 返回 promise
    return exec(sql)

}

const getDetail = (id, name) => {
    if(id){
        let sql = `select * from advice where id = '${id}' or  Bussiness_name like '%${id}%'`
        return exec(sql).then(rows => {
            return rows[0]
        })
    }
    let sql = `select id from advice where Bussiness_name like '%${name}%'`
    return exec(sql).then(rows => {
        return rows[0]
    })
    
}

const newBlog = (blogData = {}) => {
    //blogData是一个博客对象，包含title content属性
    const title = xss(blogData.title)
    const content = xss(blogData.content)
    const author = blogData.author
    const createTime = Date.now()

    const sql = `
        insert into blogs(title, content, createtime, author)
        values('${title}', '${content}', ${createTime}, '${author}');
    `
    
    return exec(sql).then(insertData => {
        return{
            id:insertData.insertId
        }
    })
    // return[
    //     {
    //         id: 3 //表示新建博客，插入到数据表里面的id
    //     }
    // ]
}

const updateBlog = (id, blogData = {}) => {
    //id:要更新博客的id
    //blogData是一个博客对象，包含title content属性
    const title = blogData.title
    const content = blogData.content

    const sql = `
        update blogs set title='${title}', content='${content}' where id='${id}';
    `
    return exec(sql).then(updateData => {
        //console.log(updateData)
        if(updateData.affectedRows > 0){
            return true
        }
        return false
    })
}

const delBlog = (id, author) => {
    //id 删除博客的id

    const sql = `
        delete from blogs where id = '${id}' and author = '${author}';
    `
    return exec(sql).then(updateData => {
        //console.log(updateData)
        if(updateData.affectedRows > 0){
            return true
        }
        return false
    })
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}