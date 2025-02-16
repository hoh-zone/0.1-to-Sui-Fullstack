const http = require("http");
// const data1 = require("./1.json").data.records.slice(0, 1);

const allDatas = []
for (let i = 0; i < 10; i++) {
    const data = require(`./${i + 1}.json`)
    allDatas.push(...data.data.records)
}
console.log('length = ', allDatas.length)
allDatas.forEach(async (item) => {
  const res = await saveData(JSON.stringify({
    ...item,
    uuid: item.uuid + ''
  }));
//   console.log(res);
});
function saveData(data) {
  const options = {
    method: "POST",
    hostname: "localhost",
    port: 1337,
    path: "/content-manager/collection-types/api::pet.pet?page=2&pageSize=10&sort=petName%253AASC&locale=en",
    headers: {
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzM5NjM4MzM5LCJleHAiOjE3NDIyMzAzMzl9.zYdAqC4jbf5CQH_RTeo6EPB1Lj4Km57s4IeGZ-tLYgk",
      "Content-Type": "application/json",
    },
    maxRedirects: 20,
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        resolve(responseData);
      });

      res.on("error", (error) => {
        reject(error);
      });
    });
    req.write(data);
    req.end();
  });
}

