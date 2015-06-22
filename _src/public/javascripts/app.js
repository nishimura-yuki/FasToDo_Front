
var timezone_offset = 540; //Sydney 10h = 600m
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
    render: function(){
        return (
            <div className="task-add">
                <a href="#">
                    <img src="images/add-icon.png" alt=""/>
                    <span>add</span>
                </a>
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
    render: function(){
        return (
             
        )    
    } 
});

var ActiveTask = React.createClass({
    render: function(){
        return (
            <div className="active-task" >
                <ActiveTask_Buttons />
                <ActiveTask_Drag />
                <img class="task-drag" src="images/list-icon.png" alt="" />
                <div class="task-info">
                    <img class="task-check" src="images/check-icon.png" alt="" />
                    <div class="task-title">
                        <p>{this.props.data.title}</p>
                        <input type="text" value="Reading a book" />
                    </div>
                </div>
                <img class="task-bin" src="images/bin-icon.png" alt="" />
            </div>
        ) 
    }
});

var ActiveTask_Buttons = React.createClass({
    render: function(){
        return (
            <div className="activetask-buttons">
                <button type="button" name="save">Save</button>
                <button type="button" name="cancel">Cancel</button>
            </div>    
        )    
    }
});

var ActiveTask_Drag = React.createClass({
    render: function(){
        return (
            <div className="activetask-drag">
                <img src="images/list-icon.png" alt="" /> 
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
    <div>
        <Header />
        <Content />
    </div> ,
  document.getElementById('wrapper')
);


