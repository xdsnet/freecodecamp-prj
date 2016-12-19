'use strict';
// 文档采用了react 和 redux 并使用了ES2015语法，如果 算子,const let 和 箭头函数，
// 如果对这些不熟悉，建议先进行了解。

// 游戏常数,属性配置
const ATTACK_VARIANCE = 7; // 攻击方差
const tileType = { // 地图类型 墙体为0，地板为1
  WALL: 0,
  FLOOR: 1
};
//  反向查询数据定义
const reverseLookup = ['WALL', 'FLOOR'];
const weaponTypes = [ // 武器参数
  {
    entityName: '黄铜剑',
    entityType: 'weapon',
    health: 0,
    attack: 7
  },
  {
    entityName: '军刃',
    entityType: 'weapon',
    health: 0,
    attack: 12
  },
  {
    entityName: '武士刀',
    entityType: 'weapon',
    health: 0,
    attack: 16
  },
  {
    entityName: '死神的镰刀',
    entityType: 'weapon',
    health: 0,
    attack: 22
  },
  {
    entityName: '神器-菜刀',
    entityType: 'weapon',
    health: 0,
    attack: 30
  }
];
// 普通的敌人参数，生命、攻击力和经验都是是层数+默认值
const ENEMY = {
  health: 20, // 生命 
  attack: 12, // 攻击力
  xp: 10      // 经验
};
const PLAYER = { // 玩家初始参数
  baseHealth: 100, //基础生命
  health: 20,    // 生命
  attack: 12,    // 攻击力
  toNextLevel: 60  // 升级经验需求
};

// 安装 humane 的弹出通知
var notifier = humane.create({baseCls: 'humane-jackedup', timeout: 5000});
notifier.error = notifier.spawn({addnCls: 'humane-jackedup-error'});
notifier.success = notifier.spawn({addnCls: 'humane-jackedup-success'});

/** REDUX 代码 **/
// REDUX结合行为创建 (Bound Action Creators)
function damage(entity, value) { // 攻击伤害行为
  store.dispatch({type: 'DAMAGE', entityName: entity, value: value});
}
function heal(entity, health) { // 加生命行为
  store.dispatch({type: 'HEAL', entityName: entity, value: health});
}
function move(entity, vector) { //移动行为
  store.dispatch({type: 'MOVE', entityName: entity, vector: vector});
}
function setLocation(entity, location) { // 放置实体行为
  store.dispatch({type: 'SET_LOCATION', entityName: entity, location: location});
}
function switchWeapon(weaponName, attack) { // 拾到武器行为
  store.dispatch({type: 'SWITCH_WEAPON', weapon: weaponName, attack: attack});
}
function addEntity(entityName, entityType, health, attack, location) { // 增加实体行为
  store.dispatch({type: 'ADD_ENTITY', entityName: entityName, entityType: entityType,
    health: health, attack: attack, location: location});
}
function removeEntity(entityName) { // 删除实体行为
  store.dispatch({type: 'REMOVE_ENTITY', entityName: entityName});
}
function resetBoard() { // 重置边界
  store.dispatch({type: 'RESET_BOARD'});
}
function setMap(map) {  // 设置地图
  store.dispatch({type: 'SET_MAP', map: map});
}
function increaseLevel() { // 增加层
  store.dispatch({type: 'INCREASE_LEVEL'});
}
function resetLevel() { // 重置层
  store.dispatch({type: 'RESET_LEVEL'});
}
function setWindowSize() { // 设置窗口尺寸
  store.dispatch({type: 'SET_WINDOW_SIZE',
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight
  });
}
function gainXp(xp) {  // 经验处理
  store.dispatch({type: 'GAIN_XP', xp: xp});
}
function levelUp(attack, health, xp) { // 经验升级 
  store.dispatch({type: 'LEVEL_UP',
    attack: attack,
    health: health,
    toNextLevel: xp
  });
}
function resetMap(map) { // 重置地图 
  store.dispatch({type: 'RESET_MAP', map: map});
}
function addBoss(attack, health, coords) { // 增加boss
  store.dispatch({type: 'ADD_BOSS', attack: attack, health: health, location: coords});
}
function toggleDarkness() { // 迷雾处理
  store.dispatch({type: 'TOGGLE_DARKNESS'});
}

// REDUX 初始化状态
const initialState = {
  // 实体是一个通过ids映射到对象的
  entities: {
    'player': {
      entityType: 'player',
      x: 0,
      y: 0,
      health: 100,
      inventory: {},
      weapon: '木棍',
      attack: 7,
      level: 0,
      toNextLevel: 60
    }
  },
  // 通过id链接到空间的站位符（表示玩家位置）
  occupiedSpaces: {
    '0x0': 'player'
  },
  map: [],
  level: 0,
  windowHeight: 500,
  windowWidth: 500,
  darkness: true
};

// REDUX Reducer 处理器 注意下面的...语法只展开顶层（明确的最下层）的对象，而不会递归展开，这样没有变化的对象可以很快复制，变化的对象属性由后面的定义覆盖
function rogueLikeReducer(state = initialState, action) {
  switch (action.type) {
    case 'DAMAGE': // 输出伤害（注意，这里处理两个方向的伤害，对玩家的/对敌人的）
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.entityName]: {
            ...state.entities[action.entityName],
            health: state.entities[action.entityName].health - action.value
          }
        }
      };
    case 'HEAL': // 生命力增加
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.entityName]: {
            ...state.entities[action.entityName],
            health: state.entities.player.health + action.value
          }
        }
      };
    case 'SWITCH_WEAPON': // 捡到武器
      return {
        ...state,
        entities: {
          ...state.entities,
          'player': {
            ...state.entities.player,
            weapon: action.weapon,
            attack: state.entities.player.attack + action.attack
          }
        }
      };
    case 'MOVE': // 移动
      return {
        ...state,
        occupiedSpaces: _.chain(state.occupiedSpaces)
                          .omit(`${state.entities[action.entityName]
                            .x}x${state.entities[action.entityName].y}`)    // 删除原来的位置
                          .set(`${state.entities[action.entityName].x +
                            action.vector.x}x${state.entities[action.entityName]
                              .y + action.vector.y}`,
                            action.entityName)                              // 设置新的位置
                          .value(),
        entities: {
          ...state.entities,
          [action.entityName]: {
            ...state.entities[action.entityName],
            x: state.entities[action.entityName].x + action.vector.x,
            y: state.entities[action.entityName].y + action.vector.y
          }
        }
      };
    case 'SET_LOCATION': //设置位置
      return {
        ...state,
        occupiedSpaces: _.chain(state.occupiedSpaces)
                          .omit(`${state.entities[action.entityName]
                            .x}x${state.entities[action.entityName].y}`)            // 删除原来的位置
                          .set(`${action.location.x}x${action.location.y}`,
                            action.entityName)                                     // 设置新的位置
                          .value(),
        entities: {
          ...state.entities,
          [action.entityName]: {
            ...state.entities[action.entityName],
            x: action.location.x,
            y: action.location.y
          }
        }
      };
    case 'ADD_ENTITY': // 添加实体对象
      return {
        ...state,
        occupiedSpaces: {
          ...state.occupiedSpaces,
          [`${action.location.x}x${action.location.y}`]: action.entityName
        },
        entities: {
          ...state.entities,
          [action.entityName]: {
            entityType: action.entityType,
            health: action.health,
            attack: action.attack,
            x: action.location.x,
            y: action.location.y
          }
        }
      };
    case 'REMOVE_ENTITY': // 移除实体对象
      return {
        ...state,
        occupiedSpaces: _.chain(state.occupiedSpaces)
                          .omit(`${state.entities[action.entityName]
                            .x}x${state.entities[action.entityName].y}`) // 移除对象位置
                          .value(),
        entities: _.chain(state.entities)
                    .omit(action.entityName)                              // 移除对象
                    .value()
      };
    case 'RESET_BOARD': // 重置边界
      return {
        ...state,
        entities: {
          'player': state.entities.player
        },
        occupiedSpaces: {
          [`${state.entities.player.x}x${state.entities.player.y}`]: 'player'
        }
      };
    case 'SET_MAP': // 设置地图
      return {
        ...state,
        map: action.map
      };
    case 'INCREASE_LEVEL': // 增加层次
      return {
        ...state,
        level: state.level + 1
      };
    case 'RESET_LEVEL': // 重设层次
      return {
        ...state,
        level: 0
      };
    case 'SET_WINDOW_SIZE': // 设置窗口尺寸
      return {
        ...state,
        windowHeight: action.windowHeight,
        windowWidth: action.windowWidth
      };
    case 'GAIN_XP': // 升级经验需求
      return {
        ...state,
        entities: {
          ...state.entities,
          'player': {
            ...state.entities.player,
            toNextLevel: state.entities.player.toNextLevel - action.xp
          }
        }
      };
    case 'LEVEL_UP':  // 升级
      return {
        ...state,
        entities: {
          ...state.entities,
          'player': {
            ...state.entities.player,
            attack: state.entities.player.attack + action.attack,
            health: state.entities.player.health + action.health,
            toNextLevel: action.toNextLevel,
            level: state.entities.player.level + 1
          }
        }
      };
    case 'RESET_MAP': // 重设地图
      return {
        ...initialState,
        map: action.map
      };
    case 'ADD_BOSS': // 添加Boss
      return {
        ...state,
        occupiedSpaces: {
          ...state.occupiedSpaces,
          [`${action.location.x}x${action.location.y}`]: 'boss',
          [`${action.location.x + 1}x${action.location.y}`]: 'boss',
          [`${action.location.x}x${action.location.y + 1}`]: 'boss',
          [`${action.location.x + 1}x${action.location.y + 1}`]: 'boss'
        },
        entities: {
          ...state.entities,
          boss: {
            entityType: 'enemy',
            health: action.health,
            attack: action.attack,
            x: action.location.x,
            y: action.location.y
          }
        }
      };
    case 'TOGGLE_DARKNESS': // 控制迷雾
      return {
        ...state,
        darkness: !state.darkness
      };
    default:
      return state;
  }
  return state;
}

// REDUX 存储
let store = Redux.createStore(rogueLikeReducer);

// REACT UI
const RogueLike = React.createClass({

  propTypes: {
    // mapAlgo用于创建地图，它是一个必须返回 一个 0（代表墙）、1（代表地板） 元素矩阵的函数
    // getState是redux存储的函数。
    mapAlgo: React.PropTypes.func.isRequired,
    getState: React.PropTypes.func.isRequired
  },
  getInitialState: function() { // 初始化时的功能函数
    return this._select(this.props.getState());
  },
  componentWillMount: function() { // 组件挂载后的功能函数
    this._setupGame();
  },
  componentDidMount: function() { // 组件卸载时的功能函数
    this._storeDataChanged();
    this.unsubscribe = store.subscribe(this._storeDataChanged);
    window.addEventListener('keydown', this._handleKeypress);
    window.addEventListener('resize', setWindowSize);
    // 安装触摸控制
    const touchElement = document.getElementById('root');
    const hammertime = new Hammer(touchElement);
    hammertime.get('swipe').set({direction: Hammer.DIRECTION_ALL});
    hammertime.on('swipe', this._handleSwipe);
  },
  componentWillUnmount: function() {
    this.unsubscribe();
    window.removeEventListener('keydown', this._handleKeypress); //注销键盘监控函数
    window.removeEventListener('resize', setWindowSize);         // 注销窗口大小改变监控函数
  },
  _storeDataChanged: function() {
    const newState = this.props.getState()
    // 玩家可以升级吗?
    if (newState.entities.player.toNextLevel <= 0) this._playerLeveledUp();
    this.setState(this._select(newState));
  },
  _select: function(state) {
    return {
      player: state.entities.player,
      entities: state.entities,
      map: state.map,
      occupiedSpaces: state.occupiedSpaces,
      level: state.level,
      windowHeight: state.windowHeight,
      windowWidth: state.windowWidth,
      darkness: state.darkness
    }
  },
  _playerLeveledUp: function() {
    const currLevel = this.state.player.level + 1;
    levelUp(currLevel * PLAYER.attack, currLevel * PLAYER.health,
              (currLevel + 1) * PLAYER.toNextLevel);
  },
  _setupGame: function() {
    resetMap(this.props.mapAlgo());
    this._fillMap()
    this._storeDataChanged();
    setWindowSize();
  },
  _getEmptyCoords: function() {
    const {map, occupiedSpaces} = this.props.getState();
    let coords, x, y;
    do {
      x = Math.floor(Math.random() * map.length);
      y = Math.floor(Math.random() * map[0].length);
      if (map[x][y] === tileType.FLOOR && !occupiedSpaces[x + 'x' + y]) {
        coords = {x: x, y: y};
      }
    } while (!coords);
    return coords;
  },
  _fillMap: function() { // 填充实体
    // 放置玩家
    setLocation('player', this._getEmptyCoords());
    // 放置其他对象（生命、武器等）
    const state = this.props.getState();
    const weapon = weaponTypes[state.level];
    addEntity(weapon.entityName, 'weapon', weapon.health, weapon.attack, this._getEmptyCoords());
    // 放置生命和敌人
    const NUM_THINGS = 5,
          HEALTH_VAL = 20,
          LEVEL_MULT = state.level + 1;
    for (let i = 0; i < NUM_THINGS; i++) {
      addEntity('health'+i, 'health', HEALTH_VAL, 0, this._getEmptyCoords());
      addEntity('enemy'+i, 'enemy', LEVEL_MULT * ENEMY.health,
        LEVEL_MULT * ENEMY.attack, this._getEmptyCoords());
    }
    // 每层放置出口
    if (state.level < 4) addEntity('exit', 'exit', 0, 0, this._getEmptyCoords());
    // 在最高层放置Boss
    if (state.level === 4) addBoss(125, 500, this._getEmptyCoords());
  },
  _addVector: function(coords, vector) {
    return {x: coords.x + vector.x, y: coords.y + vector.y};
  },
  _toggleDarkness: function() { // 开关迷雾
    toggleDarkness();
  },
  _handleKeypress: function(e) { //  键盘捕获处理
    let vector = '';
    switch (e.keyCode) {
      case 37: // 向左键
        vector = {x: -1, y: 0};
        break;
      case 38: // 向上键
        vector = {x: 0, y: -1};
        break;
      case 39:// 向右键
        vector = {x: 1, y: 0};
        break;
      case 40: // 向下键
        vector = {x: 0, y: 1};
        break;
      default:
        vector = '';
        break;
    }
    if (vector) {
      e.preventDefault();
      this._handleMove(vector);
    }
  },
  _handleSwipe: function(e) { // 攻击处理方向.对于触摸
    let vector;
    const {overallVelocity, angle} = e;
    if (Math.abs(overallVelocity) > .75) {
      // swipe up
      if (angle > -100 && angle < -80) {
        vector = {x: 0, y: -1};
      }
      // swipe right
      if (angle > -10 && angle < 10) {
        vector = {x: 1, y: 0};
      }
      // swipe down
      if (angle > 80 && angle < 100) {
        vector = {x: 0, y: 1};
      }
      // swipe left
      if (Math.abs(angle) > 170) {
        vector = {x: -1, y: 0};
      }
    }
    if (vector) {
      e.preventDefault();
      this._handleMove(vector);
    }
  },
  _handleMove: function(vector) { // 处理移动的函数，最复杂的函数，是很多其他事件的触发器
    const state = this.props.getState();
    const player = state.entities.player;
    const map = state.map;
    const newCoords = this._addVector({x: player.x, y: player.y}, vector);
    if (newCoords.x > 0 && newCoords.y > 0 && newCoords.x < map.length &&
        newCoords.y < map[0].length &&
        map[newCoords.x][newCoords.y] !== tileType.WALL) {
      // 瓦片区域(Tile)不是墙 ，检测是否包含一个实体
      const entityName = state.occupiedSpaces[newCoords.x + 'x' + newCoords.y];
      // 移动，然后返回（如果是空的，没有实体）
      if (!entityName) { 
        move('player', vector);
        return;
      }
      // 处理与实体遭遇
      const entity = state.entities[entityName];
      switch (entity.entityType) {
        case 'weapon': // 武器
          switchWeapon(entityName, entity.attack);
          move('player', vector);
          break;
        case 'boss': // 敌人
        case 'enemy':
          const playerAttack = Math.floor((Math.random() * ATTACK_VARIANCE) + player.attack - ATTACK_VARIANCE);
          const enemyAttack = Math.floor((Math.random() * ATTACK_VARIANCE) + entity.attack - ATTACK_VARIANCE);
          // 可以攻击敌人
          if (entity.health > playerAttack) {
            // 将反射攻击玩家
            if (enemyAttack > player.health) {
              notifier.error('你死了，下次更好！!');
              this._setupGame(); // 重置游戏
              return;
            }
            damage(entityName,playerAttack);
            damage('player',enemyAttack);
          } else {
            // 如果敌人是Boss
            if (entityName === 'boss') {
              notifier.success('你胜利了!');
              this._setupGame(); // 重置游戏
              return;
            }
            gainXp((state.level + 1) * ENEMY.xp);
            removeEntity(entityName);
          }
          break;
        case 'health': // 捡到生命
          heal('player', entity.health);
          removeEntity(entityName);
          move('player', vector);
          break;
        case 'exit':  // 出口
          resetBoard();
          setMap(this.props.mapAlgo());
          setLocation('player', this._getEmptyCoords());
          increaseLevel();
          this._fillMap();
          break;
        default:
          break;
      }
    }
  },

  render: function() {
    const {map, entities, occupiedSpaces, level, player, windowHeight,
           windowWidth, winner, darkness} = this.state,
          SIGHT = 7, // 控制迷雾破空范围
          // 在像素上匹配css的高和宽
          tileSize = document.getElementsByClassName('tile').item(0) ? document.getElementsByClassName('tile').item(0).clientHeight : 10;

    // 在当前视口上开始 下面一段代码保证 玩家移动时 地图卷轴或者 直接移位 下面定义可视区域
    const numCols = Math.floor((windowWidth / tileSize) - 5), // 水平最多放置地板瓦片数
          numRows = Math.floor((windowHeight/ tileSize) - 17);// 垂直最多放置地板瓦片数
    let startX = Math.floor(player.x - (numCols/2)); // 获取地图映射起始坐标x
    let startY = Math.floor(player.y - (numRows/2)); // 获取地图映射起始坐标y
    // 修正超出范围情况
    if (startX < 0) startX = 0;
    if (startY < 0) startY = 0;
    // 设置结束标志 计算 映射结束位置
    let endX = startX + numCols;
    let endY = startY + numRows;
    // 最终确认起点和终点坐标 再次修正超范围情况
    if (endX > map.length) {
      startX = numCols > map.length ? 0 : startX - (endX - map.length);
      endX = map.length;
    }
    if (endY > map[0].length) {
      startY = numRows > map[0].length ? 0 : startY - (endY - map[0].length);
      endY = map[0].length;
    }

    // 创建一个可见的游戏地图(生成实际可视页面对象)
    let rows = [], tileClass, row;
    for (let y = startY; y < endY; y++) {
      row = [];
      for (let x = startX; x < endX; x++) {
        let entity = occupiedSpaces[`${x}x${y}`];
        if (!entity) { // 判断是否有实体对象，如果没有就获取该位置属性
          tileClass = reverseLookup[map[x][y]];
        } else {      // 如果有，则获取实体属性
          tileClass = entities[entity].entityType;
        }
        if (darkness) {
          // 确认是否是 阴影迷雾,如果打开阴影，则范围外用黑色填充
          const xDiff = player.x - x,
                yDiff = player.y - y;
          if (Math.abs(xDiff) > SIGHT || Math.abs(yDiff) > SIGHT) {
            tileClass += ' dark';
          } else if (Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2)) >= SIGHT) {
            tileClass += ' dark';
          }
        }
        row.push(React.createElement('span', {className: 'tile ' + tileClass, key: x + 'x' + y}, ' ')); // 实际放置瓦片对象
      }
      rows.push(React.createElement('div', {className: 'boardRow', key: 'row' + y}, row))
    }

    return (  // react 对象标签定义(返回实际标签)
      <div id = 'game'>
        <ul id = 'ui'>
          <li id = 'health'><span className = 'label'>生命:</span> {player.health}</li>
          <li id = 'weapon'><span className = 'label'>武器:</span> {player.weapon}</li>
          <li id = 'attack'><span className = 'label'>攻击力:</span> {player.attack}</li>
          <li id = 'playerLevel'><span className = 'label'>等级:</span> {player.level}</li>
          <li id = 'xp'><span className = 'label'>到下一级:</span> {player.toNextLevel} XP</li>
          <li id = 'level'><span className = 'label'>楼层:</span> {level}</li>
          <li id = 'playerCoord'><span className = 'label'>玩家坐标:</span> {player.x}/{player.y}</li>
        </ul>
        <div className = 'buttons'>
          <ToggleButton
            label = '迷雾开关'
            id = 'toggleDarkness'
            handleClick = {this._toggleDarkness} />
        </div>
        <div id = 'board'>
          {rows}
        </div>
      </div>
    );
  }
});

const ToggleButton = React.createClass({ // 迷雾开关定义
  propTypes: {
    label: React.PropTypes.string.isRequired,
    id: React.PropTypes.string.isRequired,
    handleClick: React.PropTypes.func.isRequired
  },
  render: function() {
    return (
      <button
        className="toggleButton"
        id={this.props.id}
        onClick={this.props.handleClick}>{this.props.label}
      </button>
    );
  }
});

// 利用 React 渲染到页面
const targetEl = document.getElementById('root');

ReactDOM.render(
    <RogueLike mapAlgo={createMap} getState={store.getState}/>,
  targetEl
);

// 地图生成器
// 返回指定大小的矩阵，并指定房间数（有默认参数预定义）
function createMap(width = 100, height = 100, maxRoomSize = 20, minRoomSize = 6, maxHallLength = 5, numRooms = 20) {
  // 初始化墙 ( _. 类的函数都是lodash库提供的工具函数 ) function createMap(width = 100, height = 100, maxRoomSize = 20, minRoomSize = 6, maxHallLength = 5, numRooms = 20, roomChance = .75) {
  let map = _.fill(Array(width), 0);   // 构造地图数组，是width个元素的数组，且全由0填充
  const blankCol = _.fill(Array(height), tileType.WALL); // 构建一个标准的blankCol数组，其有height个元素，全由tileType.WALL (墙=0)填充
  map = map.map(() => blankCol.slice()); // map的每个元素变成一个blanckCol数组（拷贝复制），使得map变成 width * height

  // 创建第一间房间
  fillRect(map, {x: 45, y: 45}, {x: 10, y: 10}, tileType.FLOOR);

  // 创建房间
  for (let i = 0; i < numRooms; i++) {
    placeRoom(map);
  }

  return map;

  // 地图是一个网格，startCoord 是一个开坐标对象 {x: 13, y: 15}
  // 尺寸也是一个对象如 {x: 5, y: 7}, 填充值是整数
  function fillRect(map, startCoord, size, fillVal) {
    for (let i = startCoord.x; i < startCoord.x + size.x; i++) {
      _.fill(map[i], fillVal, startCoord.y, size.y + startCoord.y);
    }
    return map;
  }

  // 尝试放置随机房间，直到成功,放1个
  function placeRoom(map) {
    let wall, width, height, isRoom, startX, startY, coords, numClear;
    while (true) {
      // 创建随机位置和房间 ，循环直到能放置为止
      // TODO - Choose wall or hall
      numClear = 0;
      wall = findWall(map);
      coords = wall.coords;
      width = Math.floor((Math.random() * (maxRoomSize - minRoomSize)) + minRoomSize);
      height = Math.floor((Math.random() * (maxRoomSize - minRoomSize)) + minRoomSize);
      switch (wall.openDir) {
        case 'right':
          startX = coords.x - width;
          startY = (coords.y - Math.floor(height / 2)) + getDoorOffset(height);
          break;
        case 'left':
          startX = coords.x + 1;
          startY = (coords.y - Math.floor(height / 2)) + getDoorOffset(height);
          break;
        case 'top':
          startX = (coords.x - Math.floor(width / 2)) + getDoorOffset(width);
          startY = coords.y + 1;
          break;
        case 'bottom':
          startX = (coords.x - Math.floor(width / 2)) + getDoorOffset(width);
          startY = coords.y - height;
          break;
        default:
          break;
      }
      //  如果房间尺寸超出范围则退出
      if (startX < 0 || startY < 0 || startX + width >= map.length || startY + height >= map[0].length) {
        continue;
      }
      // 确认是否所有的空间已经干净
      for (let i = startX; i < startX + width; i++) {
        if (map[i].slice(startY, startY + height).every(tile => tile === tileType.WALL)) {
          numClear++;
        }
      }
      if (numClear === width) {
        fillRect(map, {x: startX, y: startY}, {x: width, y: height}, tileType.FLOOR); // 放置房间
        map[coords.x][coords.y] = tileType.FLOOR; // 设置通道
        return map;
      }
    }

    function getDoorOffset(length) {
      return Math.floor((Math.random() * length) - Math.floor((length - 1 ) / 2));
    }
  }

  //循环直到找到所有的墙
  function findWall(map) {
    const coords = {x: 0, y: 0};
    let wallDir = false;
    do {  // 获取范围内的一个随机位置
      coords.x = Math.floor(Math.random() * map.length);
      coords.y = Math.floor(Math.random() * map[0].length);
      wallDir = isWall(map, coords); // 判断随机位置的开口方向
    } while (!wallDir); // 如果不是墙就重新进行前面步骤

    return {coords: coords, openDir: wallDir};
  }

  // 放置地图和实体对象
  //  如果不是墙就返回 false，否则该方向开放（即可以移动过去）
  function isWall(map, coords) {
    // 如果不是墙就返回false
    if (map[coords.x][coords.y] !== tileType.WALL) { return false; }
    //  左边是开放的
    if (typeof map[coords.x - 1] !== 'undefined' && map[coords.x - 1][coords.y] === tileType.FLOOR) {
      return 'left';
    }
    //  右边开放
    if (typeof map[coords.x + 1] !== 'undefined' && map[coords.x + 1][coords.y] === tileType.FLOOR) {
      return 'right';
    }
    //  上边开放
    if (map[coords.x][coords.y - 1] === tileType.FLOOR) {
      return 'top';
    }
    //  下边开放
    if (map[coords.x][coords.y + 1] === tileType.FLOOR) {
      return 'bottom';
    }

    return false;
  }
}
