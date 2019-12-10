const express = require('express')
const https = require('https');
const fs = require('fs');
const dbx = require('./dynconn');

var options = {
	key: fs.readFileSync('privkey.pem'),
	cert: fs.readFileSync('cert.pem'),
	ca: fs.readFileSync('chain.pem')
};

const app = express();

app.use(express.json());

app.use(function(req,res,next) {
	if (req.body.action) {
		switch (req.body.action) {
			case "chklogin":
				if (req.body.email && req.body.loginHash) {
                    dbx.chklogin(req.body.email, req.body.loginHash, res);
                } else {
                    res.json({"result":"bad input"});
                }
                break;
			case "newaccnt":
				if (req.body.email && req.body.loginHash) {
                    dbx.newaccnt(req.body.email, req.body.loginHash, res);
                } else {
                    res.json({"result":"bad input"});
                }
                break;
			default:
				res.json({"result":"bad input"});
				break;
		}
	} else {
		res.json({"result":"bad input"});
	}
});

https.createServer(options, app).listen(8088);
