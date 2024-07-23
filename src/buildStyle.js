import { bootstrap } from 'global-agent';
import process from 'process';

// 设置代理地址
process.env.GLOBAL_AGENT_HTTP_PROXY = 'http://127.0.0.1:7890';

// 初始化 global-agent
bootstrap();

import githubMarkdownCss from "generate-github-markdown-css";
import fs from "fs";

githubMarkdownCss({
  light: "light",
  dark: "dark",
  list: false,
  preserveVariables: false,
  onlyVariables: false,
  onlyStyles: true,
  rootSelector: ".markdown-body",
})
  .then((result) => {
    fs.writeFile("dist/mainStyle.css", result, (d) => {
      if (d == null) {
        console.log("现在应该释放成功了！");
      } else {
        console.log(`释放 CSS 时发生什么事了？${d}`);
      }
    });
  })
  .catch((e) => {
    console.log(`生成 CSS 失败：${e}`);
  });
