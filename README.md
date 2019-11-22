# custom_vue
仿vue造轮子（双向绑定MVVM、生命周期、渲染机制等）
## Vue问题记录
1. 问题：vue源码中vm对象直接添加实例会报错，但直接在实例上调用vm.x添加属性可以添加成功
   解决：在指令上给vue实例添加属性会报错，
   ```java
      let vm = new Vue({
        data() {
          return {
            text:'原来数据'
          }
        },
        methods:{
          change() {
            this.addText = "我想要的"  // 报错 【Vue warn】
          }
        }
      })
      vm.addtext = "我想要的"  // 成功添加到vm下，但vm._data中没有新加的属性
      console.log(vm.addtext) // "我想要的"
      console.log(vm._data.addtext) // undefined
   ```
2. dep依赖是什么意思？
3. 在get方法中添加dep.addSub的原因
4. 所谓监听
   一直对监听不太理解，感觉比较晦涩难懂，理解之后直白的说，监听就是当数据发生变化时触发一个函数，这个函数里使我们要进行的操作
5. Dep是什么？
   Dep类的任务就是收集订阅者，并且在改变时通知这些订阅者。这些订阅者，是一个由watcher组成的类
6. Dep.target作为目标watcher是怎么做到的？
   
