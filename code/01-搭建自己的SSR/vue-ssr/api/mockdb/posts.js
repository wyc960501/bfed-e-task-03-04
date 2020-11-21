const mock = require('mockjs')
const random = mock.Random

// 利用 mock.js 动态生成 posts 数据

function getPosts() {
  const posts = []

  for (var i = 0; i < 10; i++) {
    posts.push(
      mock.mock({
        title: random.csentence()
      })
    )
  }
  return {
    success: true,
    data: posts,
    message: '获取数据成功'
  }
}

exports.posts = getPosts