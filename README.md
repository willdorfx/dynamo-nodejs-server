# dynamo-nodejs-server
#
# for use with https://github.com/willdorfx/jsonClientLogin
#
#
# set up https
#
# create privkey.pem cert.pem and chain.pem with certbot and apache and
# put in this directory or change options in index.js to point to where they are located
#
#
# create dynamo database
#
# create a dynamodb with table "Users" and primary key "email"
# create iam user with AmazonDynamoDBFullAccess
# create key for user and place that info in config.js
#
