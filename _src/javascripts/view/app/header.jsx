
var DateCalculator = require("./../../common/DateCalculator.js");

// Header
module.exports = React.createClass({
    _init_state: {
        data: {}, loaded: false
    },
    getInitialState: function () {
        return this._init_state
    },
    componentDidMount: function () {
        this.loadHeaderData();
    },
    _changeDate: function(){
        console.log("change!!!"); 
    },
    loadHeaderData: function(){
        var _this = this;
        setTimeout( function(){
           _this.setState( {data:{offset:_this.props.env.timezone.offset}, loaded:true } ); 
        }, 3000 ); 
    },
    render: function() {
        if( !this.state.loaded ){
            return (
                <div className="header">
                    <ClockLoading />
                    <HeaderInfo/>
                </div>
            )    
        }else{
            return (
              <div className="header">
                <Clock changeDate={this._changeDate} timezone_offset={this.state.data.offset} />
                <HeaderInfo/>
              </div>
            )
        }
    }
});

var Clock = React.createClass({
    propTypes: {
        timezone_offset: React.PropTypes.number.isRequired ,
        changeDate: React.PropTypes.func.isRequired
    },
    getInitialState: function(){
        this.dateCalc = new DateCalculator(this.props.timezone_offset);
        var dateTime = this.dateCalc.getCurrentDatetime(); 
        return { 
            time: this.calcRestOfTime( dateTime ) ,
            currentDate: DateCalculator.getDateFormat( dateTime )
        };
    } , 
    componentDidMount: function(){
        this.timer = setInterval(this.tick, 1000);
    } ,
    componentWillUnmount: function(){
        clearInterval(this.timer);
    } ,
    tick: function(){
        var dateTime = this.dateCalc.getCurrentDatetime(); 
        var currentDate = DateCalculator.getDateFormat( dateTime );
        var nextState = {"time": this.calcRestOfTime( dateTime )};
        if( this.state.currentDate != currentDate ){
            this.props.changeDate();
            nextState[ "currentDate" ] = currentDate;
        }
        this.setState( nextState );
    },
    calcRestOfTime: function( dateTime ){
        var diffHour = ("0" + (23 - dateTime.getHours())).slice(-2);
        var diffMin = ("0" + (59 - dateTime.getMinutes())).slice(-2);
        var diffSec = ("0" + (59 - dateTime.getSeconds())).slice(-2);
        return diffHour+":"+diffMin+":"+diffSec;
    },
    render: function(){
        return (
            <div className="clock">
                <p>{this.state.time}</p>
            </div>
        )
    }
});

var ClockLoading = React.createClass({
    render: function(){
         return (
            <div className="clock">
                <p> -- : -- : -- </p>
            </div>
        )   
    }
});

var HeaderInfo =  React.createClass({
    render: function(){
        return (
            <div className="header-info">
                <SearchText />
                <ConfigIcon />
            </div>         
        )
    }
});

var SearchText = React.createClass({
    render: function(){
        return (
            <div className="search-text">
                <img src="images/search-icon.png" alt=""/>
                <input type="text" name="search" />
            </div>
        )
    }
});

var ConfigIcon = React.createClass({
    render: function(){
        return (
            <div className="config-icon">
                <img src="images/config-icon.png" alt=""/>
            </div>
        ) 
    }
});


