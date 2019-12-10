const AWS = require('aws-sdk');
const config = require('./config');

AWS.config.update(config.remote_config);

async function chkAccountExists(email) {
	let docClient = new AWS.DynamoDB.DocumentClient();
	var check = false;
	var params = {
        TableName : "Users",
        KeyConditionExpression : "email = :e",
        ExpressionAttributeValues: {
            ":e" : email
        }
    }
	try {
        const data = await docClient.query(params).promise();
        if(data.Count > 0) { check = true; }
    } catch (err) {
        console.error(err);
    }

    return check;
}

async function chkUserLogin(email, loginHash) {
    let docClient = new AWS.DynamoDB.DocumentClient();
    var check = false;
    var params = {
        TableName : "Users",
        KeyConditionExpression : "email = :e",
        ExpressionAttributeValues: {
            ":e" : email
        }
    }
    try {
        const data = await docClient.query(params).promise();
        data.Items.forEach(function(item) {
            if (item.loginHash == loginHash) {
                check = true;
            }
        });
    } catch (err) {
        console.error(err);
    }

    return check;
}

exports.chklogin = async function chklogin(email, loginHash, res) {
    let check = await chkUserLogin(email, loginHash);
    if (check) {
        res.json({"action":"chklogin","result":"success"});
    } else {
        res.json({"action":"chklogin","result":"invalid"});
    }
}

exports.newaccnt = async function newaccnt(email, loginHash, res) {
	let check = await chkAccountExists(email);
    if (check) {
        res.json({"action":"newaccnt","result":"exists"});
    } else {
        var accountdata = {};
		accountdata.email = email;
		accountdata.loginHash = loginHash;
		accountdata.accountCreation = Date.now();
		accountdata.emailVerified = false;
		let docClient = new AWS.DynamoDB.DocumentClient();
	    var params = {
    	    TableName : "Users",
        	Item : accountdata,
        	ReturnValues : "NONE"
    	}
        docClient.put(params, function(err,data) {
        	if (err) {
                res.json({"action":"newaccnt","result":"error"});
            } else {
                res.json({"action":"newaccnt","result":"success"});
            }

    	});
    }
}
