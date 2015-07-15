
// load module
var sprintf = require("sprintf");
var Validator = require("./../common/Validator.js");
var Language = require("./../template/language.jsx");
var Timezone = require("./../template/timezone.jsx");

module.exports =  React.createClass({
     mixins: [ ReactRouter.State ] ,
     _init_state: {
        userid:"", password: "", lang: "en-US", timezone:"Australia/Sydney" ,
        showpass: "pass",
        sending: false,
        error:{ userid:"", password:"" }
    },
    getInitialState: function () {
        return this._init_state;
    },  
    _onSubmit:function(e){

        e.preventDefault();

        if(this.state.sending) return; 
    
        var error_userid = null;
        var error_password = null;
        error_userid = Validator.validate( this.state.userid ,
                        [
                            {name:"blank",message:sprintf( Messages.get("error").required, Messages.get("signup").userid)},
                            {name:"email",message:Messages.get("error").userid}
                        ]);
        error_password = Validator.validate( this.state.password ,
                        [
                            {name:"blank",message:sprintf( Messages.get("error").required, Messages.get("signup").password)},
                            
                            {name:"range",message:Messages.get("error").password, args:[8,16]} ,
                            {name:"halfChar",message:Messages.get("error").password}
                        ]);

        console.log(this.state); 
        if( error_userid || error_password ){
            this.setState( {error: {userid: error_userid, password: error_password}} ); 
            return;
        }

        this.setState( {sending:true} );
        var _this = this;
        Request.post( "/web/signup" )
               .type('form')
               .send({ userid: this.state.userid,
                       password: this.state.password,
                       language: this.state.lang,
                       timezone: this.state.timezone
               })
               .end(function(err, res){
                    console.log(err);
                    if(err){
                        var cause = err.response.body.cause;
                        if(cause == "ALREADY_EXIST_USER"){
                            _this.setState( {error: {
                                userid: Messages.get("error").already_exist,
                                password: null
                            }, sending:false} ); 
                        }else{
                            _this.setState( {sending:false} ); 
                        }
                    }else{
                        console.log(res.body);     
                        location.href = res.body.redirect;
                    }
               });

    },

    _onClickShowPass:function(){
        if( this.state.showpass == "pass" ){
            this.setState({showpass: "text"}); 
        }else{
            this.setState({showpass: "pass"}); 
        } 
    },

    _onChangeUserid:function(event){
        this.setState({ userid: event.target.value });
    },
    _onChangePassword:function(event){
        this.setState({ password: event.target.value });
    },
    _onChangeLang:function(event){
        console.log("change timezone?");
        this.setState({ lang: event.target.value });
    },
    _onChangeTimezone:function(event){
        console.log("change timezone?");
        this.setState({ timezone: event.target.value });
    },
  
    render: function(){
        Messages.setLanguage(this.getQuery().lang);
        var showpassState = "";
        var showpassHidden = ""; 
        var showtextHidden = "";
        if(this.state.showpass != "pass"){
            showpassState = "c_showpass_on";
            showpassHidden = "hidden";
        }else{
            showtextHidden = "hidden"; 
        }

        var buttonDisabled = false;
        if(this.state.sending){
            buttonDisabled = true;
        }

        return (
            <div className="wrapper">
                <div className="header">
                    <p>{Messages.get("signup").welcome}</p>
                </div>
                <div className="content" >
                    <div className="c_sideline">
                    </div>
                    <div className="c_signupmessage">
                        <p>{Messages.get("signup").describe}</p>
                    </div>
                    <form onSubmit={this._onSubmit}>
                        <table className="c_table" >
                            <tr>
                                <td><p>{Messages.get("signup").userid}</p></td>
                                <td>
                                    <input className="p_input_text" type="text" name="userid" placeholder="example@mail.com" value={this.state.userid} onChange={this._onChangeUserid} maxLength="256" />
                                    <div className="p_error-message">
                                        {this.state.error.userid} 
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="c_password-text">
                                        <p className="c_password-text_message" >{Messages.get("signup").password}</p>
                                        <div className={"c_showpass "+showpassState} onClick={this._onClickShowPass}>
                                            {Messages.get("signup").show}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <input className={"p_input_text "+showpassHidden} type="password" name="password_p" value={this.state.password} placeholder={Messages.get("signup").password_placeholder} onChange={this._onChangePassword} maxLength="16"/>
                                    <input className={"p_input_text "+showtextHidden} type="text" name="password_t" value={this.state.password} placeholder={Messages.get("signup").password_placeholder} onChange={this._onChangePassword} maxLength="16"/>
                                    <div className="p_error-message">
                                        {this.state.error.password} 
                                    </div>
                                </td>
                            </tr>
                            <tr> 
                                <td><p>{Messages.get("signup").language}</p></td>
                                <td>
                                    <Language 
                                        classname="p_input_select c_table_select-lang"
                                        name="lang"
                                        value={this.state.lang}
                                        onChange={this._onChangeLang}
                                    />
                                </td>
                            </tr>
                            <tr> 
                                <td><p>{Messages.get("signup").timezone}</p></td>
                                <td>
                                    <Timezone 
                                        classname="p_input_select c_table_select-timezone"
                                        name="timezone"
                                        value={this.state.timezone}
                                        onChange={this._onChangeTimezone}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <input className="p_input_button c_table_submit" type="submit" value={Messages.get("signup").signup} disabled={buttonDisabled} />
                                </td>
                            </tr>
                        </table>
                    </form>
                </div>
            </div> 
        )
    }
});


