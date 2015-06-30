module.exports = DateCalculator;

var MINUTES_OF_A_DAY    = 60 * 24 * 1;
var MINUTES_OF_TWO_DAYS = 60 * 24 * 2;

function DateCalculator( offset ){
    this.offset = offset;
}

DateCalculator.prototype.getCurrentDatetime = function(){
    return getCurrentDatetime( this.offset );
}

DateCalculator.prototype.getToday = function(){
    var d = getCurrentDatetime( this.offset );
    return DateCalculator.getDateFormat(d);
}

DateCalculator.prototype.getTomorrow = function(){
    var d = getCurrentDatetime( this.offset + MINUTES_OF_A_DAY);
    return DateCalculator.getDateFormat(d);
}

DateCalculator.prototype.getDAT = function(){ //DayAfterTomorrow
    var d = getCurrentDatetime( this.offset + MINUTES_OF_TWO_DAYS );
    return DateCalculator.getDateFormat(d);
}

DateCalculator.prototype.getDate = function( add ){ 
    var d = getCurrentDatetime( this.offset + (MINUTES_OF_A_DAY*add) );
    return DateCalculator.getDateFormat(d);
}

DateCalculator.getDateFormat = function( d ){
    return d.getFullYear() + "/" + (d.getMonth()+1) + "/" + d.getDate(); 
}

//== private

function getCurrentDatetime( offset ){
   var localDate = new Date(); 
   var utcDate = new Date( localDate.getTime() + localDate.getTimezoneOffset() * 60000 ); 
   return new Date( utcDate.getTime()  + offset * 60000);
}

