const  shortid = require('shortid');
const express=require('express')
const qrcode=require('qrcode')
const path=require('path')
const request=require('request')

const pool=require('./DB/pools')

const app=express();

app.use('/',express.static('/views/generate'));
// app.use('/qrcode',express.static('/views/qrcode'))

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.set('views', path.join(__dirname, '/views'));
app.set('view engine','ejs')

app.use(express.static('/views'))

request.get('https://www.google.com',(err,res,data)=>{
    if(!err) console.log(res.statusCode);
})

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'/views/generate/index.html'))
})

app.post('/qr/generate',(req,res)=>{

    console.log(JSON.parse(JSON.stringify(req.body)).full);
    pool.getConnection((err,connection)=>{
        if(err) throw err;
        let shortUrl=shortid.generate()

        console.log("URL generated "+shortUrl);

        let sql=`insert into shortUrl (full,short) values(?,?)`
        connection.query(sql,[JSON.parse(JSON.stringify(req.body)).full,shortUrl],(error)=>{
            connection.release();
            if(error){
                console.log(error);
                return res.send({"message":"Unable to generate"})
            }
            qrcode.toDataURL(`localhost:6900/${shortUrl}`,(err,url)=>{
                let data={
                    url:url,
                    shortUrl:shortUrl
                }
                res.render('qrcode/index',{data})
            })
        }) 
         
        
    })
 })
 

app.get('/qr/edit/:shortUrl',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err;
        
        let sql2=`update shortUrl set full=? where short= ?`
        connection.query(sql2,['https://www.amazon.in',req.params.shortUrl],(err,results)=>{
            connection.release();
            if(err) throw err;
            res.redirect(`/${req.params.shortUrl}`)
        })
    })
})





app.listen(6900,()=>{
    console.log('Running')
})