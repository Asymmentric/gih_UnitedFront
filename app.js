var shortid = require('shortid');
const express=require('express')
const qrcode=require('qrcode')

const app=express();

console.log(shortid.generate())

let qr=qrcode.toDataURL('https://www.instagram.com/aniruddha_bagal',{type:'terminal'},(err,url)=>{
    console.log(url)
})
app.get('/someUrl',(req,res)=>{
    console.log(req)
    res.send(qr)
})

app.listen(6900,()=>{
    console.log('Running')
})