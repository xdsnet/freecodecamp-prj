[返回项目主页](https://github.com/xdsnet/freecodecamp-prj/)  [返回上级](../)
#  建立迷宫杀怪游戏(build-a-roguelike-dungeon-crawler-game)

## 任务要求
* 一个Web页面
* 你所使用的技术里，必须包含Sass和React
* 用户需求：我有生命值、等级、一个武器。我能捡到其他更好的武器。我能捡到补血药。
* 用户需求： 所有的（可拾起的）物品和敌人都是在地图上随机分布的。
* 用户需求： 我能游览整个地图，寻找物品。
* 用户需求： 我能在地图范围内随便走，但是遇到敌人时，我只能打败敌人后才能继续往前走。
* 用户需求： 地图的绝大部分被战争迷雾覆盖，当我往前走，地图才会显示一部分。
* 用户需求： 打败敌人能获得经验值，而积攒经验值能够让我升级。
* 用户需求： 交战时，大家轮流攻击对方，直到我们中的一个死掉。我的攻击力取决于我的等级和武器。敌人的攻击力以其等级为基准在一定范围内随机。
* 用户需求： 当我打败了大boss，我就胜利了。
* 用户需求： 游戏比赛应该是具有挑战性的，但理论上应该是稳赢的。


## 实现说明
1. 想使用React的JSX语法，你需要使用[https://github.com/babel/babel-standalone](https://github.com/babel/babel-standalone)提供的Babel作为预处理器
2. 因为要使用sass编写样式(scss模式)，所以引入npm做项目依赖管理并进行scss到css的处理
3. 大多数代码引用的原始代码，只增加了一些特性：
    1. 通过武器列表增加游戏地图层数
    2. 每层物品数量随机
    3. 增加小怪和boss的属性随机性
4. 对原有代码进行了全面注释
5. 增加了玩家位置指示器

## 项目结构
* index.html - 入口和所有内容的展示
* index.scss - SASS语法的样式文件，将编译输出`index.css`文件供`index.html`引入
* index.jsx  - React扩展javascript语法文件，被`index.html`以`babel`模式引入
* sass2css.js - 利用`node-sass`编译`index.scss`的脚本
* package.json - npm管理用的配置文件，clone后执行`npm install`即可自动编译输出相关文件，使得`index.html`达到可用状态

## Codepen.io 展示
[Xdsnet的迷宫杀怪游戏](https://codepen.io/xdsnet/full/PbabQX)
