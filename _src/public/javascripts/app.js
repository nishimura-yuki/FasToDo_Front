
//var timezone_offset = 540; //Tokyo  9h = 540m
var timezone_offset = 600; //Sydney 10h = 600m

var folder_data =[
    {folderid:1, foldername:"test", count: 0},
    {folderid:2, foldername:"test2", count: 40}
];
var current_focus = {
    type: "date",
    name: "Today",
    ref_date: "today"
};

var tasks = [
    { id: "01", title: "shopping", date:"2015-06-22", folderid:0, status: "active" },
    { id: "02", title: "training", date:"2015-06-21", folderid:1, status: "active" },
    { id: "03", title: "work", date:"2015-06-23", folderid:2, status: "active" },
    { id: "04", title: "playing piano", date:"2015-06-24", folderid:1, status: "done" },
    { id: "05", title: "reading books", date:"2015-06-22", folderid:1, status: "active" },
    { id: "06", title: "dinner with girlfriend", date:"2015-06-22", folderid:0, status: "active" },
    { id: "07", title: "reporting", date:"2015-06-22", folderid:2, status: "done" },
    { id: "08", title: "study English", date:"2015-06-22", folderid:2, status: "done" },
];




// Header

var Header = React.createClass({
  render: function() {
    return (
      <div className="header">
        <Clock/>
        <HeaderInfo/>
      </div>
    )
  }
});

var Clock = React.createClass({
    getInitialState: function(){
        return { time: this.calcRestOfTime() };
    } , 
    componentDidMount: function(){
        this.timer = setInterval(this.tick, 1000);
    } ,
    componentWillUnmount: function(){
        clearInterval(this.timer);
    } ,
    tick: function(){
        this.setState({"time": this.calcRestOfTime()});
    } ,
    calcRestOfTime: function(){
        var localDate = new Date();
        var utcDate = new Date( localDate.getTime() + localDate.getTimezoneOffset() * 60000 ); 
        var dateByTimezone = new Date( utcDate.getTime()  + timezone_offset * 60000);

        var diffHour = ("0" + (23 - dateByTimezone.getHours())).slice(-2);
        var diffMin = ("0" + (59 - dateByTimezone.getMinutes())).slice(-2);
        var diffSec = ("0" + (59 - dateByTimezone.getSeconds())).slice(-2);
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

var HeaderInfo =  React.createClass({
    render: function(){
        return (
            <div className="header-info">
                <SearchText />
                <ConfigIcon />
            </div>         
        )
    }
});

var SearchText = React.createClass({
    render: function(){
        return (
            <div className="search-text">
                <img src="images/search-icon.png" alt=""/>
                <input type="text" name="search" />
            </div>
        )
    }
});

var ConfigIcon = React.createClass({
    render: function(){
        return (
            <div className="config-icon">
                <img src="images/config-icon.png" alt=""/>
            </div>
        ) 
    }
});

// Header */
// Content

var Content = React.createClass({
    render: function(){
        return (
            <div className="content" >
                <ContentMenu />
                <ContentMain />
            </div>
        ) 
    }
});

// Content */
// ContentMenu 

var ContentMenu = React.createClass({
    render: function(){
        return (
            <div className="content-menu">
                <DayMenu />
                <FolderMenu />
            </div>
        ) 
    }
});

var DayMenu = React.createClass({
    render: function(){
        return (
            <div className="day-menu">
                <MenuTemplate image="images/arrow-icon.png" name="Today" />    
                <MenuTemplate image="images/arrow-icon.png" name="Tomorrow" />    
                <MenuTemplate image="images/arrow-icon.png" name="Anytime" />    
                <MenuTemplate lastline="true" image="images/stock-icon.png" name="Past" />    
            </div>
        )
    }
});

var FolderMenu = React.createClass({
   render: function(){
        return (
            <div className="folder-menu">
                <FolderAdd />
                <FolderList data={folder_data} />
            </div>
        )
    }
});

var FolderAdd = React.createClass({
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

var FolderList = React.createClass({
    render: function() {
        var folders = this.props.data.map(function (folder) {
            return (
                <MenuTemplate image="images/folder-icon.png" name={folder.foldername} />
            );
        });
        return (
            <div className="folder-list">
                {folders}
            </div>
        );
    }
});

var MenuTemplate = React.createClass({
    getInitialState: function(){
        return { count: "" };
    }, 
    updateCount: function(c){
        if(c >= 100){
            c = "+99";
            this.setState({"count": c});
        }
    },
    render: function(){
        var classString = "menu-label";
        if(this.props.lastline){
            classString += " menu-label-last";
        }
        return (
            <div className={classString}>
                <a href="#">
                    <img src={this.props.image} alt=""/>
                    <span>{this.props.name}</span>
                </a>
                <p>{this.state.count}</p>
            </div>
        )
   }
});

// ContentMenu */
// ContentMain

var ContentMain = React.createClass({
    render: function(){
        return (
            <div className="content-main">
                <ContentMainInner />
            </div>
        )
    }
});
var ContentMainInner = React.createClass({
    render: function(){
        return (
            <div className="content-main-inner">
                <MenuTitle title={current_focus.name} />
                <TaskAdd />
                <TaskList tasks={tasks} />
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

var TaskAdd = React.createClass({
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
    
    },
    getInitialState: function(){
        return { showtype: "show" };
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
                            <input className="task-title-input" type="text" name="title" />
                        </div>
                        <div className="task-add-date" >
                            <input className="task-date-input" type="text" name="date" placeholder="yyyy/mm/dd" />
                        </div>
                        <div className="task-add-folder" >
                            <select name="folder">
                                <option value="ID01">選択肢1</option>
                                <option value="ID02">選択肢2</option>
                                <option value="ID03">選択肢3</option>
                            </select>
                        </div>
                        <div className="task-add-buttons">
                            <button className="task-save-button" type="button" name="save">Save</button>
                        </div>            
                    </div>
                </div>
            </div>
        )
    }
});

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

var ActiveTasks = React.createClass({
    _onEdit: function(id){
        console.log("edit " + id); 
        this.setState({editing_id: id});
    }, 
    getInitialState: function(){
        return { editing_id: false };
    },   
    render: function(){
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
        return (
            <div className="active-tasks">
                {tasks}
            </div>
        );            
    } 
});

var ActiveTask = React.createClass({
    propTypes: {
        data: React.PropTypes.shape({
            id: React.PropTypes.string.isRequired,
            title: React.PropTypes.string.isRequired
        }),
        onEdit: React.PropTypes.func.isRequired,
        onDone: React.PropTypes.func.isRequired,
        onSave: React.PropTypes.func.isRequired,
        onCancel: React.PropTypes.func.isRequired,
        onDrag: React.PropTypes.func.isRequired,
        onDelete: React.PropTypes.func.isRequired
    },
    _onEdit: function(){
        console.log("parent edit");
        this.props.onEdit(this.props.data.id);
    },
    _onDone: function(){
        console.log("parent done"); 
        this.props.onDone(this.props.data.id);
    },
    _onSave: function(){
    
    },
    _onCancel: function(){
    
    },
    _onDrag: function(){
    
    },
    _onDelete: function(){
    
    },
    render: function(){
        var classname = "active-task";
        if(this.props.showtype == "edit"){
            classname += " active-task-edit"; 
        }else{
            classname += " active-task-normal";
        }
        return (
            <div className={classname} >
                <ActiveTask_Buttons showtype={this.props.showtype} />
                <ActiveTask_Drag showtype={this.props.showtype} />
                <ActiveTask_Info showtype={this.props.showtype} data={this.props.data} onEdit={this._onEdit} onDone={this._onDone} />
                <ActiveTask_Bin showtype={this.props.showtype} />
            </div>
        ) 
    }
});

var ActiveTask_Buttons = React.createClass({
    render: function(){
        var classname = "activetask-buttons";
        if(this.props.showtype != "edit"){
            classname += " hidden";
        }
        return (
            <div className={classname}>
                <button className="task-save-button" type="button" name="save">Save</button>
                <button className="task-cancel-button" type="button" name="cancel">Cancel</button>
            </div>    
        )    
    }
});

var ActiveTask_Drag = React.createClass({
    
    render: function(){
        var show = "";
        if(this.props.showtype == "edit"){
            show = "hidden";
        }
        return (
            <div className="activetask-drag">
                <img className={show} src="images/list-icon.png" alt="" /> 
            </div>
        ) 
    }    
});

var ActiveTask_Info = React.createClass({
    propTypes: {
        data: React.PropTypes.shape({
            id: React.PropTypes.string.isRequired,
            title: React.PropTypes.string.isRequired
        }),
        showtype: React.PropTypes.string.isRequired,
        onEdit: React.PropTypes.func.isRequired,
        onDone: React.PropTypes.func.isRequired
    },

    clickDone: function(){
        this.props.onDone();
    },
    clickInfo: function(){
        this.props.onEdit();
    },
    render: function(){
        var title_class = "activetask-title activetask-title-show"; 
        var input_class = "activetask-title activetask-title-input";
        if(this.props.showtype == "edit"){
            title_class += " hidden";
        }else{
            input_class += " hidden";
        }
        return (
            <div className="activetask-info" onClick={this.clickInfo} >
                <div className="activetask-check" onClick={this.clickDone}>
                    <img src="images/check-icon.png" alt="" />
                </div>
                <div className={title_class}>
                    <p>{this.props.data.title}</p>
                </div>
                <div className={input_class}>
                    <input className="task-title-input" type="text" value={this.props.data.title} />
                </div>
            </div>
        )
    }
});

var ActiveTask_Bin = React.createClass({
    render: function(){
        var classname = "activetask-bin";
        if(this.props.showtype == "edit"){
            classname += " hidden";
        }
        return (
            <div className={classname}>
                 <img src="images/bin-icon.png" alt="" />       
            </div>
        )    
    }
});

var DoneTasks = React.createClass({
    render: function(){
        return (
            <div>
            </div>
        )    
    } 
});
var DoneTask = React.createClass({
    render:function(){
        return (
            <div>
            </div>
        ) 
    }
});


// ContentMain */

// Render
React.render(
    <div className="wrapper">
        <Header />
        <Content />
    </div> ,
  document.getElementById('wrapper')
);


