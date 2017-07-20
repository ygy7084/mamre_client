'use strict';

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import mongoose from 'mongoose';
import configure from './configure';

//서버사이드 ajax를 위한 fetch
import 'isomorphic-fetch';

//api 라우트 로드
import api from './routes';

//서버와 포트 초기화
const app = express();
const port = configure.PORT;

//몽고디비 연결 설정
const db = mongoose.connection;
mongoose.connect(configure.MONGO_URL);

//Mongoose 모듈의 Promise 변경 - 모듈 권고사항 (deprecated)
mongoose.Promise = global.Promise;

//몽고디비 연결
db.on('error', console.error);
db.once('open', () => {
   console.log('MongoDB is connected : '+configure.MONGO_URL);
});

//POST 연결을 위한 설정
app.use(bodyParser.urlencoded({extended:true, limit: '5mb'}));
app.use(bodyParser.json({limit: '5mb'}));
app.enable('trust proxy')

//API 라우트
app.use('/api', api);

//
import hummus from 'hummus'
import tmp from 'tmp';
app.get('/test2',(req,res)=>{

    var pdfWriter = hummus.createWriterToModify(path.join(__dirname,'../public','/tickets.pdf'), {
        modifiedFilePath: path.join(__dirname,'/ab.pdf')
    });


    var pageModifier = new hummus.PDFPageModifier(pdfWriter,0);


    let axis = {
        seat_class:{x:270,y:230,size:15},
        date:{x:312, y:210,size:15},
        time:{x:320, y:198,size:11},
        leftBase:{x:10, y:195, size:9},
        rightBase:{x:150, y:195, size:9}
    };
    let data = {
        seat_class:'R',
        date : '7/28·금',
        time:'7시0분',
        datetime:'공연시간 : 7.28.금 / 7시 0분',
        seats_picked :[
            {
                col:'가',
                num:24
            },
            {
                col:'가',
                num:24
            },
        ]
    };


    if(data.seat_class==='VIP')
        axis.seat_class.x=263;
    if(data.date.length===5)
        axis.date.x = 317;
    if(data.date.length===7)
        axis.date.size=13;
    if(data.time.length===5)
        axis.time.x=317;
    if(data.time.length===6){
        axis.time.size=10;
        axis.time.x=315;
    }
    if(data.seats_picked.length<6) {
        axis.leftBase.y -= (axis.leftBase.size + 2);
        axis.rightBase.y -= (axis.rightBase.size + 2);
    }


    pageModifier.startContext().getContext()
        .writeText(
            data.seat_class,
            axis.seat_class.x, axis.seat_class.y,
            {font:pdfWriter.getFontForFile(path.join(__dirname,'../public','malgunbd.ttf')),size:axis.seat_class.size,color:'white'}
        )
        .writeText(
            '석'+Math.random()*1000,
            270, 220,
            {font:pdfWriter.getFontForFile(path.join(__dirname,'../public','malgunbd.ttf')),size:10,color:'white'})


    pageModifier.endContext().writePage();

    new Promise((resolve, reject) => {
        pdfWriter.end();
        resolve();
    }).then(() => {
        res.download(path.resolve(__dirname, 'ab.pdf'));
    })
})
//정적 파일 라우트
app.use('/', express.static(path.join(__dirname, './../public')));

//메인 html
app.get('/*', (req, res)=> {
    res.sendFile(path.resolve(__dirname, './../public/index.html'));
});

//404 에러
app.use((req, res) => {
    res.status(404).send('NOT FOUND');
});

//서버 시작
app.listen(port, () => {
    console.log("Server is listening on this port : "+port);
});