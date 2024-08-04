const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app=express();

const port=8000;

//뷰 템플릿 상용을 위한 설정
app.set('views','views');
app.set('view engine','ejs');

app.use(methodOverride('_method'));

// /public/index.html을 보여주기 위한 static 폴더 지정
app.use(express.static('public'));

// body-parser 설정
app.use(bodyParser.urlencoded({ extended: false }));

// 사람 데이터 목록 선언
const saramList=[
    {no:101,name:'둘리', email:'yoribogo@gmail.com',job:'식충이',age:10000},
    {no:102,name:'또치', email:'ddochi@gmail.com',job:'식충이친구',age:8 },
    {no:103,name:'도우너', email:'dounu@gmail.com',job:'싸패',age:2},
    {no:104,name:'마이콜', email:'maicol@gmail.com',job:'싱어송라이터',age:28 }
]


//localhost:8000/saram으로 접속해야함
app.get('/saram',function(req, res){
    //ejs페이지로 랜더링 
    //- views/saram.ejs 페이지의 코드를 읽어와서 res.end()에 적용
    var message="사람 정보 관리 페이지";
    req.app.render('saram',{message, saramList},function(err, html){
        res.end(html);
    });
});

//------------------------------------------ CLEAR

app.get('/saram/clear',function(req,res){
    console.log("GET - /saram/clear");
    saramList.splice(0, saramList.length);
    res.redirect('/saram');
})

//------------------------------------------ DETAIL

app.get('/saram/detail', function(req, res) {
    console.log("GET - /saram/detail >>>> no: " + req.query.no);
    var idx = saramList.findIndex(function(saram) {
        return saram.no == req.query.no;
    });
    var saram = null;
    if(idx != -1) {
        saram = saramList[idx];
    }
    req.app.render('saramDetail', {saram}, function(err, html) {
        res.end(html);
    });
});

//------------------------------------------ EDIT,UPDATE

app.get('/saram/edit',function(req,res){
    console.log("GET - /saram/edit >>>> no: " + req.query.no);
    var idx = saramList.findIndex(function(saram) {
        return saram.no == req.query.no;
    });
    var saram = null;
    if(idx != -1) {
        saram = saramList[idx];
    }
    req.app.render('saramEdit', {saram}, function(err, html) {
        res.end(html);
    });
});

app.post('/saram/edit',function(req,res){
    console.log('POST - /saram/edit >>>> no: ' + req.body.no);
    var idx = saramList.findIndex(function(saram) {
        return saram.no == req.body.no;
    });
    var saram = req.body;
    if(idx != -1) {
        saramList[idx] = saram;
    }
    res.redirect('/saram');
});

//------------------------------------------ DELETE

app.get('/saram/delete', function(req, res) {
    console.log('GET - /saram/delete >>>> no: ' + req.query.no);
    var idx = saramList.findIndex(function(saram) {
        return saram.no == req.query.no;
    });
    var saram = req.query;
    if(idx != -1) {
        saramList.splice(idx,1);
    }
    res.redirect('/saram');
})

//------------------------------------------ INPUT

app.get('/saram/input', function (req, res) {
    console.log("GET - /saram/input >>>> no: " + req.body.no);
    req.app.render('saramInput', {}, function (err, html) {
        res.end(html);
    });
});

app.post('/saram/input',function(req,res){
    
    console.log("POST - /saram/input >>>> no: " + req.body.no);
    const newNo = saramList.length ? Math.max(...saramList.map(saram => saram.no)) + 1 : 101;
    const saram = { ...req.body, no: newNo };
    saramList.push(saram);
    res.redirect('/saram');
})

const server = http.createServer(app);

server.listen(port, function() {
    console.log("서버 실행 중 >>> http://localhost:"+port+"/saram");
});
// 실제 웹 서버 구축에서는 Nodejs만 
// 사용하지 않고 express를 더 많이 사용합니다.