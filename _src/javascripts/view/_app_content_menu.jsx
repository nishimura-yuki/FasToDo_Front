
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
        folderUpdate: React.PropTypes.func.isRequired,
        folderDelete: React.PropTypes.func.isRequired,
        folderOrder: React.PropTypes.func.isRequired

    },
    componentWillReceiveProps: function(newProps){
        /*
        if( newProps.reset ){
            this.setState( this._init_state );
        }
        */
    },

    render: function(){
        return (
            <div className="content-menu">
                <DayMenus data={this.props.days} />
                <FolderMenus 
                    folders={this.props.folders}
                    folderAdd={this.props.folderAdd}
                    folderDelete={this.props.folderDelete}
                    folderUpdate={this.props.folderUpdate}
                    folderOrder={this.props.folderOrder}
                />
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

var FolderMenus = React.createClass({
    
    propTypes: {
        folders: React.PropTypes.array.isRequired,

        folderAdd: React.PropTypes.func.isRequired,
        folderUpdate: React.PropTypes.func.isRequired,
        folderDelete: React.PropTypes.func.isRequired,
        folderOrder: React.PropTypes.func.isRequired
    },
  
    _init_state: {
        target_id:null,
        edit_type:null,
        folders: [],
        timer: null
    },
    getInitialState: function () {
        var s = this._init_state;
        s.folders = [].concat( this.props.folders );
        return s;
    },  
    componentWillReceiveProps: function(newProps){
        this.setState({ folders: [].concat(newProps.folders) }); 
    },
 
    resetEdit: function(){
        this.setState({edit_type:null, target_id:null});
    },

    _folderUpdate:function( id, data ){
        this.props.folderUpdate( id, data ); 
        this.resetEdit();
    },
    _folderDelete:function( id ){
        this.props.folderDelete( id ); 
        this.resetEdit();
    },

    _onOpenFolderPopup:function(id){
        if(this.state.edit_type == "edit"){
            if(this.state.target_id != id){
                this.setState({edit_type:"edit", target_id:id});
            }else if(this.state.target_id == id){
                this._onCloseFolderPopup();
            }
        }else if( this.state.edit_type != "drag" ){
            this.setState({edit_type:"edit", target_id:id});
        }
    },
    _onCloseFolderPopup:function(){
        this.resetEdit();
    },

    _onFolderDrag:function(id){
        this.setState({edit_type:"drag", target_id:id});
    },
    _onFolderDragEnd:function(){
        console.log("drag end main");
        if(this.isChangedOrder()){
            console.log("changed end");
            var _this = this;
            this.setState( {timer: setTimeout(function(){
                console.log("timer generate");
                _this.setState({timer:null});
                _this.resetEdit();
            }, 300)} );
        }else{
            this.resetEdit();
        }
    },
    _onFolderDragOver:function(id, type){
        console.log(id +" : " + type) ;
        if(this.state.edit_type != "drag") return;

        var dragFolder = null;
        var folders = this.state.folders;
        for(var i=0;i<folders.length;i++){
            if(folders[i].folderid == this.state.target_id){
                dragFolder = folders[i]; 
                folders.splice(i, 1);
                break;
            } 
        }
        for(var i=0;i<folders.length;i++){
            if(folders[i].folderid == id){
                if(type == "before"){
                    folders.splice(i, 0, dragFolder);
                }else{
                    folders.splice((i+1), 0, dragFolder);
                }
                break;
            } 
        }
        this.setState({folders:folders});
    },
    _onDrop:function(event){
        console.log("drop!!"); 
        if(this.state.timer){
            clearTimeout(this.state.timer);
            this.setState({timer:null});
        }
        if(this.state.edit_type == "drag"){
            if(this.isChangedOrder()){
                console.log("changed drop");
                var currFolders = this.state.folders;
                var beforeId = "top";
                for(var i=0; i<currFolders.length; i++){
                    if(currFolders[i].folderid == this.state.target_id){
                        break; 
                    }
                    beforeId = currFolders[i].folderid;
                }
                this.props.folderOrder( this.state.target_id, beforeId );
                this.resetEdit();
            }else{
                this.resetEdit();
            }
        }
    },
    _onDragOver:function(event){
        console.log("drag over on list"); 
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    },

    isChangedOrder: function(){
        var prevFolders = this.props.folders;
        var currFolders = this.state.folders;
        if(prevFolders.length != currFolders.length) return true;
        for(var i=0; i<prevFolders.length; i++){
            if(prevFolders[i].folderid != currFolders[i].folderid){
                return true; 
            } 
        } 
        return false;
    },

    createFolderNode:function(){
        var _this = this;
        var default_showtype = "show";
        var target_showtype = "show";
        if(this.state.edit_type == "drag"){
            default_showtype = "drop";
            target_showtype = "drag";
        }else if(this.state.edit_type == "edit"){
            default_showtype = "stay";
            target_showtype = "edit";
        }
        var folders = this.state.folders.map(function (folder) {
            var show = default_showtype;
            if(_this.state.target_id == folder.folderid){
                show = target_showtype; 
            }
            return (
                <FolderMenu key={folder.folderid} data={folder}
                            onEdit={_this._onOpenFolderPopup}
                            onDrag={_this._onFolderDrag}
                            onDragEnd={_this._onFolderDragEnd}
                            onDragOver={_this._onFolderDragOver}
                            show={show}
                />
            );
        }); 
        return folders;
    },

    render: function(){
       
        var dragClass = "";
        var folderNode = this.createFolderNode();
        var folderPopup = (<div key="folder_edit_popup"></div>);
        if(this.state.edit_type == "edit"){
            var folders = this.props.folders;
            var edit_folder = null;
            for(var i=0;i<folders.length; i++){
                if(folders[i].folderid == this.state.target_id){
                    edit_folder =  folders[i];
                } 
            } 
            if(edit_folder){
                folderPopup = (<FolderEditPopup key="folder_edit_popup"
                                    parent={this.state.target_id}
                                    folder={edit_folder}
                                    onSave={this._folderUpdate}
                                    onDelete={this._folderDelete}
                                    onClose={this._onCloseFolderPopup}
                                 />); 
            }
        }else if(this.state.edit_type == "drag"){
            dragClass = "foldermenus-list_dragging"; 
        }

        return (
            <div className="foldermenus">
                <FolderAdd add={this.props.folderAdd}
                    folders={this.props.folders} 
                />
                <div className={"foldermenus_list "+dragClass}
                    onDragOver={this._onDragOver} onDrop={this._onDrop} >
                    {folderNode}
                </div>
                {folderPopup}
            </div>
        ); 
    }

}); 

var FolderAdd = React.createClass({
     propTypes: {
        add: React.PropTypes.func.isRequired ,
        folders: React.PropTypes.array.isRequired,
        reset: React.PropTypes.bool
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
        var s = this._init_state;
        if(!newProps.reset){
            s.showtype = this.state.showtype;
        }
        this.setState( s ); 
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
         this.setState({error:null, showtype:"show"}); 
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
        onClose: React.PropTypes.func.isRequired,
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
        this.props.onClose(); 
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

