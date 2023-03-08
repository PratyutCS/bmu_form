var fs = require('fs');

fs.writeFile("./test.txt", post, (err) => {
if (err) {
    console.error(err);
return;
  }
});
console.log("Data has been Written");