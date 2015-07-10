
var DateCalculator = require("./../common/DateCalculator.js");

var Header = require("./_app_header.jsx");
var Content = require("./_app_content.jsx");

module.exports = React.createClass({
    propTypes: {
        env: React.PropTypes.object.isRequired 
    },
    _init_state: { 
        user: null ,
        dates: {} ,
        popup: {}
    },
    getInitialState: function(){
        var state = this._init_state;
        state.user = this.props.env.user;
        state.dates = this.getDates( state.user.timezone.offset );
        return state;
    }, 
    getDates: function( offset ){
        var dateCalc = new DateCalculator( offset );
        var dates = {};
        dates.today    = dateCalc.getToday();
        dates.tomorrow = dateCalc.getTomorrow();
        dates.dat      = dateCalc.getDAT();
        dates.future   = dateCalc.getDate( 7 );
        dates.past     = dateCalc.getDate( -7 )
        return dates;
    },

    changeDate: function(){
        this.setState({dates: this.getDates(this.state.user.timezone.offset)});
    },
    updateUserSettings:function(user){
        var dates = this.getDates(user.timezone.offset);
        this.setState({user:user, dates:dates});
    },

    render:function(){
        Messages.setLanguage(this.state.user.language);
        return (
            <div className="wrapper" >
                <Header user={this.state.user} 
                        changeDate={this.changeDate} 
                        updateUserSettings={this.updateUserSettings}
                />
                <Content user={this.state.user} 
                         dates={this.state.dates} 
                />
            </div>
        ); 
    }
});

