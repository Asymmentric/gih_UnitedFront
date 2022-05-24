var shortid = require('shortid');
const express=require('express')
const qrcode=require('qrcode')
const path=require('path')

const pool=require('./DB/pools')

const app=express();

app.use('/',express.static('client/generate'));
app.use('/qrcode',express.static('client/qrcode'))
app.use(express.json())
app.use(express.urlencoded({extended:false}))



app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'/client/generate/index.html'))
})

app.get('/generate',(req,res)=>{
    console.log(req.query.URL)
    pool.getConnection((err,connection)=>{
        if(err) throw err;
        let shortUrl=shortid.generate()
        let sql=`insert into shortUrl (full,short) values(?,?)`
        connection.query(sql,[req.query.URL,shortUrl],(error)=>{
            connection.release();
            if(error){
                console.log(error);
                res.send({"message":"Unable to generate"})
            }
            res.redirect(`/qrcode/${shortUrl}`)
        })  
    })
})
app.get('/:shortURL',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err;
        let sql1=`select id,full from shortUrl where short= ?`
        connection.query(sql1,req.params,(error,results)=>{
            connection.release();
            if(error) throw error;
            console.log(results)
res.send({"data":"lol"})
        })
    })
})
app.get('/qrcode/:shortUrl',(req,res)=>{

    res.sendFile(path.join(__dirname,'/client/qrcode/qr.html'))
})

app.get('/edit',(req,res)=>{
    console.log(req.body)
})


app.listen(6900,()=>{
    console.log('Running')
})