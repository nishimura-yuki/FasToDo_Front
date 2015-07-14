
module.exports = {

    propTypes: {
        tasks: React.PropTypes.array.isRequired ,
        folders: React.PropTypes.array.isRequired,
        days: React.PropTypes.object.isRequired,
        drag: React.PropTypes.string ,

        taskUpdate: React.PropTypes.func.isRequired,
        taskDelete: React.PropTypes.func.isRequired,
        taskActive: React.PropTypes.func.isRequired,
        taskDone: React.PropTypes.func.isRequired,
        taskDrag: React.PropTypes.func.isRequired,
        taskDrop: React.PropTypes.func.isRequired,
        taskOrder: React.PropTypes.func.isRequired

    },
    getInitialState: function(){
        console.log("init!!");
        var s = {
            tasks: [],
            timer: null
        };
        s.tasks = [].concat(this.props.tasks);
        return s;
    },
    componentWillReceiveProps: function(newProps){
        this.setState({ tasks: [].concat(newProps.tasks) }); 
    },

    _preventDefault: function(event){
        event.preventDefault(); 
        event.dataTransfer.dropEffect = 'move';
    },
    _onDragOver: function (event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    },
    _onTaskDragOver: function( taskid, type ){

        console.log(taskid +" : " + type) ;
        if(!this.props.drag) return;

        var dragTask = null;
        var tasks = this.state.tasks;
        for(var i=0;i<tasks.length;i++){
            if(tasks[i].taskid == this.props.drag){
                dragTask = tasks[i]; 
                tasks.splice(i, 1);
                break;
            } 
        }
        for(var i=0;i<tasks.length;i++){
            if(tasks[i].taskid == taskid){
                if(type == "before"){
                    tasks.splice(i, 0, dragTask);
                }else{
                    tasks.splice((i+1), 0, dragTask);
                }
                break;
            } 
        }
        this.setState({tasks:tasks});
    },
    _onTaskDragEnd: function(){
        console.log("drag end main");
        if(this.isChangedOrder()){
            console.log("changed end");
            //親への伝搬にラグを設ける
            var _this = this;
            this.setState( {timer: setTimeout(function(){
                _this.setState({timer:null});
                _this.props.taskDrop();
            }, 300)} );
            console.log("set timer");
        }else{
            this.props.taskDrop(); 
        }
    },
    _onDrop: function(event){
        console.log("on drop area");
        if(this.state.timer){
            clearTimeout(this.state.timer);
            this.setState({timer:null});
            console.log("reset timer");
        }
        if(this.props.drag){
            console.log("drag drop");
            if(this.isChangedOrder()){
                console.log("changed drop");
                var currTasks = this.state.tasks;
                var beforeId = "top";
                for(var i=0; i<currTasks.length; i++){
                    if(currTasks[i].taskid == this.props.drag){
                        break; 
                    }
                    beforeId = currTasks[i].taskid;
                }
                this.props.taskOrder( this.props.drag, beforeId );
            }else{
                this.props.taskDrop(); 
            }
        }
    },

    isChangedOrder: function(){
        var prevTasks = this.props.tasks;
        var currTasks = this.state.tasks;
        if(prevTasks.length != currTasks.length) return true;
        for(var i=0; i<prevTasks.length; i++){
            if(prevTasks[i].taskid != currTasks[i].taskid){
                return true; 
            } 
        } 
        return false;
    }

};
