
var tasks = { 
    "01": { id: "01", title: "shopping", date:"2015/06/22", status: "active" },
    "02": { id: "02", title: "training", date:"2015/06/22", status: "active" },
    "03": { id: "03", title: "work", date:"2015/06/22", status: "active" },
    "04": { id: "04", title: "playing piano", date:"2015/06/22", status: "done" },
    "05": { id: "05", title: "reading books", date:"2015/06/22",   status: "active" },
    "06": { id: "06", title: "dinner with girlfriend", date:"2015/06/22",  status: "active" },
    "07": { id: "07", title: "reporting", date:"2015/06/22", status: "done" },
    "08": { id: "08", title: "study English", date:"2015/06/22",  status: "done" },
    "09": { id: "09", title: "study English", date:"2015/06/22", status: "done" },
};


var AppData = {
    current_date: new Date() ,
    days: { 
        today: {
                name:"Today", count: 30,
                ids: [ "01", "05", "07" ]
        },
        tomorrow: {
                name:"Tomorrow" , count: 2,
                ids: [ "02", "03", "09" ]
        },
        anytime: {
                name:"Anytime" , count: 30,
                ids: [ "01", "05", "07" ]
        },
        past: {
                name: "Past", count: 30,
                ids: [ "01", "05", "07","02","03","04","06" ]
        }
    },
    folders: [ 
        { id:"F001", name:"test", count: 0 ,
            ids: [ "05", "01" , "08" ] 
        },
        { id:"F002", name:"test2", count: 40 ,
            ids: [ "09", "06" , "02" ]
        }       
    ],
    tasks: tasks
};

//=========================

var Link = ReactRouter.Link;
var DateCalculator = require("./../../common/DateCalculator.js");
var Promise = require("promise");

var ActiveTask = require("./../../template/activetask.jsx");

module.exports = React.createClass({
    mixins: [ ReactRouter.State ] ,
    _init_state: {
        days:{}, data: {}, loaded: false, loading:false
    },
    getInitialState: function () {
        var s = this._init_state;
        s.days = this.getDays( this.props.env.timezone.offset );
        return this._init_state;
    },
    componentDidMount: function () {
        this.loadContentData();
    },
    componentWillReceiveProps: function(newProps){
        this.setState({days: this.getDays(newProps.env.timezone.offset)});
    },
    getDays: function( offset ){
        var dateCalc = new DateCalculator( offset );
        var days = {};
        days.today    = dateCalc.getToday();
        days.tomorrow = dateCalc.getTomorrow();
        days.dat      = dateCalc.getDAT();
        days.future   = dateCalc.getDate( 7 );
        days.past     = dateCalc.getDate( -7 )
        console.log(days);
        return days;
    },
    loadTask: function(){
        console.log("load task");
        var _this = this;
        return new Promise(function (resolve, reject) {
            console.log("request task");
            Request.get( Define.api_host + "/api/todo")
                   .query({"condition[schedule.greaterequal]": encodeURI(_this.state.days.past),
                           "condition[schedule.lessequal]": encodeURI(_this.state.days.future)})
                   .end(function(err, res){
                        console.log(err);
                        console.log(res.body);
                        resolve(res.body);
                    });
        })
    },
    loadFolder: function(){
        console.log("load folder");
        return new Promise(function (resolve, reject) {
            Request.get( Define.api_host + "/api/folder")
                   .end(function(err, res){
                        console.log(err);
                        console.log(res.body);
                        resolve(res.body);
                   });
        })
    },
    loadContentData: function(){
        console.log("content load");
        if(this.state.loading) return;
        this.setState({loading: true, loaded: false});
        var _this = this;
        Promise.all([ this.loadTask(), this.loadFolder() ])
               .then( function(res){
                    console.log(res);
                    _this.setState( {data:AppData , loaded:true, loading:false } ); 
               })
               .catch( function(err){
               
               });
    },
    taskAdd: function(data){
        console.log("task add");
        console.log(data);
        Request.post( Define.api_host + "/api/todo")
               .send({ title: data.title, schedule:data.date })
               .end(function(err, res){
                    console.log(res.body);
                });
    },
    taskUpdate: function(id, data){
        console.log("task update: " + id);
        console.log(data);
    },
    taskDelete: function(id){
        console.log("task delete: " + id);
    },
    taskDone:function(id){
    
    }, 
    taskActive:function(id){
    
    },
    taskDrag:function(id){
    
    },

    folderAdd: function(data){
    
    },
    folderUpdate: function(id, date){
    
    },
    folderDelete: function(id){
    
    },

    createFolders:function(){
        var folders = this.state.data.folders.map(function (folder) {
            return (
                <MenuTemplate type="folder" key={folder.id} id={folder.id}
                              count={folder.count} image="images/folder-icon.png"
                              name={folder.name}
                />
            );
        }); 
        return folders;
    },
    createTasks: function( ids ){
        var tasks = {active:[], done:[]}; 
        for( var i=0; i<ids.length; i++ ){
            var t = this.state.data.tasks[ids[i]];
            if( !t ) continue;
            switch(t.status){
                case "active":
                    tasks.active.push( this.createActiveTask(t) );
                    break;
                case "done":
                    tasks.done.push( this.createDoneTask(t) );
                    break;
            }
        } 
        
        return tasks;

    },

    createActiveTask: function( task ){
        return (<ActiveTask data={task} 
                    onSave={this.taskUpdate}
                    onDelete={this.taskDelete}
                    onDone={this.taskDone}
                    onDrag={this.taskDrag}
                />);
    },
    createDoneTask: function( task ){
        return (<DoneTask data={task} 
                    onDelete={this.taskDelete}
                    onActive={this.taskActive}
                />);
    },

    render: function(){
        console.log( "path " + this.getPath() );
        console.log( this.getParams());
        if( !this.state.loaded ){
            return (
                <div className="content loading">
                </div>
            ) 
        }else{ 

            var state = {type:"day", id:"today"};
            var params = this.getParams();
            if( params.type ) state.type = params.type;
            if( params.id ) state.id = params.id;

            var folders = this.createFolders();
            var tasks = {active:[], done:[] };

            if( state.type == "day" ){
                var d = this.state.data.days[state.id]; 
                if( d ){
                    state.date = d.date; 
                    state.name = d.name; 
                    tasks = this.createTasks( d.ids );
                }
            }else if(state.type == "folder"){
                var f = this.state.data.folders;
                for( var i=0;i<f.length; i++ ){
                    if( id == f[i].id ){
                        state.folderid = id;              
                        state.name = f[i].name;
                        tasks = this.createTasks( f[i].ids );
                        break;
                    }
                }
            }
            if( !state.data && !state.folderid ){
                state.none = true; 
            }
            console.log(state);
            console.log(folders);
            console.log(tasks);
            return (
                <div className="content" >
                    <ContentMenu state={state}
                        days={this.state.data.days}
                        folders={folders}
                        folderAdd={this.folderAdd}
                    />
                    <ContentMain state={state}
                        folders={this.state.data.folders}
                        tasks={tasks}
                        taskAdd={this.taskAdd}
                    />
                </div>        
            ) 

        }
    }
});


// Content */
// ContentMenu 

var ContentMenu = React.createClass({
    propTypes: {
        state: React.PropTypes.shape({ 
            type: React.PropTypes.string.isRequired,
            id: React.PropTypes.string.isRequired
        }),
        days: React.PropTypes.object.isRequired ,
        folders: React.PropTypes.arrayOf( React.PropTypes.node ),
        folderAdd: React.PropTypes.func.isRequired
    },
    _folderAdd:function( data ){
        this.props.folderAdd( data ); 
    },
    render: function(){
        return (
            <div className="content-menu">
                <DayMenu data={this.props.days} />
                <div className="folder-menu">
                    <FolderAdd add={this._folderAdd} />
                    <div className="folder-list">
                        {this.props.folders}
                    </div>
                </div>
            </div>
        ) 
    }
});

var DayMenu = React.createClass({
     propTypes: {
        data: React.PropTypes.object.isRequired 
     },
     render: function(){
        return (
            <div className="day-menu">
                <MenuTemplate type="day" id="today" count={this.props.data.today.count} image="images/arrow-icon.png" name="Today" />    
                <MenuTemplate type="day" id="tomorrow" count={this.props.data.tomorrow.count} image="images/arrow-icon.png" name="Tomorrow" />    
                <MenuTemplate type="day" id="anytime" count={this.props.data.anytime.count} image="images/arrow-icon.png" name="Anytime" />    
                <MenuTemplate type="day" id="past" count={this.props.data.past.count} image="images/stock-icon.png" name="Past" lastline={true} />    
            </div>
        )
    }
});

var FolderAdd = React.createClass({
     propTypes: {
        add: React.PropTypes.func.isRequired 
     },
     render: function(){
        return (
            <div className="menu-label menu-label-last">
                <a href="#">
                    <img src="images/add-icon.png" alt="" />
                    <span>add</span>
                </a>
            </div>
        )
    }
});

var MenuTemplate = React.createClass({
    propTypes: {
        count: React.PropTypes.number.isRequired, 
        type: React.PropTypes.string.isRequired, 
        id: React.PropTypes.string.isRequired 
    },
    render: function(){
        var classString = "menu-label";
        var c = this.props.count;
        if(this.props.lastline){
            classString += " menu-label-last";
        }
        if( c <= 0 ){
            c = ""; 
        }else if( c >= 100 ){
            c = "+99"; 
        }
        return (
            <div className={classString}>
                <Link to="list" params={{type: this.props.type, id: this.props.id}}>
                    <img src={this.props.image} alt=""/>
                    <span>{this.props.name}</span>
                </Link>
                <p>{c}</p>
            </div>
        )
   }
});

// ContentMenu */
// ContentMain

var ContentMain = React.createClass({
    propTypes: {
        state: React.PropTypes.shape({ 
            type: React.PropTypes.string.isRequired,
            id: React.PropTypes.string.isRequired
        }),
        tasks: React.PropTypes.shape({
            active: React.PropTypes.arrayOf(React.PropTypes.node),
            done:   React.PropTypes.arrayOf(React.PropTypes.node)
        }),
        folders: React.PropTypes.array,
        taskAdd: React.PropTypes.func.isRequired
    },
    _taskAdd: function(data){
        this.props.taskAdd(data);
    },

    render: function(){

        if(state.none){
            return (
                <div className="content-main">
                ページが見つかりません
                </div>
            );
        }
        
        var addElem = (<div></div>);
        if(this.props.state.type != "day" || this.props.state.id != "past"){
            addElem =  ( <TaskAdd folders={this.props.folders}
                            defaultdate={this.props.state.date}
                            defaultfolder={this.props.state.folderid}
                            add={this._taskAdd}
                        />
                      ); 
        }

        return (
            <div className="content-main">
                <div className="content-main-inner">
                    <div className="menu-title" >
                        <p>{this.props.state.name}</p>
                    </div>
                    {addElem} 
                    <div className="task-list">
                        <ActiveTasks list={this.props.tasks.active} />
                        <div className="task-separate-line" />
                        <DoneTasks list={this.props.tasks.done} />
                    </div>
                </div>
            </div>
        )
    }
});

/*
var ContentMainInner = React.createClass({
    taskAdd: function(data){
        this.props.taskAdd(data);
    }, 
    taskUpdate:function(id, data){
        this.props.taskUpdate(id, data);
    },
    taskDelete: function(id){
        this.props.taskDelete(id); 
    },
    render: function(){
        var addComp = (<div></div>);
        if( this.props.state.enableAdd ){
            addComp = ( <TaskAdd folders={this.props.folders}
                            defaultdate={this.props.state.date}
                            defaultfolder={this.props.state.folderid}
                            add={this.taskAdd}
                        />
                      );   
        }
        return (
            <div className="content-main-inner">
                <MenuTitle title={this.props.state.name} />
                {addComp} 
                <TaskList tasks={this.props.tasks}
                    update={this.taskUpdate}
                    delete={this.taskDelete}
                />
            </div>
        ) 
    }
});

var MenuTitle = React.createClass({
    render: function(){
        return (
            <div className="menu-title" >
                <p>{this.props.title}</p>
            </div>
        ) 
    }
})
*/

var TaskAdd = React.createClass({
    propTypes: {
        folders: React.PropTypes.array,
        defaultdate:   React.PropTypes.string, 
        defaultfolder: React.PropTypes.string, 
        add: React.PropTypes.func.isRequired
    },
    _init_state: { 
        showtype: "show" ,
        title: "" ,
        date: "",
        folder :""
    },
    _onClickAdd: function(){
        if(this.state.showtype != "add"){
            this.setState({showtype: "add"});
        } 
        return false;
    },
    _onClickCancel: function(){
        if(this.state.showtype != "show"){
            this.setState({showtype: "show"});
        } 
        return false;
    },
    _onSave: function(){
        /*
        var title  = this.refs.title.getDOMNode().value;
        var date   = this.refs.date.getDOMNode().value;
        var folder = this.refs.folder.getDOMNode().value;
*/
        //※要入力チェック

        this.props.add(
            {title: this.state.title, 
             date: this.state.date,
             folder: this.state.folder
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
    componentWillReceiveProps: function(newProps){
        var state = this._init_state;
        state.date = newProps.defaultdate;
        state.folder = newProps.defaultfolder;
        this.setState(state); 
    },
    getInitialState: function(){
        var state = this._init_state;
        state.date = this.props.defaultdate;
        state.folder = this.props.defaultfolder;
        return state;
    },  
    render: function(){
        var classnameNew   = "task-add-new";
        var classnameInput = "task-add-input";
        var classnameClose = "task-add-close";
        var classnameInfo  = "task-add-info";
        if(this.state.showtype != "add"){
            classnameClose += " hidden";
            classnameInput += " task-add-input-close";
            classnameInfo += " task-add-info-close";
        }else{
            classnameNew += " hidden";
            classnameInfo += " task-add-info-open";
        }
        
        var folders = this.props.folders.map(function (f) {
            return (
                <option value={f.id}>{f.name}</option>
            );
        });

        return (
            <div className="task-add">
                <div className={classnameNew} >
                    <a href="#" onClick={this._onClickAdd} >
                        <img src="images/add-icon.png" alt=""/>
                        <span>add</span>
                    </a>
                </div>
                <div className={classnameInput} >
                    <div className={classnameClose} >
                        <a href="#" onClick={this._onClickCancel} >
                            <img src="images/remove-icon.png" alt=""/>
                        </a>
                    </div>
                    <div className={classnameInfo} >
                        <div className="task-add-title" > 
                            <input className="task-title-input" type="text" name="title" 
                                onChange={this._onChangeTitle} 
                                value={this.state.title} 
                            />
                        </div>
                        <div className="task-add-date" >
                            <input className="task-date-input" type="text" name="date" 
                                onChange={this._onChangeDate}
                                placeholder="yyyy/mm/dd" value={this.state.date} 
                            />
                        </div>
                        <div className="task-add-folder" >
                            <select name="folder" ref="folder" 
                                onChange={this._onChangeFolder} value={this.state.folder} 
                            >
                                <option value="" >-未選択-</option>
                                {folders}
                            </select>
                        </div>
                        <div className="task-add-buttons">
                            <button className="task-save-button" type="button" name="save" onClick={this._onSave} >Save</button>
                        </div>            
                    </div>
                </div>
            </div>
        )
    }
});

/*
var TaskList = React.createClass({
    render: function(){
        var tasks = this.props.tasks;        
        var actives = [];
        var dones = [];
        for(var i=0;i<tasks.length;i++){
            switch(tasks[i].status){
                case "active":
                    actives.push(tasks[i]);
                    break;
                case "done":
                    dones.push(tasks[i]);
                    break;
            }
        }
        return (
            <div className="task-list">
                <ActiveTasks list={actives} />
                <div className="task-separate-line" />
                <DoneTasks list={dones} />
            </div>
        )
    }
});
*/

var ActiveTasks = React.createClass({
    propTypes: {
        list: React.PropTypes.arrayOf( React.PropTypes.node )
    },
    _init_state: {
        editing_id: false 
    },
    getInitialState: function(){
        return this._init_state;
    }, 
    componentWillReceiveProps: function(newProps){
        this.setState( this._init_state );
    }, 
    _onEdit: function(id){
    }, 
    _onCancel: function(id){
         
    },
    render: function(){
        /*
        var _this = this;
        var tasks = this.props.list.map(function (task) {
            var showtype ="show";
            if( _this.state.editing_id == task.id ){
                showtype = "edit"; 
            }
            return (
                <ActiveTask data={task} showtype={showtype}
                    onEdit={_this._onEdit}

                />
            );
        });
        */
        return (
            <div className="active-tasks">
                {this.props.list}
            </div>
        );            
    } 
});

var DoneTasks = React.createClass({
    propTypes: {
        list: React.PropTypes.arrayOf( React.PropTypes.node )
    },
    render: function(){
        return (
            <div className="done-tasks">
                {this.props.list}
            </div>
        );            
    } 

});

var DoneTask = React.createClass({
    propTypes: {
        data: React.PropTypes.shape({
            id: React.PropTypes.string.isRequired,
            title: React.PropTypes.string.isRequired
        }),
        onActive: React.PropTypes.func.isRequired,
        onDelete: React.PropTypes.func.isRequired
    },
    _onActive:function(){
        this.props.onActive(this.props.data.id);
    },
    _onDelete:function(){
        this.props.onDelete(this.props.data.id);
    },
    render:function(){
        return (
            <div className="done-task" >
                <div className="done-task-info">
                <div className="done-task-check" onClick={this._onActive}>
                    <img src="images/check-icon.png" alt="" />
                </div>
                <div className="done-task-title">
                    <p>{this.props.data.title}</p>
                </div>
                </div>
            </div>
        ) 
    }
});


