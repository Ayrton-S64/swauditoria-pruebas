import SQLHandler from "./sqlHandler.js";

const prueba = new SQLHandler('mysql','localhost','3306','laravel','root','');

prueba.listTables().then((response)=>{
    // console.log(response);
    response.forEach(value=>{
        console.log(`[${(value.pos+1).toString().padStart(3,'0')}] ${value.name.padEnd(25,' ')}: ${value.rows}`);
    })
}).finally(()=>{
    prueba.listColumns('users').then((response)=>{
        response.forEach(value=>{
            console.log(`[${(value.pos).toString().padStart(3,'0')}] ${value.name.padEnd(20,' ')}: ${value.columnDataType}`);
        })
    })
});
