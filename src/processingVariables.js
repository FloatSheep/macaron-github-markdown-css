import * as csstree from "css-tree";
import fs from "fs";

fs.readFile("pending/variables.css", (e, d) => {
  if (e) {
    console.log(`处理 CSS 时出了些问题：${e}`);
  } else {
    const ast = csstree.parse(d.toString());

    csstree.walk(ast, {
      visit: "Atrule",
      enter(node) {
        if (node.name === "media" && node.prelude.children.length === 1) {
          const mediaQuery = csstree.generate(node.prelude.children[0]);
          if (mediaQuery.includes("prefers-color-scheme: dark")) {
            csstree.walk(node, {
              visit: "Rule",
              enter(ruleNode) {
                if (ruleNode.prelude.type === "SelectorList") {
                  ruleNode.prelude.children.forEach((selector) => {
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
                    });
                  });
                }
              },
            });
          }
        }
      },
    });

    // 添加新的选择器到 html.app-dark 下
    const newRules = [];
    csstree.walk(ast, {
      visit: "Rule",
      enter(ruleNode) {
        if (ruleNode.prelude.type === "SelectorList") {
          ruleNode.prelude.children.forEach((selector) => {
            const selectorStr = csstree.generate(selector);
            if (!selectorStr.includes("prefers-color-scheme: light") && !selectorStr.includes('[data-theme="light"]')) {
              const newSelector = csstree.parse(
                `html.app-dark ${selectorStr}`,
                { context: "selector" }
              );
              newRules.push({
                type: "Rule",
                prelude: newSelector,
                block: ruleNode.block,
              });
            }
          });
        }
      },
    });

    // 将新规则添加到 AST
    newRules.forEach((newRule) => {
      ast.children.push(newRule);
    });

    try {
      const modifiedCSS = csstree.generate(ast);
      fs.writeFile("dist/modifiedVariables.css", modifiedCSS, (cb) => {
        if (cb) {
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
