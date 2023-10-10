const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

// panel/index.js, this filename needs to match the one registered in package.json
Editor.Panel.extend({
  // css style for panel
  style: `
    :host { margin: 5px; }
    h2 { color: #f90; }
  `,

  // html template for panel
  template: `
    <h2>cc_editor_server</h2>
    <hr />
    <div>State: <span id="label">--</span></div>
    <hr />
    <ui-button id="btn">Send To Main</ui-button>
  `,

  // element and variable binding
  $: {
    btn: '#btn',
    label: '#label',
  },

  // method executed when template and styles are successfully loaded and initialized
  ready() {
    this.$btn.addEventListener('confirm', () => {
      Editor.Ipc.sendToMain('cc_editor_server:clicked');
    });
    // 创建 express 应用
    const app = express();
    // 允许所有跨域请求访问该服务器
    app.use(cors());
    // 解析 JSON 格式的请求体
    app.use(bodyParser.json());
    // 解析 URL 编码格式的请求体
    app.use(bodyParser.urlencoded({ extended: true }));

    // 设置其他路由和中间件
    app.post('/', (req, res) => {

      // const data = req.body;
      // console.log(req); // { message: 'Hello, world!' }
      let { cmd, uuid, data } = req.body
      if (cmd == 'save') {
        // if (this.$.app)
        //   this.$.app.innerHTML = '[' + new Date().toLocaleString() + ']\n' + obj.uuid;
        //接下来是保存json到本地的资源目录里面 引擎自动刷新
        Editor.assetdb.queryPathByUuid(uuid, (err, path) => {
          Editor.log(path)
          fs.writeFile(path, JSON.stringify(data), err => {
            if (err) {
              Editor.log('writeFile err')
            } else {
              Editor.log('JSON data save ok.');
            }
          });
        });
        // // 将 JSON 字符串写入文件系统中的一个目录

      }

      // 设置其他响应头和内容
      res.send('ok!');
    });

    app.listen(3000, () => {
      let str = 'Server running at http://localhost:3000/';
      Editor.log(str)
      this.$label.innerText = str;
    });
  },

  // register your ipc messages here
  messages: {
    'cc_editor_server:hello'(event) {
      this.$label.innerText = 'Hello!';
    }
  }
});
