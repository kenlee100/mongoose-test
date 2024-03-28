const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
// console.log('env', process.env);
const http = require('http');
const Room = require('./models/room');
const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
); // 將 DATABASE 的<password>替換成環境變數 DATABASE_PASSWORD

// 連接資料庫
mongoose
  .connect(DB) // 將上面處理過的 DB 字串放入 connect
  .then(() => {
    console.log('資料庫連線成功');
  })
  .catch((error) => {
    console.log(error);
  });
const roomsList = [];
const requestListener = async (req, res) => {
  const headers = {
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
    'Content-Type': 'application/json',
  };
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  if (req.url === '/rooms' && req.method === 'GET') {
    const rooms = await Room.find();
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'success',
        rooms,
      })
    );
    res.end();
  } else if (req.url === '/rooms' && req.method === 'POST') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        // console.log('data', data);

        const newRoom = await Room.create({
          name: data.name,
          price: data.price,
          rating: data.rating,
        });
        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            status: 'success',
            rooms: newRoom,
          })
        );
        res.end();
      } catch (error) {
        res.writeHead(400, headers);
        res.write(
          JSON.stringify({
            status: 'false',
            message: '欄位沒有正確，或沒有此 ID',
            error: error,
          })
        );
        res.end();
      }
    });
  } else if (req.url === '/rooms' && req.method === 'DELETE') {
    const rooms = await Room.deleteMany({}); // 大括號是條件。刪除全部，可用大括號來設計
    // rooms 沒用到的話，可以直接寫成 await Room.find()，代表刪除成功，就會繼續往下跑
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'success',
        rooms: [],
      })
    );
    res.end();
  } else if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: 'false',
        message: '無此網站路由',
      })
    );
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT);
