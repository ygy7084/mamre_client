'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _configure = require('./configure');

var _configure2 = _interopRequireDefault(_configure);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//서버와 포트 초기화
var app = (0, _express2.default)();
var port = _configure2.default.PORT;

//POST 연결을 위한 설정
app.use(_bodyParser2.default.urlencoded({ extended: true, limit: '5mb' }));
app.use(_bodyParser2.default.json({ limit: '5mb' }));
app.enable('trust proxy');

//정적 파일 라우트
app.use('/', _express2.default.static(_path2.default.join(__dirname, './../public')));

//메인 html
app.get('/*', function (req, res) {
    res.sendFile(_path2.default.resolve(__dirname, './../public/index.html'));
});

//404 에러
app.use(function (req, res) {
    res.status(404).send('NOT FOUND');
});

//서버 시작
app.listen(port, function () {
    console.log("Server is listening on this port : " + port);
});