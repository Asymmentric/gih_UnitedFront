const  shortid = require('shortid');
const express=require('express')
const qrcode=require('qrcode')
const path=require('path')

const pool=require('./DB/pools')

const app=express();

// app.use('/',express.static('/views/generate'));
// app.use('/qrcode',express.static('/views/qrcode'))

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.set('view engine','ejs')
// app.use(express.static(__dirname + '/views'));
app.use(express.static('/views'))
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

app.post('/qr/edit/:shortUrl',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err;
        
        let sql2=`update shortUrl set full=? where short= ?`
        connection.query(sql2,[req.body.full,req.params.shortUrl],(err,results)=>{
            connection.release();
            if(err) throw err;
            res.redirect(`/${shortUrl}`)
        })
    })
})


app.listen(6900,()=>{
    console.log('Running')
})