/**
 * 通用应用web 服务启动脚本
 *  */

const Vue = require('vue')
const express = require('express')
const fs = require('fs')
const { createBundleRenderer } = require('vue-server-renderer')
const setupDevServer = require('./build/setup-dev-server')
// 创建一个 express 实例
const server = express()

// express.static 处理的是物理磁盘中的资源文件
server.use('/dist', express.static('./dist'))

const isProd = process.env.NODE_ENV === 'production'

let renderer
let onReady
if (isProd) {
  const serverBundle = require('./dist/vue-ssr-server-bundle.json')
  const template = fs.readFileSync('./index.template.html', 'utf-8')
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  // 生成一个渲染器
  renderer = createBundleRenderer(serverBundle, {
    // 渲染器就会自动把渲染的结果注入到模板中
    template,
    clientManifest
  })
} else {
  // 开发模式 -> 监视打包构建 -> 重新生成 Renderer 渲染器
  onReady = setupDevServer(server, (serverBundle, template, clientManifest) => {
    renderer = createBundleRenderer(serverBundle, {
      template,
      clientManifest
    })
  })
}

const render = async (req, res) => {
  try {
    const html = await renderer.renderToString({
      title: '拉钩教育',
      meta: `
      <meta name="description" content="拉钩教育">
    `,
      url: req.url
    })
    res.setHeader('Content-Type', 'text/html; charset=utf8')
    res.end(html)
  } catch (err) {
    res.status(500).end('Internal Server Error.')
  }
}

// 服务端路由设置为 * ,意味者所有的路由都会进入这里
server.get('*', isProd
  ? render
  : async (req, res) => {
    // 等待有了 Renderer 渲染器以后，调用 render 进行渲染
    await onReady
    render(req, res)
  }
)

// 监听端口，启动 web 服务
server.listen(3000, () => {
  console.log('server running at port 3000.')
})
