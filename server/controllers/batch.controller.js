const path = require('path');
const cron = require('node-cron');
const utils = require('../utils/main.util');
const fs = require('fs');
const swift = require('./swiftMsg.controller');

const readFiles = (agent, dirname, onError) => {
    console.log('Inside readFiles');
    let processedDest = path.join(dirname, 'processed', utils.getDateString() + '_');
    let data = [];
    // let tmp;
    //var uploadFlag = false;
    //console.log(`Dest --> ${processedDest}`);
    data = fs.readdirSync(dirname).reduce((acc, filename) => {
        let filePath = dirname + path.sep + filename;
        //console.log(`To Process:${filePath}`);
        //console.log(`isDir ? ${fs.lstatSync(filePath).isDirectory()}`);
        if (!fs.lstatSync(filePath).isDirectory()) {
            let content = fs.readFileSync(filePath, 'utf-8');
            //console.log('going to process file...');
            //tmp = swift.swiftMsgParser(filename, content);
            //console.log('processing done ---' + acc);
            //tmp = onFileContent(filename, content);
            acc = [...acc, swift.swiftMsgParser(filename, content)];
            //console.log('processing done 2222---' + acc);
            //uploadFlag = true;
            fs.rename(filePath, processedDest + filename, (err) => {
                if (err) throw err;
                console.log(filename + 'Moved to processed!');
            });
        }
        return acc;
    }, []);

    console.log("Length ->" + data.length);
    if (data.length > 0)
        swift.swiftMsgUpload(agent, data);

}
/*
const handleFile = (filename, content) => {
    console.log('Inside handleFile...');

    //data[filename] = content;
    return
    //swift.swiftMsgUpload('sg_msgs');
    //console.log(`${filename} ==> ${content}`);
}*/

cron.schedule("10 * * * * *", function () {
    console.log("hello from Cron!");
    console.log("PATH::==>" + path.join(__dirname, '../public', 'data', 'sg_msg'));
    //todo : change to property file
    let sgMsgPath = path.join(__dirname, '../public', 'data', 'sg_msg');
    let clientMsgPath = path.join(__dirname, '../public', 'data', 'client_msg');

    readFiles('sg_msgs', sgMsgPath, function (err) {
        throw err;
    });

    readFiles('client_msgs', clientMsgPath, function (err) {
        throw err;
    });

});

exports.batch_mon = function (req, res) {
    console.log("Inside get_all");
    //res.sendFile(path.join(__dirname, '../public', 'index.html'));
    // Convert a csv file with csvtojson
    console.log("PATH::==>" + path.join(__dirname, '../data', 'restaurantsa9126b3.csv'));
    csv()
        .fromFile(path.join(__dirname, '../data', 'restaurantsa9126b3.csv'))
        .then(function (jsonArrayObjMain) { //when parse finished, result will be emitted here.

            csv()
                .fromFile(path.join(__dirname, '../data', 'restaurant_addc9a1430.csv'))
                .then(function (jsonArrayObjLoc) { //when parse finished, result will be emitted here.
                    var jsonArg = new Object();
                    var jsonArgFinal = new Object();
                    for (index = 0; index < jsonArrayObjLoc.length; ++index) {
                        var pNode = new Array();
                        const key = jsonArrayObjLoc[index]["Restaurant ID"].toString().trim();
                        jsonArg[key] = jsonArrayObjLoc[index];
                    }
                    for (index = 0; index < jsonArrayObjLoc.length; ++index) {
                        const key = jsonArrayObjMain[index]["Restaurant ID"];
                        jsonArrayObjMain[index].locationData = jsonArg[key];
                    }

                    res.json(jsonArrayObjMain); // return all todos in JSON format
                });
            //	res.json(jsonArrayObj); // return all todos in JSON format
        });
}
