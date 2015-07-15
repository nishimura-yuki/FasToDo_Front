
var DateCalculator = require("./../common/DateCalculator.js");

var Popup = require("./../component/popup.jsx");
var Language = require("./../template/language.jsx");
var Timezone = require("./../template/timezone.jsx");
var Validator = require("./../common/Validator.js");

// Header
module.exports = React.createClass({
    mixins: [ReactRouter.Navigation],
    propTypes: {
        user: React.PropTypes.object.isRequired ,
        changeDate: React.PropTypes.func.isRequired,
        updateUserSettings: React.PropTypes.func.isRequired,
        onError: React.PropTypes.func.isRequired,
        reset: React.PropTypes.bool
    },
    _init_state:{
        show_settings: "close",
        search_word: ""
    },
    getInitialState: function(){
        return this._init_state; 
    } , 
    componentWillReceiveProps:function(newProps){
        var s = this._init_state;
        if(!newProps.reset){
            s.search_word = this.state.search_word;
        }
        this.setState( s ); 
    },
    _changeDate: function(){
        this.props.changeDate();
    },
    _onSaveSettings:function( data ){
        console.log("change user");
        console.log(data);
        if( this.props.user.language == data.language &&
            this.props.user.timezone.name == data.timezone){
            this._onSettingsIcon();
            return; 
        }
        
        var _this = this;
        Request.put( Define.api_host + "/api/user/settings")
               .send({ language: data.language, timezone:data.timezone })
               .end(function(err, res){
                    if(err) return _this.props.onError(err);
                    console.log(res);
                    _this.props.updateUserSettings( res.body );
               });

    },
    _onSettingsIcon:function(){
        if(this.state.show_settings == "show"){
            this.setState( {show_settings: "close"} );
        }else{
            this.setState( {show_settings: "show"} );
        } 
    },
    _onLogout:function(){
    
    },
    _onChangeSearch: function(event){
        var value = event.target.value;
        if( Validator.isNotBlank( value ) ){
            this.transitionTo('keyword', {}, {k: value});
        }
        this.setState({ search_word: event.target.value });
    },

    render: function() {
        var iconClass = "";
        if(this.state.show_settings == "show"){
            iconClass = "header-info-settings_open"; 
        }
        return (
          <div >
              <div className="header">
                <Clock changeDate={this._changeDate} timezone_offset={this.props.user.timezone.offset} />
                <div className="header_info">
                    <div className="header-info_unit1">
                        <div className="header-info-unit1_search">
                            <img src="/images/search-icon.png" alt=""/>
                            <input className="search-text-input" type="text" name="search" maxLength="25"
                                placeholder={Messages.get("app").keyword}
                                onChange={this._onChangeSearch} 
                                value={this.state.search_word}
                            />
                        </div>
                        <div className="header-info-unit1_userid">
                            {this.props.user.userid}
                        </div>
                    </div>
                    <div className={"header-info_settings "+ iconClass}>
                        <img id="header-settings-icon" src="/images/config-icon.png" alt="" onClick={this._onSettingsIcon} />
                    </div>
                </div> 
              </div>
              <SettingsPopup
                 parent="header-settings-icon"
                 onSave={this._onSaveSettings}
                 onCancel={this._onSettingsIcon}
                 onLogout={this._onLogout}
                 user={this.props.user}
                 show={this.state.show_settings}
              />
          </div>
        )
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
    componentWillReceiveProps:function(newProps){
        if(newProps.timezone_offset != this.props.timezone_offset){
            this.dateCalc = new DateCalculator(newProps.timezone_offset);
            var dateTime = this.dateCalc.getCurrentDatetime(); 
            this.setState( {
                time: this.calcRestOfTime( dateTime ) ,
                currentDate: DateCalculator.getDateFormat( dateTime )
            });
        }
   },
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

var SettingsPopup = React.createClass({
    propTypes: {
        parent: React.PropTypes.string.isRequired,
        user: React.PropTypes.object.isRequired,
        show: React.PropTypes.string.isRequired,
        onSave: React.PropTypes.func.isRequired,
        onCancel: React.PropTypes.func.isRequired,
        onLogout: React.PropTypes.func.isRequired
    },
    _init_state: {
        language: "",
        timezone: ""
    },
    getInitialState: function () {
        var state = this._init_state;
        state.language = this.props.user.language;
        state.timezone = this.props.user.timezone.name;
        return this._init_state;
    },    
    componentWillReceiveProps:function(newProps){
        var state = this._init_state;
        state.language = newProps.user.language;
        state.timezone = newProps.user.timezone.name;
        this.setState(state); 
    },
    _onSave:function(){
        this.props.onSave( {
            language: this.state.language,
            timezone: this.state.timezone
        });
    },
    _onClose:function(){
        this.props.onCancel(); 
    },

    _onChangeLanguage:function(event){
        console.log("lang");
        this.setState({ language: event.target.value });
    },
    _onChangeTimezone:function(event){
        console.log("tz");
        this.setState({ timezone: event.target.value });
    },

    render: function(){
        var element = document.getElementById(this.props.parent);
        var baseTop = 0;
        var baseLeft = 0;
        var height = 0;
        var trans = "none";
        if(element){
            var rect = element.getBoundingClientRect();
            baseTop = rect.top + window.pageYOffset;
            baseLeft = rect.left + window.pageXOffset;
        }
        if(this.props.show == "show"){
            height = 225;
            trans = "height 0.2s";
        }

        var content = (
                    <div className="header-popup-settings" >
                        <div className="header-popup-settings_title">
                            <p>{Messages.get("app").settings}</p>
                        </div>
                        <div className="header-popup-settings_input">
                            <p>{Messages.get("app").language}</p>
                            
                            <Language 
                                  classname="p_input_select c_table_select-lang"
                                  name="lang" value={this.state.language}
                                  onChange={this._onChangeLanguage}
                            />
                            <p>{Messages.get("app").timezone}</p>
                            <Timezone 
                               classname="p_input_select c_table_select-timezone"
                               name="timezone" value={this.state.timezone}
                               onChange={this._onChangeTimezone}
                            />
                        </div>
                        <div className="header-popup-settings_buttons" >
                            <button className="settings-close-button" type="button" onClick={this._onClose} name="close">{Messages.get("app").close}</button>
                            <button className="settings-save-button" type="button" onClick={this._onSave} name="save">{Messages.get("app").save}</button>
                        </div>  
                        <div className="header-popup-settings_line" />
                        <div className="header-popup-settings_logout" >
                            <p><a href="/web/logout">{Messages.get("app").logout}</a></p>
                        </div>
                    </div>
        );

        var style = {
            width: 150,
            height: height,
            transition: trans,
            top: baseTop + 30,
            left: baseLeft - 50
        };
        return ( <Popup style={style} content={content} /> );
    }
});


