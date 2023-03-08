let Express = require('express')
let path = require('path')
let bodyparser=require('body-parser');
let fs=require('fs');
let docx = require("docx");

let app = new Express()

app.use(bodyparser.urlencoded({extended: true}));


app.use(Express.static(__dirname + '/public/css'));
app.use(Express.static(__dirname + '/public/images'));
app.use(Express.static(__dirname + '/public/js'));


let htmlfolder = path.join(__dirname, "public/html");
let cssfolder = path.join(__dirname, "public/css");
let jsfolder = path.join(__dirname, "public/js");

app.set('view engine','ejs');
app.set("views",path.join(__dirname, "./templates/views"))

app.get("/", (req, res) => {
    res.sendFile(path.join(htmlfolder, "index.html"));
})

app.get("/style", (req, res) => {
    res.sendFile(path.join(cssfolder, "style.css"));
})

app.get("/js", (req, res) => {
    res.sendFile(path.join(cssfolder, "fill.css"));
})

app.post("/pdf", async(req, res) => {
    const post= req.body.posted;
    const school= req.body.school;
    const name = (req.body.fname).trim()+" "+(req.body.mname).trim()+" "+(req.body.lname).trim();
    const gender= req.body.gender;
    const marriage= req.body.marriage;
    const correspondence=req.body.correspondence;
    const permanent=req.body.permanent;
    let gender1;
    let marriage1;
    if(gender==1)
        gender1="Male";
    else   
        gender1="Female";
    if(marriage==1)
        marriage1="Single";
    else
        marriage1="Married";
    generateWordDocument(post,school,name,gender1,marriage1,correspondence,permanent);
    console.log("Data has been Written");
    res.render('pdf',{post:post,
                      school:school,
                      name:name,
                      gender:gender1,
                      marriage:marriage1,
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

function generateWordDocument(post,school,name,gender,marriage,correspondence,permanent){
    const doc = new docx.Document({
        sections: [
            {
                children: [
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun("Post: "+post),
                        ],
                    }),
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun("School: "+school),
                        ],
                    }),
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun("Name: "+name),
                        ],
                    }),
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun("Gender: "+gender),
                        ],
                    }),
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun("Marital Status: "+marriage),
                        ],
                    }),
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun("Correspondence Address: "+correspondence),
                        ],
                    }),
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun("Permanent Address: "+permanent),
                        ],
                    }),
                ],
            },
        ],
    });
    
    // Used to export the file into a .docx file
    docx.Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync("My Document.docx", buffer);
    });
}