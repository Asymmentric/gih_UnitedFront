const  shortid = require('shortid');
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

app.post('/generate',(req,res)=>{
    let imgData=""
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
                res.redirect(url);
            })
        }) 
         
        
    })
 })
app.get('/:shortURL',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err;
        let sql1=`select id,full from shortUrl where short=?`
        connection.query(sql1,req.params.shortURL,(error,results)=>{
            connection.release();
            if(results) res.redirect(results[0].full)
            else res.redirect('/')
            if(error) throw error;
            
            
        })
    })
})
// app.get('/qrcode/:shortUrl',(req,res)=>{

//     res.sendFile(path.join(__dirname,'/client/qrcode/qr.html'))
// })

// app.get('/edit',(req,res)=>{
//     console.log(req.body)
// })


app.listen(6900,()=>{
    console.log('Running')
})