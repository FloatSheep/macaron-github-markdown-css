import fs from "fs";

fs.readFile("dist/modifiedVariables.css", (err, data) => {
  if (err) {
    console.log(`读取文件时出了什么事？${err}`);
    return;
  }
  global.variablesData = data.toString();

  fs.readFile("dist/mainStyle.css", (err, data) => {
    if (err) {
      console.log(`读取文件时出了什么事？${err}`);
      return;
    }
    global.mainStyleData = data.toString();

    const writeData = global.variablesData + global.mainStyleData;

    fs.writeFile("dist/github-markdown-css.css", writeData, (err) => {
      if (err) {
        console.log(`释放文件时出了什么事？${err}`);
      } else {
        console.log("现在应该合并成功了！")
      }
    });
  });
});
