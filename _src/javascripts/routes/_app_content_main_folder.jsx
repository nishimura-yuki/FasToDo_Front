
var ActiveTask = require("./../template/activetask.jsx");
var TaskAdd = require("./../template/taskadd.jsx");
var TaskListBase = require("./../component/tasklistbase.js");
var ContentMainRoute = require("./_app_content_main_route.jsx");

module.exports = React.createClass({
    mixins: [ReactRouter.State,ContentMainRoute] ,

    getTaskList:function( ids ){
        var resList = [];
        for( var i=0; i<ids.length; i++ ){
             var t = this.props.tasks[ids[i].id];
             if( !t ) continue;
             resList.push( t );
        }
        return resList; 
    },
    render: function(){

        var params = this.getParams();
        var id = params.id;
        if(!id) return this.getNotfoundNode();

        var folders = this.props.folders;
        var folder = null;
        for( var i=0;i<folders.length; i++ ){
            if( id == folders[i].folderid ){
                folder = folders[i];
                break;
            }
        }
        if(!folder) return this.getNotfoundNode();

        return (
            <div>
                <div className="menu-title" >
                    <p>{folder.name}</p>
                </div> 
                <TaskList folder={folder} 
                    tasks={ this.getTaskList( folder.ids ) }
                    folders={this.props.folders}
                    days={this.props.days}
                    drag={this.props.drag}
                    taskAdd={this.props.taskAdd}
                    taskUpdate={this.props.taskUpdate}
                    taskDelete={this.props.taskDelete}
                    taskDone={this.props.taskDone}
                    taskOrder={this.props.taskOrderForFolder}
                    taskActive={this.props.taskActive}
                    taskDrag={this.props.taskDrag}
                    taskDrop={this.props.taskDrop}
                />
            </div>
        );
    }
});

var TaskList = React.createClass({
    mixins: [TaskListBase] ,
    propTypes: {
        folder: React.PropTypes.object.isRequired ,
        taskAdd: React.PropTypes.func.isRequired,
    },
    _init_state: { 
        editing_id: null 
    },
    getInitialState: function(){
        return this._init_state; 
    },
    _taskEdit: function(id){
        this.setState( {editing_id: id} );
    }, 
    _taskCancel: function(id){
        this.setState( {editing_id: null} );        
    },
    _taskUpdate: function(id, data){
        this.props.taskUpdate(id, data);
        this.setState( {editing_id: null} );
    },

    createTaskList: function(){
        var taskNode = []; 
        var show_id = null;
        var target_show_type = {type:"edit"};
        var default_show_type = {type:"show"};
        if(this.props.drag){
            show_id = this.props.drag; 
            target_show_type = {type:"drag"};
            default_show_type = {type:"drop"};
        }else if(this.state.editing_id){
            default_show_type = {type:"stay"};
            show_id = this.state.editing_id; 
        }

        var tasks = this.state.tasks;
        for( var i=0; i<tasks.length; i++ ){
            var show = default_show_type;
            if( tasks[i].taskid == show_id ){
                show = target_show_type; 
            }
            taskNode.push( this.createActiveTask( tasks[i] , show ) );
        } 
        return taskNode;
    },

    createActiveTask: function( task, show ){
        return (<ActiveTask key={task.taskid} data={task} 
                    show={show}
                    folders={this.props.folders}
                    days={this.props.days}
                    sub="date"
                    onSave={this._taskUpdate}
                    onDelete={this.props.taskDelete}
                    onDone={this.props.taskDone}
                    onDrag={this.props.taskDrag}
                    onEdit={this._taskEdit}
                    onCancel={this._taskCancel}
                    onDragOver={this._onTaskDragOver}
                    onDragEnd={this._onTaskDragEnd}
                />);
    },

    render:function(){

        var taskList = this.createTaskList();
        var classDrag = "";
        if(this.props.drag){
            classDrag = "task-list-active-date-list_drag"; 
        }

        return ( <div>
                    <TaskAdd key="task-add"
                        folders={this.props.folders}
                        days={this.props.days}
                        defaultdate={this.props.days.today.date}
                        defaultfolder={this.props.folder.folderid}
                        add={this.props.taskAdd}
                    />
                    <div className="task-list">
                        <div className="task-list_active">
                            <div>
                                <div className={"task-list-active-date_list "+classDrag} 
                                    onDrop={this._onDrop}
                                    onDragOver={this._onDragOver}>
                                    {taskList}
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
               );

    } 

});

