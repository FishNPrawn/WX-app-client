# minapp-navigation-bar

微信小程序在 1.7.0 版本以后支持了自定义导航栏样式，也就是在配置文件中将 `navigationStyle` 设置为 `true`，便可获得只保留右上角胶囊的小程序页面。渐变背景和汉堡导航有了可行性。

本库是小程序自定义导航栏刘海屏通用适配方案，支持所有常规屏和异形屏手机，轻量、扩展性强。

## 如何使用

1. 通过 npm 安装

    确保已开启开发者工具中 `使用 npm 模块` 功能，并已对项目进行 `npm init` 初始化

    ```sh
    npm install --save minapp-navigation-bar
    ```

2. 构建

    在微信开发者工具中依次点击 `工具` - `构建 npm`

3. 在页面中配置

    page.json

    ```json
    {
        "usingComponents": {
            "navigation-bar": "minapp-navigation-bar"
        }
    }
    ```

4. 在页面中引入

    page.wxml

    ```html
    <navigation-bar></navigation-bar>
    ```

## 属性

- os String 标题栏显示样式

    可选值 `android`, `ios`, `auto`

    默认值为 `auto`，根据自动确定手机系统

    **注意**：使用不支持的值会被作为 `android` 处理

    ```html
    <!-- 即使是 iPhone，也显示为安卓系统样式 -->
    <navigation-bar os="android">这是标题</navigation-bar>

    <!-- 即使是安卓手机，也显示为 iOS 系统样式 -->
    <navigation-bar os="ios">这是标题</navigation-bar>

    <!-- 安卓手机显示安卓样式，iPhone 显示 iOS 样式 -->
    <navigation-bar>这是标题</navigation-bar>
    ```

- hide-back Boolean 是否隐藏返回按钮

    默认值为 `false`，即在可返回时显示返回按钮

    ```html
    <!-- 页面栈中页面数量大于 1 时显示返回按钮 -->
    <navigation-bar>这是标题</navigation-bar>
    <!-- 无论页面栈中有多少页面，都不显示返回按钮 -->
    <navigation-bar hide-back>这是标题</navigation-bar>

## 自定义事件

- grow 当导航栏高度计算完成后触发，用来在 Page 中获得导航栏高度

    ### 返回值

    - height Number 导航栏高度

    ```html
    <!-- 绑定 grow 事件 -->
    <navigation-bar bind:grow="handleNavigationBarGrow">这是标题</navigation-bar>

    <!-- 设置 container 的 padding-top 为导航栏的高 -->
    <view
        class="container"
        style="padding-top: {{navigationBarHeight}}px"
    >这里是内容</view>
    ```

    ```js
    Component({
        methods: {
            // 处理 grow 事件
            handleNavigationBarGrow({ detail }) {
                this.setData({ navigationBarHeight: detail.height })
            }
        }
    })
    ```

### 样式

默认为白底黑字样式，标题字体大小颜色背景等等均可以自定义

```html
<navigation-bar class="navigation-bar"></navigation-bar>
```

```css
.navigation-bar {
    /* 修改背景颜色，默认为 white */
    background: red; 

    /* 修改标题栏字体大小，默认为 38rpx */
    font-size: 40rpx;

    /* 修改字体颜色 */
    color: red;

    /* ... */
}
```

## 版本记录

### v0.1.1

实现功能