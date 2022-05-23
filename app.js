const  shortid = require('shortid');
const express=require('express')
const qrcode=require('qrcode')
const path=require('path')
<<<<<<< HEAD
const request=require('request');

const pool=require('./DB/pools');
=======
const request=require('request')
>>>>>>> d35d845ed0a91d528ec044698a1e175b7ba630e5


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

request.post('https://analytics.qr-codes.com/api/campaigns',{
    api_key:'27b2ed3926dc3133a847e2068a275d1a',
    action:'create_campaign',
    title:'qr analytics',
    url:'localhost:6900',
    media:'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.DRI7RrDsCN0nAZpsjuZJIQHaHa%26pid%3DApi&f=1'
},(err,response,data)=>{
    if(!err) console.log(response);console.log(data)
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