
module.exports = React.createClass({
    propTypes: {
        data: React.PropTypes.shape({
            taskid: React.PropTypes.string.isRequired,
            title: React.PropTypes.string.isRequired
        }),
        onActive: React.PropTypes.func.isRequired,
        onDelete: React.PropTypes.func.isRequired
    },
    _onActive:function(){
        console.log("active");
        this.props.onActive(this.props.data.taskid);
    },
    _onDelete:function(){
        console.log("delete");
        this.props.onDelete(this.props.data.taskid);
    },
    render:function(){
        return (
            <div className="done-task" >
                <div className="done-task-info">
                    <div className="done-task-check" onClick={this._onActive}>
                        <img src="/images/check-icon.png" alt="" />
                    </div>
                    <div className="done-task-title">
                        <p>{this.props.data.title}</p>
                    </div>
                </div>
                <div className="donetask-bin" >
                    <img src="/images/bin-icon.png" alt="" onClick={this._onDelete}/>       
                </div>
            </div>
        ) 
    }
});
