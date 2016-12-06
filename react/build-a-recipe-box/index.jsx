// 引入ReactBootstrap的组件定义
var Panel = ReactBootstrap.Panel;
var Accordion = ReactBootstrap.Accordion;
var Button = ReactBootstrap.Button;
var FormControl = ReactBootstrap.FormControl;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;
var Modal = ReactBootstrap.Modal;
var OverlayTrigger = ReactBootstrap.OverlayTrigger;
var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;

// 本地存储的初始化处理
// caipins 是菜品 数组
var caipins = (typeof localStorage["xds_caipins"] != "undefined") ? JSON.parse(localStorage["xds_caipins"]) : [
  {cpname: "开水白菜", shicais: ["鸡汤", "白菜"]},
  {cpname: "回锅肉", shicais: ["猪肉", "蒜苗", "豆瓣"]},
  {cpname: "辣子鸡", shicais: ["鸡", "辣椒", "花椒"]}
];
var cpname = "";// 菜品名
var shicais = [];  //食材数组

// 定义菜品单 Caipins 组件
var Caipins = React.createClass({
  render:function() {
    return(
      <div>
        <Accordion>
          {this.props.data}
        </Accordion>
      </div>
    );
  }
});

// 定义菜品 Caipin 组件，有2个操作，删除 delme 和 编辑 edit
var Caipin = React.createClass({
  delme:function() {
    caipins.splice(this.props.index,1);// 利用数组内置方法 删除本菜品对应信息
    update();
  },
  edit:function() {
    cpname = this.props.cpname;
    shicais = this.props.shicais;
    document.getElementById("show").click();
  },
  render:function() {
    return(
      <div>
        <h4 className="text-center">食材</h4><hr/>
        <ShicaiList shicais={this.props.shicais} />
        <ButtonToolbar>
          <Button class="delete" bsStyle="danger" id={"btn-del"+this.props.index} onClick={this.delme}>删除</Button>
          <Button bsStyle="default" id={"btn-edit"+this.props.index} onClick={this.edit}>编辑</Button>
        </ButtonToolbar>
      </div>
    );
  }
});

// 定义食材列表 ShicaiList 组件
var ShicaiList = React.createClass({
  render:function(){
    var shicaiList = this.props.shicais.map(function(shicai) {
      return (
        <ListGroupItem>
          {shicai}
        </ListGroupItem>
      );
    });
    return(
      <ListGroup>
        {shicaiList}
      </ListGroup>
    );
  }
});

// 数据更新处理
function update() {
  localStorage.setItem("xds_caipins",JSON.stringify(caipins));
  var rows = [];
  for(var i=0;i<caipins.length;i++){
    rows.push(
      <Panel header={caipins[i].cpname} eventKey={i} bsStyle="success">
        <Caipin cpname={caipins[i].cpname} shicais={caipins[i].shicais} index={i} />
      </Panel>
    );
  }
  ReactDOM.render(<Caipins data={rows} />,document.getElementById("wrapper"));
}

// 定义添加菜品 CaipinAdd 组件
//*
var CaipinAdd = React.createClass({
  getInitialState:function() {
    return ({showModal:false});
  },
  close:function(){
    cpname = "";
    shicais =[];
    this.setState({showModal:false});
  },
  open:function(){
    this.setState({ showModal: true });
    if(document.getElementById("cpname") && document.getElementById("shicais")){
      $("#cpname").val(cpname);
      $("#shicais").val(shicais);
      if(cpname !=""){
        $("#modalTitle").text("编辑菜品");
        $("#addButton").text("编辑菜品");
      }
    }else{
      requestAnimationFrame(this.open);
    }
  },
  add:function(){ //插入添加
    var acpname  = document.getElementById("cpname").value;
    var ashicais = document.getElementById("shicais").value.split(",");
    var flag =false;
    for(var i=0;i<caipins.length;i++){
      if(caipins[i].cpname===acpname){
        caipins[i].shicais=ashicais;
        flag = true;
        break;
      }
    }
    if(!flag){
      if(cpname.length < 1) cpname = "未命名";
      caipins.push({cpname:acpname,shicais:ashicais});
    }
    update();
    this.close();
  },
  render:function(){
    return (
      <div>
        <Button
          bsStyle="primary"
          bsSize="large"
          onClick={this.open}
          id="show"
        >
          添加菜品
        </Button>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title id="modalTitle">
              添加菜品
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormControl
              id="cpname"
              type="text"
              label="菜品"
              placeholder="菜品名"
              />
            <FormControl
                id="shicais"
                type="textarea"
                label="食材"
                placeholder="食材内容，以逗号分隔"
              />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.add} bsStyle="primary" id="addButton">添加菜品</Button>
            <Button onClick={this.close}>关闭</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
});
//*/

ReactDOM.render(<CaipinAdd />,document.getElementById("button"));
update();
