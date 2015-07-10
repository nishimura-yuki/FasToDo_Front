
var TaskBase = require("./../component/taskbase.js");

module.exports = React.createClass({
    mixins: [TaskBase],
    propTypes: {
        data: React.PropTypes.shape({
            taskid: React.PropTypes.string.isRequired,
            title: React.PropTypes.string.isRequired,
            date: React.PropTypes.string,
            folderid: React.PropTypes.string
        }),
        show: React.PropTypes.shape({
            type: React.PropTypes.string.isRequired,
            pos:  React.PropTypes.object
        }),
        onSave: React.PropTypes.func.isRequired,
        onDelete: React.PropTypes.func.isRequired,
        onDone: React.PropTypes.func.isRequired,
        onDrag: React.PropTypes.func.isRequired,
        onEdit: React.PropTypes.func.isRequired,
        onCancel: React.PropTypes.func.isRequired,
        onDrop: React.PropTypes.func.isRequired
    },
    _init_state: { 
        title:"",
        date:"",
        folder:"",
        error: null
    },
    getInitialState: function(){
        return this._init_state;
    }, 
    componentWillMount: function(){
        var state = this._init_state;
        state.title = this.props.data.title;
        state.date = this.props.data.date;
        state.folder = this.props.data.folderid;
        this.setState( state ); 
    },
    componentWillReceiveProps: function(newProps){
        var state = this._init_state;
        state.title  = newProps.data.title;
        state.date   = newProps.data.date;
        state.folder = newProps.data.folderid;
        this.setState( state ); 
    },
    _onEdit: function(event){
        if(event.target.tagName.toLowerCase() == "p"){
            this.props.onEdit(this.props.data.taskid);
        }
    },
    _onDone: function(){
        this.props.onDone(this.props.data.taskid);
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
        this.props.onSave(this.props.data.taskid, 
                          {
                            title: title, 
                            date: date,
                            folderid: folder
                          }                         
                         );
    }, 
    _onCancel: function(){
        this.props.onCancel(this.props.data.taskid);
    },

    _onDelete: function(){
        this.props.onDelete(this.props.data.taskid);
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

    test: function(event){
        console.log("eeee");
        event.preventDefault();
    },

    _onDragStart: function(event){
        console.log("drag start");
        var el = document.getElementById(this.getDOMId());
        el.className = el.className + " activetask_dragging";
        event.dataTransfer.setData("task", this.props.data);
        event.dataTransfer.setDragImage( el, 14, 14);
        this.props.onDrag(this.props.data.taskid);
    },
    _onDrag: function(event){
        //this.props.onDrag(this.props.data.taskid);
        console.log("drag");
        //event.preventDefault();
    },
    /*
    _onDragMouseDown: function(event){
        console.log("mouse down");
        event.dataTransfer.setData("task", this.props.data);
        //基準位置

        var element = document.getElementById(this.getDOMId());
        var rect = element.getBoundingClientRect();
        baseTop = rect.top + window.pageYOffset - 10; //sub margin-top
        baseLeft = rect.left + window.pageXOffset - 10; //sub margin-left
        console.log(event.pageX);
        console.log(event.pageY);
        console.log(baseLeft);
        console.log(baseTop);

        this.props.onDrag(this.props.data.taskid,
                          {x:baseLeft, y:baseTop},
                          {x:event.pageX - baseLeft,
                           y:event.pageY - baseTop});
    },
    */
    _onOverBefore: function(event){
        console.log("over before??"); 
        this.props.onDrop( this.props.data.taskid, "before" );
    },
    _onOverAfter: function(event){
        console.log("over after??"); 
        this.props.onDrop( this.props.data.taskid, "after" );
    },

    getDOMId: function(){
        return "ACTIVE_" + this.props.data.taskid;
    },

    render: function(){
        var mainClass = "";
        var mainStyle = {};
        var classname = "";
        var editHidden = "";
        var showHidden = "";
        var errorTitle = "";
        var errorDate = "";
        var errorMesTitle = "";
        var errorMesDate = "";
        var errorMesFolder = "";
        var dropBefore = (<div key={"activetask-dropbefore_"+this.props.data.taskid}></div>);
        var dropAfter  = (<div key={"activetask-dropafter_"+this.props.data.taskid}></div>);
        if(this.props.show.type == "edit"){
            classname = "activetask-unit_edit"; 
            editHidden = "hidden";
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
        }else{
            if(this.props.show.type == "drag"){
                mainClass = "activetask_dragging"; 
                mainStyle = {
                    top:  this.props.show.pos.y,
                    left: this.props.show.pos.x
                };
            }else if(this.props.show.type == "drop"){
                dropBefore = (<div className="activetask-drop" onDragOver={this._onOverBefore} 
                              key={"activetask-dropbefore_"+this.props.data.taskid}></div>);
                dropAfter = (<div className="activetask-drop" onMouseOver={this._onOverAfter} 
                              key={"activetask-dropafter_"+this.props.data.taskid}></div>);
            }
            classname = "activetask-unit_show";
            showHidden = "hidden";
        }

        var folders = this.props.folders.map(function (f) {
            return (
                <option value={f.folderid}>{f.name}</option>
            );
        });

        return (
            <div >
                {dropBefore}
                <div className={"activetask "+ mainClass} id={this.getDOMId()} >
                    <div className={"activetask_unit "+classname} >
                        <div className={'activetask_buttons ' + showHidden}>
                            <button className="task-save-button" type="button" onClick={this._onSave} name="save">{Messages.get("app").save}</button>
                            <button className="task-cancel-button" type="button" onClick={this._onCancel} name="cancel">{Messages.get("app").cancel}</button>
                        </div>  
                        <div className="activetask_drag">
                            <img className={editHidden} src="/images/list-icon.png" alt="" 
                                 onDragStart={this._onDragStart}
                                 onDrag={this._onDrag}
                            /> 
                        </div>
                        <div className="activetask_info" onClick={this._onEdit} >
                            <div className="activetask-info_check" onClick={this._onDone}>
                                <img className={editHidden} src="/images/check-icon.png" alt="" />
                            </div>
                            <div className="activetask-info_title" >
                                <div className={"activetask-info-title_show "+editHidden}>
                                    <p>{this.state.title}</p>
                                </div>
                                <div className={"activetask-info_input " + showHidden} >
                                    <div className="activetask-info-input_title" >
                                        <input className={"task-title-input "+errorTitle} type="text" 
                                               onChange={this._onChangeTitle} value={this.state.title}
                                        />
                                    </div>
                                    <div className="activetask-info-input_date" >
                                        <input className={"task-date-input "+errorDate} type="text" name="date" 
                                            onChange={this._onChangeDate}
                                            placeholder="yyyy/mm/dd" value={this.state.date} 
                                        />
                                    </div>
                                    <div className="activetask-info-input_folder" >
                                        <select className="task-folder-select" name="folder" ref="folder" 
                                            onChange={this._onChangeFolder} value={this.state.folder} 
                                        >
                                            <option value="" >{Messages.get("app").empty_select}</option>
                                            {folders}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={'activetask_bin ' + editHidden} >
                            <img src="/images/bin-icon.png" alt="" onClick={this._onDelete}/>       
                        </div>
                    </div>
                    <div className="activetask_error">
                        <p>{errorMesTitle}</p>
                        <p>{errorMesDate}</p>
                        <p>{errorMesFolder}</p>
                    </div>
                </div>
                {dropAfter}
            </div>
        ) 
    }
});

