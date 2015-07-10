var available_locals = ['en-US', 'ja-JP'];
var locals = {};
available_locals.forEach(function(l, idx){
    locals[l] = require('../../locals/' + l + '.json')
});

var lang = 'en-US';
module.exports.setLanguage = function(l){
    for(var i=0;i<available_locals.length;i++){
        if(available_locals[i] == l){
            lang = l;
            return;
        } 
    }
}
module.exports.get = function(key){
    return locals[lang][key];
}
