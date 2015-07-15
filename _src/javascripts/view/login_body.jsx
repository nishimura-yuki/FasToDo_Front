// load module
var sprintf = require("sprintf");
var Validator = require("./../common/Validator.js");

module.exports =  React.createClass({
     mixins: [ ReactRouter.State ] ,
     _init_state: {
        userid:"", password: "", 
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
        Request.post( "/web/login" )
               .type('form')
               .send({ userid: this.state.userid,
                       password: this.state.password
               })
               .end(function(err, res){
                    console.log(err);
                    if(err){
                        var cause = err.response.body.cause;
                        if(cause == "INVALID_LOGIN_INFO"){
                            _this.setState( {error: {
                                userid: null,
                                password: null,
                                login: Messages.get("error").login_invalid 
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

    render: function(){

        var lang = this.getQuery().lang;
        if(!lang) lang="en-US";
        Messages.setLanguage(lang);

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
                    <p>{Messages.get("login").header}</p>
                </div>
                <div className="content" >
                    <div className="c_sideline">
                    </div>
                    <div className="c_loginmessage">
                        <p>{Messages.get("login").message}</p>
                    </div>
                    <form onSubmit={this._onSubmit}>
                        <div className="c_form">
                            <table className="c_table">
                                <tr>
                                    <td>
                                        <p>{Messages.get("login").userid}</p>
                                        <input className="p_input_text" type="text" name="userid"
                                               placeholder="example@mail.com" value={this.state.userid}
                                               onChange={this._onChangeUserid} maxLength="256" />
                                        <div className="p_error-message">
                                            {this.state.error.userid} 
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="c_password-text">
                                            <p className="c_password-text_message" >{Messages.get("login").password}</p>
                                            <div className={"c_showpass "+showpassState} onClick={this._onClickShowPass}>
                                                {Messages.get("signup").show}
                                            </div>
                                        </div>
                                        <input className={"p_input_text "+showpassHidden} type="password"
                                               name="password_p" value={this.state.password}
                                               placeholder={Messages.get("login").password_placeholder} 
                                               onChange={this._onChangePassword} maxLength="16" />
                                        <input className={"p_input_text "+showtextHidden} type="text"
                                               name="password_t" value={this.state.password}
                                               placeholder={Messages.get("login").password_placeholder}
                                               onChange={this._onChangePassword} maxLength="16" />
                                        <div className="p_error-message">
                                            {this.state.error.password} 
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="p_error-message">
                                            {this.state.error.login} 
                                        </div>
                                        <input className="p_input_button c_table_submit" type="submit"
                                               value={Messages.get("login").login} disabled={buttonDisabled} />
                                   </td>
                               </tr>
                           </table>
                        </div>
                    </form>
                    <div className="c_signup_nav">
                        <p>{Messages.get("login").to_signup}</p>
                        <a href={"/web/signup#/?lang="+lang} >{Messages.get("login").signup}</a>
                    </div>
                </div>
            </div> 
        )
    }
});
