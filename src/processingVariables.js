import * as csstree from "css-tree";
import fs from "fs";

fs.readFile("pending/variables.css", (e, d) => {
  if (e) {
    console.log(`处理 CSS 时出了些问题：${e}`);
  } else {
    const ast = csstree.parse(d.toString());
    const newSelector = csstree.parse(`html.app-dark`, {
      context: "selector",
    });

    console.log("新选择器：", newSelector);

    csstree.walk(ast, {
      visit: "Rule",
      enter(node) {
        if (node.prelude.type === "SelectorList") {
          node.prelude.children.forEach((selector) => {
            csstree.walk(selector, {
              visit: "AttributeSelector",
              enter(attrNode) {
                if (
                  attrNode.name.name === "data-theme" &&
                  attrNode.value.value === "dark"
                ) {
                  console.log("找到 data-theme='dark' 的选择器：", selector);
                  // 创建一个新的选择器列表
                  const combinedSelector = csstree.parse(
                    `html.app-dark ${csstree.generate(selector)}`,
                    { context: "selector" }
                  );
                  // 替换原有选择器
                  selector.children = combinedSelector.children;
                }
              },
              leave(attrNode) {
                console.log("离开节点：", attrNode.type);
              },
            });
          });
        }
      },
      leave(node) {
        console.log("离开节点：", node.type);
      },
    });

    try {
      const modifiedCSS = csstree.generate(ast);
      fs.writeFile("dist/modifiedVariables.css", modifiedCSS, (cb) => {
        if (!(cb == null)) {
          console.log(`释放 CSS 时发生了什么？${cb}`);
        } else {
          console.log("现在应该修改成功了！");
        }
      });
    } catch (error) {
      console.error("生成 CSS 时出错：", error);
    }
  }
});
