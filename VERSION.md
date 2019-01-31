#### 1.0.12

> 废除以嵌套结构生成id获取dom的方式，改为直接通过id获取dom。

> 增加自定义行id的函数 leftIdFun与rightIdFun。

> 增加面板选中行的方法 leftCheckRow，rightCheckRow。

> 增加选中线的方法 setCheckLine。

> 增加取消选中行及取消选中线的回调函数 unCheckRow, unCheckLine。

> 增加面板选中改变时的回调函数 leftCheckChange, rightCheckChange

#### 1.0.14

> 增加初始化方法init，在数据异步获取成功后，及页面加载时组件由不可见切换到可见状态必须执行init方法

#### 1.0.15

> 增加属性popover，是否使用行移入时展示行详细内容。

> 增加属性popoverEnterable，popover是否可移入。

> 增加属性popoverHideDelay，popover显示隐藏的延时。

#### 1.0.16

> 修复bug

#### 1.0.17

> 增加方法 unCheckedLines，用于重置线的选中状态的方法。
