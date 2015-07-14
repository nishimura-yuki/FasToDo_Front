
require("./../../stylesheets/common.css");
var sprintf = require("sprintf");

module.exports = React.createClass({
    propTypes: {
        date: React.PropTypes.instanceOf(Date),
        today: React.PropTypes.instanceOf(Date).isRequired,
        tomorrow: React.PropTypes.instanceOf(Date).isRequired,
        top: React.PropTypes.number.isRequired,
        left: React.PropTypes.number.isRequired,
        onDecide: React.PropTypes.func.isRequired
    },
    getInitialState: function(){
        var currentDate = null;
        var baseDate    = null;
        if(this.props.date){
            currentDate = baseDate = this.props.date;
        }else{
            currentDate = baseDate = new Date();
        }
        return {
            baseDate: baseDate,
            currentDate: currentDate 
        };
    },    
/*
    componentDidMount: function(){
        console.log("calendar did mount");
    },
    componentWillMount: function(){
        console.log("calendar mount");
    },
    componentWillUnmount: function(){
        console.log("calendar unmount");
    },
*/

    _preventDefault: function(event){
        console.log("prevent def");
        event.preventDefault(); 
    },
    _onClickDate: function( year, month, date ){
        var d = sprintf("%4d/%02d/%02d", year, month, date); 
        console.log( d ); 
        this.props.onDecide( d );
    },

    _onClickPrev: function(event){
        event.preventDefault();
        var currentDate = this.state.currentDate;
        var month = (currentDate.getMonth()+1);
        var year  = currentDate.getFullYear();
        var lastMonth = this.getLastMonth( year, month );
        
        this.setNewDate( lastMonth );
    },
    _onClickNext: function(event){
        event.preventDefault();
        var currentDate = this.state.currentDate;
        var month = (currentDate.getMonth()+1);
        var year  = currentDate.getFullYear();
        var nextMonth = this.getNextMonth( year, month );
       
        this.setNewDate( nextMonth );
    },

    _onClickToday: function(){
    
    },
    _onClickTomorrow: function(){
    
    },

    setNewDate: function( monthInfo ){
        var currentDate = this.state.currentDate;
        var date = currentDate.getDate();
        var last_date = monthInfo.last.getDate();        
        if(last_date < date){
            date = last_date; 
        }
        var newDate = new Date( monthInfo.year, monthInfo.month-1, date );
        this.setState( {currentDate: newDate } ); 
    },

    getLastMonth: function(year, month){
        var prevMonth = month - 1;
        var prevYear = year;
        if(prevMonth <= 0){
            prevMonth = 12; 
            prevYear--;
        }
        return this.getMonthInfo( prevYear, prevMonth );
    },
    getNextMonth: function(year, month){
        var nextMonth = month + 1;
        var nextYear = year;
        if(nextMonth > 12){
            nextMonth = 1; 
            nextYear++;
        }
        return this.getMonthInfo( nextYear, nextMonth );
    },
    getMonthInfo: function( year, month ){
        //month will expect between 1 and 12 
        var first = new Date(year, month - 1, 1);
        var last = new Date(year, month, 0);
        return {first: first, last: last, year: year, month:month};
    },

    createDayRow: function(){
        var local_day = Messages.get("calendar").day;
        return (
                <tr>
                  <th className="calendar-ui-table-day_sunday">{local_day.sunday}</th>   
                  <th className="calendar-ui-table-day_weekday">{local_day.monday}</th>   
                  <th className="calendar-ui-table-day_weekday">{local_day.tuesday}</th>   
                  <th className="calendar-ui-table-day_weekday">{local_day.wednesday}</th>   
                  <th className="calendar-ui-table-day_weekday">{local_day.thursday}</th>   
                  <th className="calendar-ui-table-day_weekday">{local_day.friday}</th>   
                  <th className="calendar-ui-table-day_saturday">{local_day.saturday}</th>   
                </tr>
               ); 
    },
    createFirstRow: function(lastMonth, currMonth){
        var first_day = currMonth.first.getDay();
        var last_date = lastMonth.last.getDate();        
        var tdList = [];
        for(var i=0; i<first_day; i++){
            var date = (last_date-first_day+(i+1));
            tdList.push( this.createTd(lastMonth.year, lastMonth.month, date, "calendar-ui-table-date_out") );
        }
        var count = 1;
        for(var i=first_day; i<7; i++){
            tdList.push( this.createTd(currMonth.year, currMonth.month, count, "calendar-ui-table-date_in") );
            count++;
        }
        return (<tr>
                    {tdList}
                </tr>
               );
    },

    createMiddleRow: function(currMonth, nextMonth){
        var first_day = currMonth.first.getDay();
        var last_date = currMonth.last.getDate();        
       
        var first_date = (8-first_day);

        var trList = [];
        var count = first_date;
        var month = currMonth;
        var className = "calendar-ui-table-date_in";
        for(var i=0;i<4;i++){
            var tdList = [];
            for( var j=0;j<7;j++ ){
                if(count > last_date){
                    count = 1; 
                    month = nextMonth;
                    className = "calendar-ui-table-date_out";
                }
                tdList.push( this.createTd(month.year, month.month, count, className) ); 
                count++;
            }
            trList.push( (<tr>
                            {tdList} 
                         </tr>) );
        }

        return trList;
    
    },
    createLastRow: function(currMonth, nextMonth){
        var first_day = currMonth.first.getDay();
        var last_date = currMonth.last.getDate();        
        var dateMod = (first_day + last_date) - 35;
        var tdList = [];

        for(var i=0; i<dateMod; i++){
            tdList.push( this.createTd(currMonth.year, currMonth.month, (last_date-dateMod+1), "calendar-ui-table-date_in") );
        }
        var loopCount = dateMod > 0 ? (7-dateMod) : 7;
        var count = dateMod > 0 ? 1 : (1-dateMod);
        for(var i=0; i<loopCount; i++){
            tdList.push( this.createTd(nextMonth.year, nextMonth.month, count, "calendar-ui-table-date_out") );
            count++;
        }
        return (<tr>
                    {tdList}
                </tr>
               );  
    },
    createTd: function( year, month, date , className ){
        var baseYear  = this.state.baseDate.getFullYear();
        var baseMonth = (this.state.baseDate.getMonth()+1);
        var baseDate  = this.state.baseDate.getDate();
        if( baseYear == year && baseMonth == month && baseDate == date ){
            className = "calendar-ui-table-date_base"; 
        }
        return (<td className={className} 
                    onClick={this._onClickDate.bind(this, year, month, date)}>
                    {date}
                </td>);
    },

    render: function(){

        var currentDate = this.state.currentDate;
        var month = (currentDate.getMonth()+1);
        var year  = currentDate.getFullYear();
        var currMonth = this.getMonthInfo( year, month );
        var lastMonth = this.getLastMonth( year, month );
        var nextMonth = this.getNextMonth( year, month );

        var style = {
            top: this.props.top,
            left: this.props.left
        };
        
        return (
            <div className="calendar-ui" style={style} onMouseDown={this._preventDefault} >

                <table className="calendar-ui_table">
                    <caption >
                        <div className="calendar-ui-table_caption">
                            <div className="calendar-ui-table-caption_info">
                                <p>{year}</p>
                                <p>{Messages.get("calendar").month[month]}</p>
                            </div>
                            <div className="calendar-ui-table-caption_prev" >
                                <a onClick={this._onClickPrev} href="#" >←</a>
                            </div>
                            <div className="calendar-ui-table-caption_next" >
                                <a onClick={this._onClickNext} href="#" >→</a>
                            </div>
                        </div>
                    </caption>
                    <tbody>
                        {this.createDayRow()}
                        {this.createFirstRow(lastMonth, currMonth, currentDate.getDate())}
                        {this.createMiddleRow(currMonth, nextMonth, currentDate.getDate())}
                        {this.createLastRow(currMonth, nextMonth, currentDate.getDate())}
                    </tbody>
                </table>
            </div>
        ); 
    }
    /*
                <div className="calendar-ui_relative">
                    <div className="calendar-ui-relative_today">
                        Today
                    </div>
                    <div className="calendar-ui-relative_tomorrow">
                        Tomorrow
                    </div>
                </div>
                */
}); 
