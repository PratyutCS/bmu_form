let post=document.querySelector(".post");
let school=document.querySelector(".school");
let fname=document.querySelector(".fname");
let mname=document.querySelector(".mname");
let lname=document.querySelector(".lname");
let name;
function lol(){
    if((mname.value).trim()===""){
        name=(fname.value).trim()+" "+(lname.value).trim();
    }
    else{
        name=(fname.value).trim()+" "+(mname.value).trim()+" "+(lname.value).trim();
    }
    console.log((post.value).trim()+" "+(school.value).trim()+" "+name);
}