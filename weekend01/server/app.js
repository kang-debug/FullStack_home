const http = require('http');
const express = require('express');
const app = express();
const path = require('path');
// npm i -S body-parser
const bodyParser = require('body-parser');
const cors= require('cors');

app.set('views', path.join(__dirname, 'views') );
app.set('view engine', 'ejs');
app.set('port', 3000);


// /public/index.html을 보여주기 위한 static 폴더 지정
app.use(express.static('public'));


// bodyParser 미들웨어 지정 - POST방식의 파라미터 사용 가능.
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(cors());

const commentList = [
    {no: 1, post:'멋진 사진입니다.', employee:'박문수'},
    {no: 2, post:'좋아요^^ 퍼가요~', employee:'일지매'}

];

var noSeq = 3;

// AJAX를 REST 방식으로 처리 (HTML 폼은 GET과 POST만 가능)
// GET - 출력, 검색
// POST - 입력
// PUT - 수정
// DELETE - 삭제
// FETCH - 부분수정
// ... 그 외

//  검색
app.get('/board/search', (req, res) => {
    var keyword = req.query.keyword;
    var newCommentList = commentList.filter((com)=> {
        return com.employee.findIndex(keyword) != -1;
    });
    res.send(newCommentList);
});

//  상세보기 or 전체보기
app.get('/board', (req, res) => {
    
    if(req.query.no) {
        var no = req.query.no;
        var idx = commentList.findIndex((t)=>{
            return t.no == no;
        });
        if(idx != -1) {
            res.send(commentList[idx]);
        } else {
            res.send(null);
        }
        return;
    }
    
    res.send(commentList);
});

// 입력
app.post('/board', (req, res) => {
    var post = req.body.post;
    var employee = req.body.employee;
    commentList.push( {no:noSeq++, post, employee} );
    res.send(commentList);
});

// 수정
app.put('/board', (req, res) => {
    //var no = req.body.no;
    //var title = req.body.title;
    //var done = req.body.done; // 문자열을 boolean으로 변경.

    var com = req.body;
    console.dir(com);
    var idx = commentList.findIndex((t) => {
        return t.no == com.no;
    });
    if(idx != -1) {
        commentList[idx] = com;
    }

    res.send(commentList);
});

// 삭제
app.delete('/board', (req, res) => {
    var no = parseInt(req.body.no);
    var idx = commentList.findIndex((t)=> {
        return t.no == no;
    });
    if(idx != -1) {
        commentList.splice(idx, 1);
    }
    res.send(commentList);
});

const server = http.createServer(app);
server.listen(app.get('port'), () => {
    console.log(`노드js 서버 실행 중 >>> http://localhost:${app.get('port')}`);
});