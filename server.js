let Express = require('express')
let path = require('path')
let bodyparser=require('body-parser');
let fs=require('fs');
let docx = require("docx");
var docxConverter = require('docx-pdf');

let app = new Express()

app.use(bodyparser.urlencoded({extended: true}));


app.use(Express.static(__dirname + '/public/css'));
app.use(Express.static(__dirname + '/public/images'));
app.use(Express.static(__dirname + '/public/js'));
app.use(Express.static(__dirname + '/pdf'));


let htmlfolder = path.join(__dirname, "/public/html");
let cssfolder = path.join(__dirname, "/public/css");
let jsfolder = path.join(__dirname, "/public/js");
let pdffolder = path.join(__dirname, "/pdf");

app.set('view engine','ejs');
app.set("views",path.join(__dirname, "./templates/views"))

app.get("/", (req, res) => {
    res.sendFile(path.join(htmlfolder, "index.html"));
})

app.get("/style", (req, res) => {
    res.sendFile(path.join(cssfolder, "style.css"));
})

app.get("/js", (req, res) => {
    res.sendFile(path.join(jsfolder, "fill.css"));
})

app.post("/pdf", async(req, res) => {
    const post= req.body.posted;
    const school= req.body.school;
    let name="";

    if((req.body.mname).trim()==="")
        name = (req.body.fname).trim()+" "+(req.body.lname).trim();
    else
        name = (req.body.fname).trim()+" "+(req.body.mname).trim()+" "+(req.body.lname).trim();

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

    
    generateWordDocument(res,post,school,name,gender1,marriage1,correspondence,permanent);
    // render(res,post,school,name,gender1,marriage1,correspondence,permanent);
})

app.get("*", (req, res) => {
    res.sendFile(path.join(htmlfolder, "error.html"));
})

const PORT= process.env.PORT || 80

app.listen(PORT, () => {
    console.log("Server is running at lolz "+ PORT);
})

function generateWordDocument(res,post,school,name,gender,marriage,correspondence,permanent){
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
    let fileName=name+".docx";
    let filePath="/word/"+fileName;
    let initialPath = path.join(__dirname,filePath);
    console.log(initialPath);
    docx.Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync(initialPath, buffer);
        console.log("Data has been Written");
        fs.readFileSync(initialPath);
        console.log("Data has been Read");
        convertPdftoDocx(res,name);
    });
}

function convertPdftoDocx(res,name){
    let fileNameDoc="/word/"+name+".docx";
    let fileNamePdf="/pdf/"+name+".pdf";
    let initialPath = path.join(__dirname,fileNameDoc);
    let uploadPath = path.join(__dirname,fileNamePdf);

    docxConverter(initialPath,uploadPath,function(err,result){
        if(err){
          console.log("FOUND A VERY BIG ERROR : "+err);
        }
        console.log('result : '+result);
        pdfRender(res,name);
        });
}
function render(res,post,school,name,gender1,marriage1,correspondence,permanent){
    res.render('pdf',{post:post,
        school:school,
        name:name,
        gender:gender1,
        marriage:marriage1,
        correspondence:correspondence,
        permanent:permanent});
}
function pdfRender(res,name){
    pdfName=name+".pdf";
    res.sendFile(path.join(pdffolder,pdfName));
}