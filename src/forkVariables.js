import githubMarkdownCss from "generate-github-markdown-css";
import fs from "fs";

githubMarkdownCss({
  light: "light",
  dark: "dark",
  list: false,
  preserveVariables: false,
  onlyVariables: true,
  onlyStyles: false,
  rootSelector: ".markdown-body",
})
  .then((result) => {
    fs.writeFile("pending/variables.css", result, (d) => {
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
