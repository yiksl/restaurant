class BaseModel {
    constructor(data, message){
        //data是数据类型，message是字符串类型，如果只传了字符串就是message
        if(typeof data === 'string'){
            this.message = data
            data = null
            message = null
        }
        if(data){
            this.data = data
        }
        if(message){
            this.message = message
        }
    }
}
//建造两个模型，导出数据
class SuccessModel extends BaseModel {
    constructor(data, message){
        super(data, message)
        this.errno = 0
    }
}

class ErrorModel extends BaseModel {
    constructor(data, message){
        super(data, message)
        this.errno = -1
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}