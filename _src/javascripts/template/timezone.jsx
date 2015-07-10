module.exports = React.createClass({
    propTypes:{
        classname:React.PropTypes.string.isRequired,
        name:React.PropTypes.string.isRequired,
        value:React.PropTypes.string.isRequired,
        onChange:React.PropTypes.func.isRequired
    },
    render:function(){ 
        return (
            <select className={this.props.classname} 
                    name={this.props.name}
                    value={this.props.value}
                    onChange={this.props.onChange} >
                <option value="Australia/Sydney" >{Messages.get("timezone")["Australia/Sydney"]}</option>
                <option value="Asia/Tokyo" >{Messages.get("timezone")["Asia/Tokyo"]}</option>
            </select>
               );
    }
});

