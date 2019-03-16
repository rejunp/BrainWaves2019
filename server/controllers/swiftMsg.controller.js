const dbServer = require('../models/mongo');

exports.swiftMsgParser = (filename, msgContent) => {
    console.log('Inside swiftMsgParser...');

    let msgContentStart = msgContent.indexOf('4:') + 3;
    let msgContentEnd = msgContent.length - msgContentStart - 3;

    let msg = msgContent.substr(msgContentStart, msgContentEnd);
    let msgBreakUp = msg.split("\n");

    let msgObj = {
        'filename': filename
    };

    let buySellFlag = 'N';
    let buySellDetails = [53, 56, 57, 58];
    msgBreakUp = msgBreakUp.map(x => x.substr(1)).reduce((acc, item) => {
        let tmp = item.split(":");
        buySellFlag = tmp[0] === "32B" ? 'B' : (tmp[0] === "33B" ? 'S' : buySellFlag);
        //console.log("tmp[0] ==> " + tmp[0] + " -- flag -- " + buySellFlag);
        if (buySellFlag === "B" && (buySellDetails.includes(Number(tmp[0].substr(0, 2))))) {
            acc['BUY_' + tmp[0]] = tmp[1];
        } else if (buySellFlag === "S" && (buySellDetails.includes(Number(tmp[0].substr(0, 2))))) {
            acc['SELL_' + tmp[0]] = tmp[1];
        } else {
            acc[tmp[0]] = tmp[1];
        }
        if (tmp[0].substr(0, 2) === "58")
            buySellFlag = 'N';
        return acc;
    }, msgObj);

    console.log(msgBreakUp);
    return msgBreakUp;
    //    console.log(msg);

}

exports.swiftMsgUpload = (agent, content, uploadFlag) => {
    console.log('Inside swiftMsgUpload...');
    if (uploadFlag)
        dbServer.fnUploadMsg(agent, content);
    else
        console.log("Nothing to upload");
}
