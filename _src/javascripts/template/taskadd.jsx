
var TaskBase = require("./../component/taskbase.js");

module.exports = React.createClass({
    mixins: [TaskBase],
    propTypes: {
        defaultdate:   React.PropTypes.string, 
        defaultfolder: React.PropTypes.string, 
        add: React.PropTypes.func.isRequired
    },
    _init_state: { 
        showtype: "show" ,
        title: "" ,
        date: "",
        folder :"",
        error : null,
    },
    getInitialState: function(){
        var state = this._init_state;
        state.date = this.props.defaultdate;
        state.folder = this.props.defaultfolder;
        return state;
    },
    componentWillReceiveProps: function(newProps){
        var state = this._init_state;
        state.date = newProps.defaultdate;
        state.folder = newProps.defaultfolder;
        state.showtype = this.state.showtype;
        this.setState(state); 
    },
    _onClickAdd: function(e){
        e.preventDefault();
        if(this.state.showtype != "add"){
            this.setState({showtype: "add"});
        } 
    },
    _onClickCancel: function(e){
        e.preventDefault();
        if(this.state.showtype != "show"){
            this.setState({showtype: "show", error:null});
        } 
    },
    _onSave: function(){

        var title  = this.state.title ? this.state.title.trim()  : "";
        var date   = this.state.date  ? this.state.date.trim()   : "";
        var folder = this.state.folder? this.state.folder.trim() : null;
        var error = this.validate(title, date, folder);
        if(error){
            this.setState(error);
            return; 
        }

        this.props.add(
            {title: title, 
             date: date,
             folderid: folder
            } 
        );
        
    },
    _onChangeTitle:function(event){
        this.setState({ title: event.target.value });
    },
    _onChangeDate:function(event){
        this.setState({ date: event.target.value });
    },
    _onChangeFolder:function(event){
        this.setState({ folder: event.target.value });
    },
    render: function(){
        var classnameNew   = "task-add_new";
        var classnameInput = "task-add_input";
        var classnameClose = "task-add_close";
        var classnameInfo  = "task-add-input_info";
        var errorTitle = "";
        var errorDate = "";
        var errorMesTitle = "";
        var errorMesDate = "";
        var errorMesFolder = "";
        if(this.state.showtype != "add"){
            classnameClose += " hidden";
            classnameInput += " task-add-input_close";
            classnameInfo += " task-add-input-info_close";
        }else{
            classnameNew += " hidden";
            classnameInfo += " task-add-input-info_open";
            if(this.state.error){
                if(this.state.error.title){
                    errorTitle = "p_input-error";
                    errorMesTitle = this.state.error.title;
                }
                if(this.state.error.date){
                    errorDate = "p_input-error";
                    errorMesDate = this.state.error.date;
                }
                if(this.state.error.folder){
                    errorMesFolder = this.state.error.folder;
                }
            }
        }
        
        var folders = this.props.folders.map(function (f) {
            return (
                <option value={f.folderid}>{f.name}</option>
            );
        });

        return (
            <div className="task-add">
                <div className={classnameNew} >
                    <a href="#" onClick={this._onClickAdd} >
                        <img src="/images/add-icon.png" alt=""/>
                        <span>{Messages.get("app").add}</span>
                    </a>
                </div>
                <div className={classnameInput} >
                    <div className={classnameClose} >
                        <a href="#" onClick={this._onClickCancel} >
                            <img src="/images/remove-icon.png" alt=""/>
                        </a>
                    </div>
                    <div className={classnameInfo} >
                        <div className="task-add-input-info_title" > 
                            <input className={"task-title-input "+errorTitle} type="text" name="title" 
                                onChange={this._onChangeTitle} 
                                value={this.state.title} 
                            />
                        </div>
                        <div className="task-add-input-info_date" >
                            <input className={"task-date-input "+errorDate} type="text" name="date" 
                                onChange={this._onChangeDate}
                                placeholder="yyyy/mm/dd" value={this.state.date} 
                            />
                        </div>
                        <div className="task-add-input-info_folder" >
                            <select className="task-folder-select" name="folder" ref="folder" 
                                onChange={this._onChangeFolder} value={this.state.folder} 
                            >
                                <option value="" >{Messages.get("app").empty_select}</option>
                                {folders}
                            </select>
                        </div>
                        <div className="task-add-input-info_buttons">
                            <button className="task-save-button" type="button" name="save" onClick={this._onSave} >{Messages.get("app").save}</button>
                        </div>            
                    </div>
                    <div className="both task-add-input_error">
                            <p>{errorMesTitle}</p>
                            <p>{errorMesDate}</p>
                            <p>{errorMesFolder}</p>
                    </div>
                </div>
            </div>
        )
    }
});
