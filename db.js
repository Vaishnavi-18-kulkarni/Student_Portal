let mysql=require("mysql2");

let con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Vaishnavi1234",
    database:"julyadvjava"

});
con.connect((err)=>{
    if(err){
        console.log("database is not connected"+err);
    }
    else{
        console.log("database is connected");
    }

});
module.exports=con;