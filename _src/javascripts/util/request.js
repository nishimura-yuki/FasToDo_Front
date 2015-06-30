var Agent = require('superagent');

module.exports.get = function(field){
    //return Agent.get(field).set(token()).withCredentials();
    return Agent.get(field);
}
module.exports.post = function(field){
    //return Agent.post(field).set(token()).withCredentials();
    return Agent.post(field);
}
module.exports.put = function(field){
    //return Agent.put(field).set(token()).withCredentials();
    return Agent.put(field);
}
module.exports.del = function(field){
    //return Agent.del(field).set(token()).withCredentials();
    return Agent.del(field);
}

var token = function(){
    console.log('token=', localStorage.getItem(settings.token_key));
    return {"X-Auth-Token": localStorage.getItem(settings.token_key)}
}
