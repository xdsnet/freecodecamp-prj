/*
 * 定义页面头/底部
 */
var Header=React.createClass({
  render:function(){
    return (
      <header>
        <a href="http://www.freecodecamp.com">
          <img className="fcclogo" src="https://s3.amazonaws.com/freecodecamp/freecodecamp_logo.svg" alt="FreeCodeCamp logo" />
        </a>
      </header>
      );
  }
});

var Footer=React.createClass({
  render:function(){
    return (
      <footer>
        <div className="container">
          <p> By <a href="http://www.freecodecamp.cn/xdsnet">@xdsnet</a> </p>
        </div>
      </footer>
    );
  }
});

/*
 * 表格标题行的定义 
 */
var ColumnHeadings=React.createClass({
  render:function(){
    return (
      <thead>
      <tr id="colheaders" className="top100">
        <th className="idcol">排名</th>
        <th>Fcc用户ID</th> 
        <th id="recentSort" className="sortable sorted true" onClick={this.handleSortType.bind(this, "recent")}>最近30天完成情况</th>
        <th id="allSort" className="sortable" onClick={this.handleSortType.bind(this, "alltime")}>总完成情况</th>
      </tr>
      </thead>
    );
  },
  ycSortClasses:function(){
    $(".sorted").removeClass("sorted").removeClass("true");
  },
  handleSortType(fieldname,evt){
    if (!evt.target.classList.contains('sorted')) { //判断是否已经是排序类型，不是时再出来
      this.ycSortClasses();
      evt.target.className = 'sortable sorted true'; // true类型显示一个对应的图标
      this.props.sortTableNum(fieldname);    //获取对应数据
    } 
  }
});


/*
 *  单个用户的信息及处理组件
 */
var User=React.createClass({
  render:function(){
    var showDate = moment(this.props.user.lastUpdate).format("YYYY-MM-DD HH:mm:ss");//利用moment格式最新时间
    return (
      <tr className="top100">
        <td className="idcol">{this.props.count}</td>
        <td>
          <a href={"http://www.freecodecamp.com/"+this.props.user.username} target="_blank">
            <img src={this.props.user.img} className="userimg"/>
            <span>{this.props.user.username}</span>
          </a>
        </td>
        <td className="numbercol">{this.props.user.recent}</td>
        <td className="numbercol">{this.props.user.alltime}</td>
      </tr>
    );
  },
  handleClickUpdateUser:function() {
    $.get( this.props.apiroot+"update/"+this.props.user.username, 
          function( data ) {
            setTimeout(this.props.updatePage,3000); //设置3秒后自动更新
          }.bind(this)
        )
    .fail(function() {
        console.error(this.props.apiroot, status, err.toString());
    });
  }
});

/*
 *  排行榜实际组件（循环获取返回的实现）  
 */

var Phb=React.createClass({
    render:function(){
      var count = 0;
      var self = this;
      var userlist = this.props.users.map(function(user) {
         count++;
         return (
           <User user={user} key={user.username} count={count} apiroot={this.props.apiroot} updatePage={this.props.updatePage}/>
         );
      }.bind(this));

      return (
       <table className="table table-striped table-bordered">
          <ColumnHeadings sortTableNum={this.props.sortTableNum}/>
          <tbody>
            {userlist}
          </tbody>
      </table>
    );
  }
});



 
/* 
 * 列表部分组件AllWrap
 */

var AllWrap=React.createClass( {
    getInitialState:function(){ 
        return {
            users:[],
            reverse:true,
            column:"recent"
        }
    },
   getDefaultProps:function() {
    return {
            users:[],
            reverse:true,
            column:"recent"
    };
  },
  getData:function() {
    $.ajax({
      url: this.props.apiroot+"top/"+this.state.column,
      dataType: 'json', 
      cache: false,
      success: function(data) {
        var users = data;
        this.setState({users: users});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.apiroot, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount:function() {
    this.getData();
  },
  render:function() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
        	  <div id="header">
        		  <h3>任务完成排行榜</h3>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
              <Phb 
                users={this.state.users} 
                apiroot={this.props.apiroot} 
                updatePage={this.getData.bind(this)} 
                sortTableNum={this.sortTableNum.bind(this)} 
                />
           </div>
        </div>
      </div>
    );
  },
  removeSortClasses() {
    var nodes = document.getElementsByClassName('sortable');
    for (var i=0; i < nodes.length; i++) {
      nodes.item(i).className = "sortable";
    };
  },
  sortTableNum(column) {
     // only sort descending. After all it's a top100
     // Ignore click if the list was already sorted on that item
     if (column !== this.state.column) {
        this.setState({reverse: true, column: column},  this.getData);
     }
   }
});

 

/*
 * 顶层的Myapp组件
 */
var Myapp=React.createClass({
  render:function(){
    return (<div>
      <Header />
      <AllWrap apiroot={this.props.apiroot} />
      <Footer />
    </div>);
  }
}); 



/* 
 * 在 HTML 中生成
 */
ReactDOM.render(<Myapp  apiroot="http://fcctop100.herokuapp.com/api/fccusers/"/>, document.getElementById('main'));

