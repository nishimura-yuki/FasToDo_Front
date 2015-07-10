var sprintf = require("sprintf");

module.exports.isBlank = function( str ){
    return (!str || !str.trim()); 
}
module.exports.isNotBlank = function( str ){
    return !module.exports.isBlank(str); 
}

module.exports.isRange = function( str, min, max ){
    if(!str) return false;
    str = str.trim();
    return (str.length >= min && str.length <= max); 
}

var regExpHalfChar = /^[a-zA-Z0-9!-/:-@¥[-`{-~]+$/;
module.exports.isOnlyHalfwidthChar = function( str ){
    return str.match(regExpHalfChar);
}

var regExpEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
module.exports.isEmailFormat = function( str ){
    return str.match(regExpEmail);
}

var regExpDate = /^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/;
module.exports.isDateFormat = function( str ){
    if(!str.match(regExpDate)) return false;
    var d = new Date(str);
    console.log(d);
    //if(Number.isNaN(d.getTime())){ //for ES6
    if(isNaN(d.getTime())){
        return false;
    }
    return true;
}

var validateFuncs = {
    blank: module.exports.isNotBlank,
    range: module.exports.isRange,
    halfChar: module.exports.isOnlyHalfwidthChar,
    email: module.exports.isEmailFormat,
    date: module.exports.isDateFormat
};
module.exports.validate = function( value, methods ){
    for(var i=0;i<methods.length;i++){
         var m = validateFuncs[methods[i].name];
         if(m){
            var arr = [value];
            if(methods[i].args){
                arr = arr.concat(methods[i].args); 
            }
            if(!m.apply(this,arr)){
                 return methods[i].message;
            }
         } 
    }
    return null;
};

//== special for app

module.exports.taskTitle = function( title ){
    return module.exports.validate( title ,
                                    [ 
                                        {name:"blank",message:sprintf( Messages.get("error").required, Messages.get("app").task_title)}
                                    ]);
};

module.exports.taskDate = function( date , days){
    return module.exports.validate( date ,
                                    [
                                        {name:"blank",message:sprintf( Messages.get("error").required, Messages.get("app").task_date)},
                                        {name:"date",message:Messages.get("error").date}
                                    ]);
};

module.exports.folder = function( folderid, folders ){

}
