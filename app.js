var shortid = require('shortid');
const express=require('express')
const qrcode=require('qrcode')
const path=require('path')

const app=express();

app.use(express.static('client'))
console.log(shortid.generate())


let qr=qrcode.toDataURL('https://www.instagram.com/aniruddha_bagal',(err,url)=>{
    // console.log(url)
})
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'/client/loginPage/index.html'))
})

app.get('/generate',(req,res)=>{

})

app.listen(6900,()=>{
    console.log('Running')
})