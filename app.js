var express = require('express');
var app = express();  //request, response
//post - npm install body-parser --save
var bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

const mdbConn = require('./mariadb/mariaDBConn.js');

app.get('/',(req,resp)=>{
    resp.sendFile(__dirname+'/public/guestbook.html')
});

app.post('/save', async (req, res) => {
    try {
        // 데이터베이스에 저장
        await mdbConn.insertGuestbook(req.body.email, req.body.title, req.body.content);
        
        // 저장된 데이터 조회
        const posts = await mdbConn.getUserList();
        res.json(posts); // JSON 형태로 게시물 목록 반환
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/list', async (req, res) => {
    try {
        const rows = await mdbConn.getUserList();

        let html = '<h1>Guestbook Entries</h1>';
        html += '<ul>';

        for (const row of rows) {
            html += `<li>${row.email}: ${row.title} - ${row.content}</li>`;
        }

        html += '</ul>';
        res.send(html);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(3000, function(){
    console.log('My WebServer Start....');
});
