import * as csstree from "css-tree";
import fs from "fs";

fs.readFile("pending/variables.css", (e, d) => {
  if (e) {
    console.log(`处理 CSS 时出了些问题：${e}`);
  } else {
    const ast = csstree.parse(d.toString());

    // Log the entire AST for debugging
    console.log(JSON.stringify(ast, null, 2));

    let copiedStyles = null;

    // Step 1: Find @media (prefers-color-scheme: dark) and copy styles
    csstree.walk(ast, {
      visit: "Atrule",
      enter(node) {
        if (node.name === "media") {
          const mediaQueryList = node.prelude;
          csstree.walk(mediaQueryList, {
            visit: "MediaQuery",
            enter(mediaQueryNode) {
              const mediaQuery = csstree.generate(mediaQueryNode);
              const darkScheme = /prefers-color-scheme:\s*dark/.test(mediaQuery);
              console.log("MediaQuery:", mediaQuery, "Dark Scheme:", darkScheme);

              if (darkScheme) {
                csstree.walk(node, {
                  visit: "Rule",
                  enter(ruleNode) {
                    if (ruleNode.prelude.type === "SelectorList") {
                      ruleNode.prelude.children.forEach((selector) => {
                        const selectorStr = csstree.generate(selector);
                        if (selectorStr === ".markdown-body" || selectorStr === "[data-theme=\"dark\"]") {
                          console.log("找到选择器：", selectorStr);
                          copiedStyles = ruleNode.block;
                        }
                      });
                    }
                  },
                });
              }
            },
          });
        }
      },
    });

    // Step 2: Create new selector and add copied styles
    if (copiedStyles) {
      const newRule = {
        type: "Rule",
        prelude: csstree.parse("html[data-theme=\"dark\"] .markdown-body", { context: "selector" }),
        block: copiedStyles,
      };

      ast.children.push(newRule);
      console.log("新规则已添加：", JSON.stringify(newRule, null, 2));
    }

    // Step 3: Generate and write modified CSS
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
