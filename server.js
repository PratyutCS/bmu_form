let Express = require('express')
let path = require('path')
let bodyparser=require('body-parser');

let app = new Express()

app.use(bodyparser.urlencoded({extended: true}));


app.use(Express.static(__dirname + '/public/css'));
app.use(Express.static(__dirname + '/public/images'));


let htmlfolder = path.join(__dirname, "public/html");
let cssfolder = path.join(__dirname, "public/css");

app.set('view engine','ejs');
app.set("views",path.join(__dirname, "./templates/views"))

app.get("/", (req, res) => {
    res.sendFile(path.join(htmlfolder, "index.html"));
})

app.get("/style", (req, res) => {
    res.sendFile(path.join(cssfolder, "style.css"));
})

app.post("/pdf", async(req, res) => {
    const post= req.body.posted;
    const school= req.body.school;
    const name = (req.body.fname).trim()+" "+(req.body.mname).trim()+" "+(req.body.lname).trim();
    const gender= req.body.gender;
    const marriage= req.body.marriage;
    const correspondence=req.body.correspondence;
    const permanent=req.body.permanent;
    res.render('pdf',{post:post,
                      school:school,
                      name:name,
                      gender:gender,
                      marriage:marriage,
                      correspondence:correspondence,
                      permanent:permanent});
})

app.get("*", (req, res) => {
    res.sendFile(path.join(htmlfolder, "error.html"));
})

const PORT= process.env.PORT || 80

app.listen(PORT, () => {
    console.log("Server is running at lolz "+ PORT);
})