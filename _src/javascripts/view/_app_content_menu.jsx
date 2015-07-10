
var sprintf = require("sprintf");
var Validator = require("./../common/Validator.js");

var DayMenu = require("./../template/daymenu.jsx");
var FolderMenu = require("./../template/foldermenu.jsx");
var Popup = require("./../component/popup.jsx");

module.exports = React.createClass({
    propTypes: {
        state: React.PropTypes.shape({ 
            type: React.PropTypes.string.isRequired,
            id: React.PropTypes.string.isRequired
        }),
        days: React.PropTypes.object.isRequired ,
        folders: React.PropTypes.array.isRequired,
        reset: React.PropTypes.bool,

        folderAdd: React.PropTypes.func.isRequired,
        folderEdit: React.PropTypes.func.isRequired,
        folderDelete: React.PropTypes.func.isRequired

    },
    _init_state: {
        editing_id:false
    },
    getInitialState: function () {
        return this._init_state;
    },
    componentWillReceiveProps: function(newProps){
        if( newProps.reset ){
            this.setState( this._init_state );
        }
    },

    _folderAdd:function( data ){
        this.props.folderAdd( data ); 
    },
    _folderEdit:function( id, data ){
        this.props.folderEdit( id, data ); 
        this.setState( this._init_state );
    },
    _folderDelete:function( id ){
        this.props.folderDelete( id ); 
        this.setState( this._init_state );
    },

    onOpenEditFolder:function(id){
        if(this.state.editing_id != id){
            this.setState({editing_id:id});
        }else if(this.state.editing_id == id){
            this.onCancelEditFolder();
        }
    },
    onCancelEditFolder:function(){
        this.setState({editing_id:false});
    },

    createFolderNode:function(){
        var _this = this;
        var folders = this.props.folders.map(function (folder) {
            var editing = false;
            if(_this.state.editing_id == folder.folderid){
                editing = true; 
            }
            return (
                <FolderMenu key={folder.folderid} id={folder.folderid}
                            count={folder.count} name={folder.name}
                            onEdit={_this.onOpenEditFolder}
                            editing={editing}
                />
            );
        }); 
        return folders;
    },

    render: function(){
        
        var folderNode = this.createFolderNode();
        var folderPopup = (<div key="folder_edit_popup"></div>);
        if(this.state.editing_id){
            var folders = this.props.folders;
            var edit_folder = null;
            for(var i=0;i<folders.length; i++){
                if(folders[i].folderid == this.state.editing_id){
                    edit_folder =  folders[i];
                } 
            } 
            if(edit_folder){
                folderPopup = (<FolderEditPopup key="folder_edit_popup"
                                    parent={this.state.editing_id}
                                    folder={edit_folder}
                                    onSave={this._folderEdit}
                                    onDelete={this._folderDelete}
                                    onCancel={this.onCancelEditFolder}
                                 />); 
            }
        }

        return (
            <div>
                <div className="content-menu">
                    <DayMenus data={this.props.days} />
                    <div className="folder-menus">
                        <FolderAdd add={this._folderAdd}
                            folders={this.props.folders} 
                        />
                        <div className="folder-list">
                            {folderNode}
                        </div>
                    </div>
                </div>
                {folderPopup}
            </div>
        ) 
    }
});

var DayMenus = React.createClass({
     propTypes: {
        data: React.PropTypes.object.isRequired 
     },
     render: function(){
        return (
            <div className="day-menus">
                <DayMenu key="today" id="today" count={this.props.data.today.count}
                      image="/images/arrow-icon.png" name={Messages.get("app").today} />    
                <DayMenu key="tomorrow" id="tomorrow" count={this.props.data.tomorrow.count}
                      image="/images/arrow-icon.png" name={Messages.get("app").tomorrow} />    
                <DayMenu key="anytime" id="anytime" count={this.props.data.anytime.count}
                      image="/images/arrow-icon.png" name={Messages.get("app").anytime} />    
                <DayMenu key="past" id="past" count={this.props.data.past.count}
                      image="/images/stock-icon.png" name={Messages.get("app").past} lastline={true} />   
            </div>
        )
    }
});

var FolderAdd = React.createClass({
     propTypes: {
        add: React.PropTypes.func.isRequired ,
        folders: React.PropTypes.array.isRequired
     },
     _init_state: { 
        showtype: "show" ,
        name: "" ,
        error: null
     },
     getInitialState: function(){
        return this._init_state;
     }, 
     componentWillReceiveProps: function(newProps){
        this.setState(this._init_state); 
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
         
         var name  = this.state.name ? this.state.name.trim() : "";
         var error = null;
         if( Validator.isBlank( name ) ){
            error = sprintf( Messages.get("error").required, Messages.get("app").folder_name);
         }
         if(!error){
            var limit = Define.number_of_limit.folder;
            if(this.props.folders.length >= limit){
                error = sprintf( Messages.get("error").limit_folder, limit);
            } 
         }
         if(error){
             this.setState({error:error}); 
             return;
         } 
         this.props.add({name: this.state.name });
     },
     _onChangeName:function(event){
         this.setState({ name: event.target.value });
     },
     render: function(){
        var showHidden = "";
        var addHidden = "";
        var open = "";
        var errorMessage = "";
        if(this.state.showtype == "add"){
            open = "folder-add-open";
            addHidden = "hidden"; 
            if(this.state.error){
                errorMessage = this.state.error; 
            }
        }else{
            showHidden = "hidden"; 
        }
        return (
            <div className="folder-add">
                <div className={"folder-add_section " + open}>
                    <div className={"folder-add_show " + addHidden}> 
                        <a href="#" onClick={this._onClickAdd} >
                            <img src="/images/add-icon.png" alt="" />
                            <div className="folder-add-show_name"> 
                                {Messages.get("app").add}
                            </div>
                        </a>
                    </div>
                    <div className={"folder-add_input " + showHidden} >
                        <div className="folder-add-input_close">
                            <a href="#" onClick={this._onClickCancel} >
                                <img src="/images/remove-icon.png" alt=""/>
                            </a>
                        </div>
                        <div className="folder-add-input_info" >
                            <div className="folder-add-input-info_name" > 
                                <input className="folder-name-input" type="text" name="name" 
                                    onChange={this._onChangeName} 
                                    value={this.state.name} 
                                />
                            </div>
                            <div className="folder-add-input-info_button">
                                <button className="folder-save-button" type="button" name="save" onClick={this._onSave} >{Messages.get("app").save}</button>
                            </div>            
                        </div>
                    </div>
                </div>
                <div className="folder-add_error">
                    {errorMessage}
                </div>
            </div>
        )
    }
});

var FolderEditPopup = React.createClass({
    propTypes: {
        parent: React.PropTypes.string.isRequired,
        folder: React.PropTypes.object.isRequired,
        onSave: React.PropTypes.func.isRequired,
        onCancel: React.PropTypes.func.isRequired,
        onDelete: React.PropTypes.func.isRequired
    },
    _init_state: {
        name: "",
        error:false
    },
    getInitialState: function () {
        var state = this._init_state;
        state.name = this.props.folder.name;
        return this._init_state;
    },    
    componentWillReceiveProps:function(newProps){
        var state = this._init_state;
        state.name = newProps.folder.name;
        this.setState(state); 
    },
    _onSave:function(){
        var name  = this.state.name ? this.state.name.trim() : "";
        var error = null;
        if( Validator.isBlank( name ) ){
           error = sprintf( Messages.get("error").required, Messages.get("app").folder_name);
        }
        if(error){
            this.setState({error:error}); 
            return;
        } 
        this.props.onSave( this.props.folder.folderid, {
            name: this.state.name,
        });
    },
    _onClose:function(){
        this.props.onCancel(); 
    },
    _onDelete:function(){
        this.props.onDelete(this.props.folder.folderid); 
    },

    _onChangeName:function(event){
        this.setState({ name: event.target.value });
    },

    render: function(){
        var baseTop = 0;
        var baseLeft = 0;
        var height=120;
        var errorMessage = "";
        var element = document.getElementById(this.props.parent);
        if(element){
            var rect = element.getBoundingClientRect();
            baseTop = rect.top + window.pageYOffset;
            baseLeft = rect.left + window.pageXOffset;
        }
        if(this.state.error){
            errorMessage = this.state.error; 
            height = 135;
        }

        var content = (
                    <div className="folder-edit-popup" >
                        <div className="folder-edit-popup_input">
                            <div className="folder-edit-popup-input_name" > 
                                <input className="folder-name-input" type="text" name="name" 
                                    onChange={this._onChangeName} 
                                    value={this.state.name} 
                                />
                            </div>                         
                        </div>
                        <div className="folder-edit-popup_error">
                            {errorMessage}
                        </div>
                        <div className="folder-edit-popup_buttons" >
                            <button className="folder-close-button" type="button" name="close" onClick={this._onClose} >{Messages.get("app").close}</button>
                            <button className="folder-save-button" type="button" name="save" onClick={this._onSave} >{Messages.get("app").save}</button>
                        </div>  
                        <div className="folder-edit-popup_line" />
                        <div className="folder-edit-popup_delete" >
                            <p><a onClick={this._onDelete}>{Messages.get("app").delete}</a></p>
                        </div>
                    </div>
        );

        var style = {
            width: 150,
            height: height,
            top: baseTop + 18,
            left: baseLeft + 115
        };
        return ( <Popup style={style} content={content} /> );
    }
});

