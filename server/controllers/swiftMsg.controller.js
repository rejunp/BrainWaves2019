const dbServer = require('../models/mongo');

exports.swiftMsgParser = (agent, filename, msgContent) => {
    console.log('Inside swiftMsgParser...');

    let msgContentStart = msgContent.indexOf('4:') + 3;
    let msgContentEnd = msgContent.length - msgContentStart - 3;

    let msg = msgContent.substr(msgContentStart, msgContentEnd);
    let msgBreakUp = msg.split("\n");

    let msgObj = {
        'filename': filename,
        'agent': agent,
        'matchid': '$$',
        'matchtype': '$$'
    };

    let buySellFlag = 'N';
    let buySellDetails = [53, 56, 57, 58];
    msgBreakUp = msgBreakUp.map(x => x.substr(1)).reduce((acc, item) => {
        let tmp = item.split(":");
        buySellFlag = tmp[0] === "32B" ? 'B' : (tmp[0] === "33B" ? 'S' : buySellFlag);
        //console.log("tmp[0] ==> " + tmp[0] + " -- flag -- " + buySellFlag);
        if (buySellFlag === "B" && (buySellDetails.includes(Number(tmp[0].substr(0, 2))))) {
            acc['_BUY_' + tmp[0].substr(0, 2)] = tmp[1];
        } else if (buySellFlag === "S" && (buySellDetails.includes(Number(tmp[0].substr(0, 2))))) {
            acc['_SELL_' + tmp[0].substr(0, 2)] = tmp[1];
        } else if (tmp[0].substr(0, 2) === "82") {
            acc['_82'] = tmp[1];
        } else if (tmp[0].substr(0, 2) === "87") {
            acc['_87'] = tmp[1];
        } else {
            acc["_" + tmp[0]] = tmp[1];
        }
        if (tmp[0].substr(0, 2) === "58")
            buySellFlag = 'N';
        return acc;
    }, msgObj);

    console.log(msgBreakUp);
    return msgBreakUp;
    //    console.log(msg);

}

exports.swiftMsgUpload = (agent, content) => {
    console.log('Inside swiftMsgUpload...');
    dbServer.fnUploadMsg(agent, content);
}

exports.swiftFindExcatMatch = (req, res) => {
    console.log("Inside swiftFindExcatMatch...");
    let responsePromise = new Promise((suc, rej) => {
        dbServer.findExcatMatch(suc, rej);
    });

    responsePromise.then((s) => {
        console.log("done..." + s.length);
        res.json(s);
    }, (e) => {
        console.log('error');
    });
}

exports.swiftFindCloseMatch = (req, res) => {
    console.log("Inside swiftFindExcatMatch...");
    let responsePromise = new Promise((suc, rej) => {
        dbServer.findCloseMatch(suc, rej);
    });

    responsePromise.then((s) => {
        console.log("done..." + s.length);
        res.json(s);
    }, (e) => {
        console.log('error');
    });
}
