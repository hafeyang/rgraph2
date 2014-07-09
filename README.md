![xRelation by RGraph2](https://raw.github.com/hafeyang/rgraph2/master/xrelation.png)

##RGraph2

RGraph是一个基于[Raphaeljs](http://raphaeljs.com/)完整的点->线图的web实现。

online demo ：[RGraph2 Demo](http://hafeyang.github.com/rgraph2/)

github地址 :

    git clone https://github.com/hafeyang/rgraph2.git

RGraph2已经支持[bower](http://twitter.github.com/bower/)包规范，可以直接使用`bower`安装

    bower install rgraph2

由于[Raphaeljs](http://raphaeljs.com/)目前不支持`bower`规范，所以没有引入`Raphaeljs`依赖

RGraph包含特性：

* 点->线图布局算法(2.0新增)
* 基本画布拖拽
* 点拖动，鼠标hover高亮相关点
* 支持放大/缩小/鼠标滚轮事件
* 提供API增/删/改节点