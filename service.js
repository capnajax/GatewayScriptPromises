/**
 *	This is a service used to support this example
 */

const http = require('http'),
	url = require('url');

const server = http.createServer((req, res) => {

	var path = url.parse(req.url).pathname;

	path = path.replace(new RegExp('.*\/'), '');

	switch(path) {
	case 'a':
		// respond after 200ms
		setTimeout(() => {
			res.write(JSON.stringify({"a":"received a"}));
			res.end();
		}, 200);
		break;
	case 'b':
		// respond after 400ms
		setTimeout(() => {
			res.write(JSON.stringify({"b":"received b"}));
			res.end();
		}, 400);
		break;
	default:
		// respond immediately
		res.write(JSON.stringify({"?":"received path " + path}));
		res.end();
		break;
	}

});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(3003);

