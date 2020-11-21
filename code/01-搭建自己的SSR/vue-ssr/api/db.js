const posts = require('./mockdb/posts.js')

// 这里定义一个收集的对象
let dbJson = {
  func: {},
  json: {},
}
// 收集mock函数，在server.js会用到
dbJson.func = {
  ...posts,
};

// 获取所有的api路径
const apiPath = Object.keys(dbJson.func);

// 组装json-server需要的路由表，这里为什么都是空对象呢？
// 上面说过，路由表的value必须是对象或者数组。但我们的mockDB文件夹下定义的都是mock函数，所以这里要保证路由表是正确的，就要重新组装一份符合格式的路由表。
apiPath.forEach(item => {
  dbJson.json[item] = {};
});

exports.dbJson = dbJson.json;
exports.dbFunc = dbJson.func;