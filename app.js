const  shortid = require('shortid');
const express=require('express')
const qrcode=require('qrcode')
const path=require('path')
const request=require('request')
const pool=require('./DB/pools')

const app=express();

<<<<<<< HEAD
app.use('/',express.static('client/generate'));
app.use('/qrcode',express.static('client/qrcode'))
=======
app.use('/',express.static('/views/generate'));
// app.use('/qrcode',express.static('/views/qrcode'))

>>>>>>> 1e6a0009f01a762a23697c11a49182505d6e65df
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.set('views', path.join(__dirname, '/views'));
app.set('view engine','ejs')

app.use(express.static('/views'))

<<<<<<< HEAD
=======
request.get('https://www.google.com',(err,res,data)=>{
    if(!err){
        if(res.statusCode===200){
            console.log(res.client.servername)
        }
        
    }
})

// request.post('https://analytics.qr-codes.com/api/campaigns',{
//     api_key:'27b2ed3926dc3133a847e2068a275d1a',
//     action:'create_campaign',
//     title:'qr analytics',
//     url:'localhost:6900',
//     media:'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.DRI7RrDsCN0nAZpsjuZJIQHaHa%26pid%3DApi&f=1'
// },(err,response,data)=>{
//     if(!err) console.log(response);console.log(data)
// })
>>>>>>> 1e6a0009f01a762a23697c11a49182505d6e65df

app.get('/',(req,res)=>{
    res.render('generate/index')
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
<<<<<<< HEAD
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
=======
            qrcode.toDataURL(`localhost:6901/${shortUrl}`,(err,url)=>{
                let data={
                    url:url,
                    shortUrl:shortUrl
                }
                res.render('qrcode/index',{data})
            })
        }) 
         
        
    })
 })
 

app.post('/qr/edit/:shortUrl',async (req,res)=>{
    console.log(req.body.full)
    console.log(req.params.shortUrl)
    pool.getConnection((err,connection)=>{
        if(err) throw err;
        
        let sql2=`update shortUrl set full=? where short= ?`
        connection.query(sql2,[req.body.full,req.params.shortUrl],(err)=>{
            connection.release();
            if(err) throw err;
            console.log("hweh")
            
>>>>>>> 1e6a0009f01a762a23697c11a49182505d6e65df
        })
        res.sendStatus(200)
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