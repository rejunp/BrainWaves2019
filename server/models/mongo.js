var Promise = require('promise');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const uri = "mongodb+srv://sgswift:sgswift@cluster0-qgcmc.mongodb.net/test?retryWrites=true";
// Database Name
const dbName = 'swift_clash';
const client = new MongoClient(uri, {
    useNewUrlParser: true
});

exports.fnUploadMsg = (agent, content) => {
    console.log('Inside fnUploadMsg...');
    client.connect(err => {
        if (err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
        }
        console.log('Connected...');
        const db = client.db(dbName).collection("messages");
        // perform actions on the collection object

        db.insertMany(content, function (err, r) {
            assert.equal(null, err);
            assert.equal(content.length, r.insertedCount);
            client.close();
        });

        //client.close();
    });

}

exports.findExcatMatch = (suc, rej) => {
    console.log('Inside findExcatMatch...');
    client.connect(err => {
        if (err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
        }
        console.log('Connected...');
        const db = client.db(dbName).collection("messages");
        // perform actions on the collection object
        db.find({}).toArray(function (err, result) {
            if (err) throw err;
            console.log(result.length);
            let full = [];
            let sg = result.filter(e => e.agent === "sg_msgs");
            let cp = result.filter(e => e.agent === "cp_msgs");
            let matchScr = 0;

            sg = sg.map(msg => {
                //console.log('Checking for--' + msg._20);
                let matchDoc = cp.filter((cpmsg) => {
                    matchScr = 0;
                    if (cpmsg._77H === msg._77H) matchScr++;
                    if (cpmsg._87 === msg._82) matchScr++;
                    if (cpmsg._82 === msg._87) matchScr++;
                    if (cpmsg._30T === msg._30T) matchScr++;
                    if (cpmsg._30V === msg._30V) matchScr++;
                    if (cpmsg._36 === msg._36) matchScr++;
                    if (cpmsg._32B === msg._33B) matchScr++;
                    if (cpmsg._33B === msg._32B) matchScr++;
                    if (cpmsg.SELL_56 === msg.BUY_56) matchScr++;
                    if (cpmsg.SELL_57 === msg.BUY_57) matchScr++;
                    if (cpmsg.SELL_58 === msg.BUY_58) matchScr++;
                    if (cpmsg.BUY_56 === msg.SELL_56) matchScr++;
                    if (cpmsg.BUY_57 === msg.SELL_57) matchScr++;
                    if (cpmsg.BUY_58 === msg.SELL_58) matchScr++;
                    if (matchScr === 14) return true;
                });
                msg.matchid = matchDoc[0]._id;
                msg.matchtype = "EXCAT";
                console.log(msg);
                return msg;
            });
            full = [...sg, ...cp];
            console.log(full.length);
            suc(full);
        });
    });
}

exports.findCloseMatch = (suc, rej) => {
    console.log('Inside findCloseMatch...');
    client.connect(err => {
        if (err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
        }
        console.log('Connected...');
        const db = client.db(dbName).collection("messages");
        // perform actions on the collection object
        db.find({}).toArray(function (err, result) {
            if (err) throw err;
            console.log(result.length);
            let full = [];
            let sg = result.filter(e => e.agent === "sg_msgs");
            let cp = result.filter(e => e.agent === "cp_msgs");
            let matchScr = 0;
            let highScr = 0;
            let winnerId = '';
            sg = sg.map(msg => {
                console.log('Checking for--' + msg._id);
                console.log('Checking for--' + msg._20);
                highScr = 0;
                let matchDoc = cp.map((cpmsg) => {
                    matchScr = 0;
                    if (cpmsg._82 === msg._87) matchScr++;
                    if (cpmsg._87 === msg._82) matchScr++;
                    if (cpmsg._77H === msg._77H) matchScr++;
                    if (cpmsg._30T === msg._30T) matchScr++;
                    if (cpmsg.SELL_56 === msg.BUY_56) matchScr++;
                    if (cpmsg.SELL_57 === msg.BUY_57) matchScr++;
                    if (cpmsg.SELL_58 === msg.BUY_58) matchScr++;
                    if (cpmsg.BUY_56 === msg.SELL_56) matchScr++;
                    if (cpmsg.BUY_57 === msg.SELL_57) matchScr++;
                    if (cpmsg.BUY_58 === msg.SELL_58) matchScr++;
                    if (matchScr === 10) {
                        console.log("Crossed 10...");
                        if (cpmsg._30V === msg._30V) matchScr++;
                        if (cpmsg._36 === msg._36) matchScr++;
                        if (cpmsg._32B === msg._33B) matchScr++;
                        if (cpmsg._33B === msg._32B) matchScr++;
                        if (highScr < matchScr) {
                            highScr = matchScr;
                            winnerId = cpmsg._id;
                        }
                        console.log(matchScr);

                    } else {
                        //msg.matchid = matchDoc[0]._id;
                        msg.matchtype = "$$";
                    }

                });

                console.log(">>>>>>>>>>>>>>>>>>high scr -" + highScr);
                console.log(">>>>>>>>>>>>>>>>>>winnerId -" + winnerId);

                if (highScr === 14) {
                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>Crossed 14...");
                    msg.matchid = winnerId;
                    msg.matchtype = "EXCAT";
                } else if (highScr === 13 || highScr === 12) {
                    msg.matchid = winnerId;
                    msg.matchtype = "PARTIAL-" + highScr;
                } else {
                    msg.matchtype = "$$";
                }
                //console.log(msg);
                return msg;
            });
            full = [...sg, ...cp];
            console.log(full.length);
            suc(full);
        });
    });
}
