let express=require("express");
let bodyParser=require("body-parser");
let db=require("./db");
let app=express();
let path=require("path");
app.use('/public',express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.render("nav.ejs");

});

app.get("/addcourse",(req,res)=>{
    res.render("course.ejs",{msg:" "});

});

//to add course data
app.post("/save",(req,res)=>{
    let {cname}=req.body;
    db.query("insert into course (cname) values(?)", [cname],(err,result)=>{
        
    });
    res.render("course.ejs",{msg:"Course data added successfully in database"});
});
//to show course data
app.get("/viewcourse",(req,res)=>{
    db.query("select *from course",(err,result)=>{
        if(err){
            res.render("showcourse.ejs");
        }
        else{
            res.render("showcourse.ejs",{data:result});
        }
    })
});
//to connect student databse
app.get("/addstudent",(req,res)=>{
    db.query("SELECT * FROM course", (err, result) => {
        if (err) {
             res.render("addstudent.ejs");
        } else {
            res.render("addstudent.ejs", { data: result,msg:[]});
        }
    });
});

//to add student data
app.post("/save2",(req,res)=>{
    let {name,email,contact,cid}=req.body;
    db.query("insert into student values('0',?,?,?,?)",[name,email,contact,cid],(err,result)=>{
        db.query("select *from course",(err,result)=>{
            if(err){
                res.render("addstudent");
            }
            else{
               res.render("addstudent",{data:result,msg:"Student data added successfully in database"});
            }
        });  
    });
    // res.send("addstudent.ejs",{});
});

//show student code
app.get("/viewstudent",(req,res)=>{
    db.query("select s.sid,s.name,s.email,s.contact,c.cname from student s join course c on s.cid=c.cid",(err,result)=>{
        if(err){
            res.render("showstudent.ejs");
        }
        else{
            res.render("showstudent.ejs",{studentdata:result});
        }
    })
});

//to delete course from table
app.get("/deletecourse", (req, res) => {
    let cid = parseInt(req.query.cid);
    console.log("Deleting course with cid:", cid);  

    db.query("delete from course where cid=?",[cid], (err,result)=>{});
        db.query("select * from course", (err, result) => {
            if (err) {
                res.render("showcourse.ejs");
            } else {
                res.render("showcourse.ejs", {data:result});
            }
        });
    
});

//deleting student record
app.get("/deletestudent",(req,res)=>{
    let sid=parseInt(req.query.sid);
    db.query("delete from student where sid=?",[sid],(err,result)=>{});
    db.query("select s.sid,s.name,s.email,s.contact,c.cname from student s join course c on s.cid=c.cid",(err,result)=>{
        if(err){
            res.render("showstudent.ejs");
        }
        else{
            res.render("showstudent.ejs",{studentdata:result});
        }
    })
});

//logic for search
app.get("/search",(req,res)=>{
    let name=req.query.name;
   
    db.query("select s.sid,s.name,s.email,s.contact,c.cname from student s join course c on s.cid=c.cid where name like '%"+name+"%'",(err,result)=>{
        res.json(result);
        

    });
});
//to show dropdown list in view course wise student
app.get("/coursewisestudent",(req,res)=>{
    db.query("select *from course",(err,result)=>{
        if(err){
            res.render("studlist.ejs");
        }
        else{
           res.render("studlist.ejs",{data:result,studentdata:[]});
        }
    });  
});

//displaying student course wise
app.post("/studlist",(req,res)=>{
    let selectcourse=req.body.cname;
    db.query("select *from course",(err,result)=>{
    db.query("select s.sid,s.name,s.email,s.contact from student s join course c on s.cid=c.cid where c.cname=?",[selectcourse],(err,result2)=>{
        if(err){
            res.render("studlist.ejs");
        }
        else{
            res.render("studlist.ejs",{data:result,studentdata:result2});
        }
    })
});
});

//update course
app.get("/updatecourse",(req,res)=>{
    let cid=parseInt(req.query.cid);
    db.query("select *from course where cid=?",[cid],(err,result)=>{
        res.render("updatecourse.ejs",{data:result});

    })
});

//to show updated data
app.post("/update2",(req,res)=>{
    let cname=req.body.cname;
    let cid=req.body.cid;
    
    db.query("update course set cname=? where cid=?",[cname,cid],(err,result)=>{});
    db.query("select *from course",(err,result)=>{
        if(err){
            res.render("showcourse.ejs");
        }
        else{
           res.render("showcourse.ejs",{data:result});
        }
    });
});

//to update student list
app.get("/updatestudent",(req,res)=>{
    let sid=parseInt(req.query.sid);
    db.query("select *from student where sid=?",[sid],(err,result)=>{
        res.render("updatestudent.ejs",{data:result});
    })   
});

//to show updated student list
app.post("/showupdatestud",(req,res)=>{
    let {name,email,contact,sid}=req.body;
    db.query("update student set name=?,email=?,contact=? where sid=?",[name,email,contact,sid],(err,result)=>{});
    db.query("select s.sid,s.name,s.email,s.contact,c.cname from student s join course c on s.cid=c.cid",(err,result)=>{
        if(err){
            res.render("showstudent.ejs");
        }
        else{
            res.render("showstudent.ejs",{studentdata:result});
        }
    })
});

//student count drop downlist
app.get("/studentcount",(req,res)=>{
    db.query("select *from course",(err,result)=>{
        if(err){
            res.render("studentcount.ejs");
        }
        else{
           res.render("studentcount.ejs",{countdata:result,data:[]});
        }
    });  
});
//display student count
app.post("/countstudentshow",(req,res)=>{
    let cid=req.body.cid;
    db.query("select *from course",(err,result)=>{

    db.query("select c.cname,count(s.cid) as count from student s join course c on s.cid=c.cid where s.cid=?",[cid],(err,result2)=>{
        if(err){
            res.render("studentcount.ejs");
        }
        else{
            res.render("studentcount.ejs",{countdata:result,data:result2});
        }
    })
    });
});

app.listen(5000,()=>{
    console.log("Server Started");

});