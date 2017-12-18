# Ethereum Contract Bidding Store
Run in final-project directory
```
$ npm install
$ testrpc
```
In another terminal window, run...
```
$ truffle compile && truffle migrate
```
Copy the contract created value from Block number 3 on the testrpc terminal, and paste it into contractInstance's field in main.js...
```
$ browserify UI/main.js > UI/bundle.js && browserify UI/user_js.js > UI/user_page.js
$ open UI/home.html
```
option-cmd + j to open up the chrome console...
if you get an error that says Incorrect number of variables, do...
```
$ rm -rf build
$ truffle compile && truffle migrate
```
