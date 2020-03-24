const path = require('path');
const express = require("express");
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const app = express();
//connetion db
mongoose.connect('mongodb+srv://amrwaheed:'+ process.env.MONGO_ATLAS_PW + '@freecluster0-cxyrf.mongodb.net/node-angular',
{useUnifiedTopology: true ,useNewUrlParser: true,  useCreateIndex: true,})
.then(res=>{
    console.log('connected successful')
}).catch(err=>{
    console.log('Erorr connected')
})

// setting
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use('/images', express.static(path.join(__dirname,'images')))
app.use('/', express.static(path.join(__dirname,'angular')))

// cors middelware
app.use((request,response,next)=>{

    response.setHeader('Access-Control-Allow-Origin','*');
    response.setHeader(
        'Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization'
        );
    response.setHeader(
        'Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE, OPTIONS'
        );


    next();
})


app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);

app.use(( request,response,next)=>{

   response.sendFile(path.join(__dirname,"angular", "index.html"))
})


module.exports = app

