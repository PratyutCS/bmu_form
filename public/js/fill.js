let fs = require('fs');
let text = "HELLO I AM WRITTEN TO THE FILE";

fs.writeFile("./test.txt", post, (err) => {
if (err) {
    console.error(err);
return;
  }
});
console.log("Data has been Written");