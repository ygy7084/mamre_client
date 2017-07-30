'use strict';

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

import configure from './configure';


//서버와 포트 초기화
const app = express();
const port = configure.PORT;


//POST 연결을 위한 설정
app.use(bodyParser.urlencoded({extended:true, limit: '5mb'}));
app.use(bodyParser.json({limit: '5mb'}));
app.enable('trust proxy');

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