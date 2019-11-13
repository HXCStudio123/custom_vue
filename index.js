// 将vm._data中的数据挂到vm下，并做映射
// 传进来的是vm._data --> 内部属性挂到vm下
// 当vm.中的属性发生变化，对应的_data中的属性也变化
// 所以监听的应该是vm.属性
function noop(a, b, c) { }
// 将公共的部分抽离出来，这是一个Object.defineproperty共享的prop
var sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
};
// 这是用在data初始化中的数据劫持方法,可以让vm._data.x 通过 vm.x 就可以获取到访问到，并且实现了数据双向映射
function proxy(target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter() {
        return "" + this[sourceKey][key];
    };
    sharedPropertyDefinition.set = function proxySetter(val) {
        this[sourceKey][key] = val;
    };
    Object.defineProperty(target, key, sharedPropertyDefinition);
}
/**
 * 将vm中的_data属性，挂载到vm下，并对vm下生成的属性进行监听
 * 当vm中的属性发生变化时，对应的vm._data中的属性也发生变化
 * @param vm
 * @param sourceKey
 * @param key
 */
function mapData(vm, sourceKey, key) {
    // 添加_data中的数据到vm下
    Object.defineProperty(vm, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            return "" + this[sourceKey][key];
        },
        set: function (newVal) {
            if (vm[sourceKey][key] === newVal)
                return;
            // 对应的vm._data
            vm[sourceKey][key] = newVal;
        }
    });
}
function remove() { }
function observe(data) {
    // 如果data为空直接返回
    if (!data || typeof data !== "object") {
        return;
    }
    Object.keys(data).map(function (key) {
        console.log("2. observe. \u7ED9\u6DFB\u52A0get/set\u65B9\u6CD5", data);
        // 如果是对象并且data中有数据,就给每一个属性添加get、set
        defineReactive(data, key, data[key]);
    });
}
// 给data添加依赖
function defineReactive(data, key, val) {
    console.log("3. defineReactive:", data, key, val);
    var dep = new Dep();
    sharedPropertyDefinition.get = function proxyGetter() {
        // 添加依赖
        dep.addSub("watcher");
        return "" + val;
    };
    sharedPropertyDefinition.set = function proxySetter(newVal) {
        console.log("4. defineReactive\u5F53\u524D\u503C" + key + "," + val + "\u66F4\u6539");
        val = newVal;
        // 值发生更改，通知dep，让dep通知所有的watcher
        dep.notify();
    };
    // 如果只是变量
    Object.defineProperty(data, key, sharedPropertyDefinition);
}
//  监听者
var Observer = /** @class */ (function () {
    function Observer(data) {
        console.log("Observer:1. \u6784\u9020\u51FD\u6570");
        this.data = data;
        // 劫持并监听属性，添加get set
        observe(data);
    }
    return Observer;
}());
// 订阅者
var Watcher = /** @class */ (function () {
    function Watcher() {
    }
    return Watcher;
}());
// 依赖收集器
var Dep = /** @class */ (function () {
    function Dep() {
        this.subs = [];
    }
    // 添加依赖watcher
    Dep.prototype.addSub = function (sub) {
        this.subs.push(sub);
    };
    Dep.prototype.removeSub = function (sub) {
        // remove(this.subs, sub);
        console.log("移除");
    };
    // 通知所有watcher
    Dep.prototype.notify = function () {
        this.subs.map(function (sub) {
            sub.update();
        });
    };
    return Dep;
}());
var Vue = /** @class */ (function () {
    function Vue(options) {
        var _this = this;
        this.$el = options.el;
        if (this.$el) {
            // 做一个数据劫持
            // _data中的数据最终要挂在Vue实例下，并且Vue实例下的单独data属性，要与_data中的属性做映射
            this._data = options.data;
            Object.keys(this._data).map(function (key) {
                proxy(_this, "_data", key);
            });
            // 数据劫持,给每一个属性添加get、set
            new Observer(this._data);
            //
        }
        else {
            console.error("没有挂载el");
        }
    }
    return Vue;
}());
