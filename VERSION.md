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

> 增加方法 unCheckedLines，用于取消线选中的方法。

#### 1.0.20

> 增加方法 clearCheckedLines，用于清空线选中的方法。

> 增加线的hover状态。

> 扩大线的可选中范围。

#### 1.0.21

> 修复最后被一条线删除后，进行操作时依然显示线条。

> 窗口大小变化时，实时更新线条位置。

#### 1.0.22

> 页面滚动时，实时更新操作点的位置。

#### 1.0.23

> 异步获取数据时，组件自动初始化。

#### 1.0.24

> 修复页面滚动时，线的选中偏移问题。

#### 1.0.25

> 简化组件代码。

> 优化canves动画的流畅度。

> 修复flat函数不兼容的问题。
