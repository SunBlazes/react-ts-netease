# hooks

## `useCallback`

### 作用

防止因为内联函数而产生的不必要的重新渲染 举个例子

```javascript
class SomeComponent extends React.PureComponent {
  render() {
    const {
      list,
      thingsNeedToUseInCallbackButDoNotNeedInChild,
      onChange
    } = this.props;

    return (
      <ul>
        {list.map((item) => (
          <Item
            key={item.key}
            onClick={() => {
              onChange(item, thingsNeedToUseInCallbackButDoNotNeedInChild);
            }}
          />
        ))}
      </ul>
    );
  }
}
```

从这里看出 `Item` 的 `onClick` 这个 `prop` 传入的值是一个内联函数，即便是 `pureComponent` 的浅比较也无用，因为每次渲染都会重新创建一个匿名的箭头函数。

```javascript
<Item
  key={item.key}
  onClick={useCallback(() => {
    onChange(item, thingsNeedToUseInCallbackButDoNotNeedInChild);
  }, [])}
/>
```

`useCallback` 缓存每次渲染时 `inline callback` 的实例，可以搭配 `pureComponent` 或者 `React.memo` 避免不必要的重新渲染

### 第二个依赖数组参数

考虑一个问题 `useCallback` 依赖了某个 `state`，如果在不添加第二个参数的情况下，由于 `useCallback` 缓存了实例，里面的 `state` 还是之前的并不是最新的，举个例子

```javascript
function Form() {
  const [text, updateText] = useState("");

  const handleSubmit = useCallback(() => {
    console.log(text);
  }, []);

  return (
    <>
      <input value={text} onChange={(e) => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} /> {/* 很重的组件，不优化会死的那种 */}
    </>
  );
}
```

这里 `handleSubmit` 依赖了 `text` 这个 `state`，并缓存了最初的 `state("")`所以每次 `submit` 控制台输出的值都是`""`

```javascript
const handleSubmit = useCallback(() => {
  console.log(text);
  {
    /* 每次 text 变化时 handleSubmit 都会变 */
  }
}, [text]);
```

这里添加了 `text` 的依赖项，当 `text` 改变时，`useCallback` 就会进行浅比较依赖项的值，并进行重新生成读取到最新的 text，但这里每次 text 改变都会重新生成`handleSubmit`，使用 useRef 防止频繁的重新生成`handleSubmit`，而且可以取到最新的 text

```javascript
function Form() {
  const [text, updateText] = useState("");
  const textRef = useRef();

  useLayoutEffect(() => {
    textRef.current = text;
  });

  const handleSubmit = useCallback(() => {
    const currentText = textRef.current;
    alert(currentText);
  }, [textRef]);

  return (
    <>
      <input value={text} onChange={(e) => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}
```

`useLayoutEffect` 在`componentDidMount`或者`componentDidUpdate`时将 `text` 写入 `ref`，由于 `handleSubmit` 只依赖于 `textRef`，而不是 `text`，所以仅当 `textRef` 改变时才会重新生成`handleSubmit`这样达成了以下两点

1. 能充分利用一个函数式组件多次 render 时产生的相同功能的 callback
2. callback 能不受闭包限制，访问到这个函数式组件内部最新的状态

## `useLayoutEffect`

### 作用

中文翻译过来为布局副作用，其作用与 `useEffect` 相似，但他会在 **所有的 `DOM` 变更后执行，重新读取 `dom` 布局并同步触发重渲染，在浏览器执行绘制之前，`useLayoutEffect` 内部的更新计划将被同步刷新**

### 与 `useEffect` 的不同点

1. `useEffect`在渲染时是异步执行，并且等到浏览器将所有变化渲染到屏幕后才被执行，

   ```javascript
   import React, { useEffect, useLayoutEffect, useRef } from "react";
   import TweenMax from "gsap/TweenMax";
   import "./index.less";

   const Animate = () => {
     const REl = useRef(null);
     useEffect(() => {
       /*下面这段代码的意思是当组件加载完成后,在0秒的时间内,将方块的横坐标位置移到600px的位置*/
       TweenMax.to(REl.current, 0, { x: 600 });
     }, []);
     return (
       <div className="animate">
         <div ref={REl} className="square">
           square
         </div>
       </div>
     );
   };

   export default Animate;
   ```

   ![avatar](https://upload-images.jianshu.io/upload_images/8641818-b98fb38e8977d661.gif?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

   这张图片一闪而过主要因为 `useEffect` 是在浏览器绘制之后才执行

2. `useLayoutEffect`的执行时机与 `componentDidMount`，`componentDidUpdate`一致

### 建议将修改`DOM`的操作里放到`useLayoutEffect`里，而不是`useEffect`

上面那个一闪而过的图片表明了`useEffect`在屏幕绘制后执行，此时再对 `DOM` 进行修改，会触发浏览器再次进行重绘，增加了性能上的耗损。但如果是`useLayoutEffect`会在浏览器绘制前执行，比`useEffect`少了一次浏览器重绘。

## `UseMemo`

### 作用

缓存那些由 state、props 计算出来的数据，且防止在没有修改该`useMemo`依赖的 state 或者 props 的重新生成该数据
举个例子

```javascript
import React, { useMemo, useState } from "react";

interface PersonalInfoProps {
  name: string;
  gender: string;
}

const UseMemoDemo = () => {
  const [personalInfo, setPersonalInfo] =
    useState <
    PersonalInfoProps >
    {
      name: "Donald Trump",
      gender: "male"
    };

  function formatGender(gender: string) {
    console.log("---调用了翻译性别的方法---");
    return gender === "male" ? "男" : "女";
  }

  const gender = useMemo(() => {
    return formatGender(personalInfo.gender);
  }, [personalInfo.gender]);

  return (
    <>
      <div>
        姓名： {personalInfo.name} -- 性别: {gender} <br />
        <button
          onClick={() => {
            setPersonalInfo({
              ...personalInfo,
              name: "Will Kang"
            });
          }}
        >
          {" "}
          点击修改名字
        </button>
      </div>
    </>
  );
};
export default UseMemoDemo;
```

这里 `formatGender` 其实只依赖了 gender，所以如果

```javascript
const gender = formatGender(personalInfo.gender);
```

那么在每次渲染时 gender 都会重新生成，无论是不是依赖项改变，使用`useMemo`且第二个参数增加 gender 这个依赖项，可以防止这种计算资源的浪费
