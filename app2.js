var http = require('http'); // HTTPモジュールを読み込み
var socketio = require('socket.io'); // Scoekt IOモジュールを読み込み
var fs = require('fs'); // ファイル入出力モジュールを読み込み

// 3000番ポートでHTTPサーバーを立てる
var server = http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'}); // ヘッダ出力
  res.end(fs.readFileSync('./index2.html', 'utf-8')); // index.htmlの内容を出力
}).listen(3000);

// サーバーをソケットに紐づける
var io = socketio.listen(server);

// 接続確立後の通信処理部分を定義
io.sockets.on('connection', function(socket) {
  // クライアントからサーバーへメッセージ送信ハンドラ（自分を含む全員あてに送る）
  socket.on('c2s_mesage', function(data) {
    // サーバーからクライアントへメッセージをお繰り返し
    io.sockets.emit('s2c_message', {value: data.value});
  });

  // クライアントからサーバーへメッセージ送信ハンドラ（治部煮外の全員あてに送る）
  socket.on('c2s_broadcast', function(data) {
    // サーバーからクライアントへメッセージをお繰り返し
    socket.broadcast.emit('s2c_message', {value: data.value});
  });
});

function loop() {
  io.sockets.emit('chat', {value: 'Hi'});
};

setInterval(loop, 1000);


// 接続の具体的な処理は、ハンドラとして定義
// ハンドラ名は、予約語である connection, message, disconnect 以外であれば
// 自由につけることが可能

// io.socket.emit
// 通常の送信方法
// 自分を含む全員あてにメッセージを送信

// socket.broadcast.emit
// 自分以外の全員あてにメッセージを送信
