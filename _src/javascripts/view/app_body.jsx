
var DateCalculator = require("./../common/DateCalculator.js");

var Header = require("./_app_header.jsx");
var Content = require("./_app_content.jsx");
var Popup = require("./../component/popup.jsx");

module.exports = React.createClass({
    propTypes: {
        env: React.PropTypes.object.isRequired 
    },
    _init_state: { 
        user: null ,
        dates: {} ,
        popup: {} ,
        reset: false,
        error: null
    },
    getInitialState: function(){
        var state = this._init_state;
        state.user = this.props.env.user;
        state.dates = this.getDates( state.user.timezone.offset );
        return state;
    }, 
    componentWillReceiveProps:function(newProps){
        console.log("app will new props");
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
    onError: function( error ){
        console.log( error );
        this.setState({error: error}); 
    },
    onErrorConfirm: function(){
        location.reload();
    },

    render:function(){

        Messages.setLanguage(this.state.user.language);

        var errorPopup = (<div key="error-popup"></div>);
        if(this.state.error){
            errorPopup = (
                <ErrorPopup key="error-popup"
                    error={this.state.error}
                    onConfirm={this.onErrorConfirm}
                />
            );
        }

        return (
            <div className="wrapper" >
                <Header user={this.state.user} 
                        changeDate={this.changeDate} 
                        updateUserSettings={this.updateUserSettings}
                        onError={this.onError}
                />
                <Content user={this.state.user} 
                         dates={this.state.dates} 
                         onError={this.onError}
                />
                {errorPopup}
            </div>
        ); 
    }
});

var ErrorPopup = React.createClass({
    propTypes: {
        error: React.PropTypes.string.isRequired,
        onConfirm: React.PropTypes.func.isRequired
    },
    componentWillReceiveProps:function(newProps){
    },

    render: function(){

        var content = (
                    <div className="error-popup" >
                        <div className="error-popup_title">
                            <p>{Messages.get("error").message.internal}</p>
                        </div>
                        <div className="error-popup_message">
                            <p>{Messages.get("error").message.reload}</p>
                        </div>
                        <div className="error-popup_button" >
                            <button className="error-button" type="button" 
                                    onClick={this.props.onConfirm} >
                                    {Messages.get("app").confirm}
                            </button>
                        </div>
                    </div>
        );

        var style = {
            left:"-50%",
            top: -50,
            position: "relative"
        };
        return ( <div>
                    <div className="screen-filter" />
                    <div className="error-popup_outer" >
                        <Popup style={style} content={content} /> 
                    </div>
                 </div>
               );
    }
});
