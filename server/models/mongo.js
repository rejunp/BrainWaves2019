var Promise = require('promise');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const uri = "mongodb+srv://sgswift:sgswift@sgswiftcluster-hkick.mongodb.net/test?retryWrites=true";
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
        const db = client.db(dbName).collection(agent);
        // perform actions on the collection object

        db.insertMany(content, function (err, r) {
            assert.equal(null, err);
            assert.equal(content.length, r.insertedCount);
            client.close();
        });

        //client.close();
    });

}

exports.simplePipeline = function (callback) {
    client.connect(err => {
        if (err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
        }
        console.log('Connected...');
        const db = client.db(dbName);
        // perform actions on the collection object
        var items = [];
        var counter = 0;
        //var collection = db.collection('sg_msgs');
        const docs = db.collection('sg_msgs').aggregate(
            [{
                    $lookup: {
                        from: "client_msgs",
                        localField: "87",
                        foreignField: "82",
                        as: "lsg"
                    }
                },
                {
                    $unwind: "$lsg"
                }, {
                    $lookup: {
                        from: "client_msgs",
                        localField: "82",
                        foreignField: "87",
                        as: "lsg2"
                    }
                },
                {
                    $unwind: "$lsg2"
                }
            ]
        ).toArray(function (err, docs) {
            console.log("===============================>len :" + docs.length);
            //console.log("===============================>>>> :" + docs);
            client.close();
        });
        //  docs.then((success) => console.log("done..." + docs), (err) => console.log("hello"));
        console.log(docs);
        /*
                cursor.on('data', function (data) {
                    console.log(data); // dump the current state info
                    items.push(data);
                    counter++;
                });

                cursor.on('end', function () {
                    console.log("Iterated " + counter + " times");
                }); */
    });
}
/*
exports.findAll = (callback_fn) => {
    console.log('Inside fnUploadMsg...');
    client.connect(err => {
        if (err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
        }
        console.log('Connected...');
        const db = client.db(dbName);
        let sg;
        let cp;

        db.collection("sg_msgs").find({}).toArray(function (err, result) {
            if (err) throw err;
            // console.log(result);
            sg = result;

        });
        db.collection("sg_msgs").find({}).toArray(function (err, result) {
            if (err) throw err;
            // console.log(result);
            cp = result;
            callback_fn(cp);
            client.close();
        });



    });
} */

/*
exports.findExcatMatch = () => {
    console.log('Inside fnUploadMsg...');
    client.connect(err => {
        if (err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
        }
        console.log('Connected...');
        const db = client.db(dbName);
        // perform actions on the collection object

        let matched = db.collection('sg_msgs').aggregate([{
            $lookup: {
                from: "client_msgs",
                let: {
                    '82': "$v_82",
                    '87': "$v_87",
                    '77H': "$v_77H",
                    '30T': "$v_30T",
                    '30V': "$v_30V",
                    '36': "$v_36",
                    '32B': "$v_32B",
                    'BUY_56': "$v_BUY_56",
                    'BUY_57': "$v_BUY_57",
                    'BUY_58': "$v_BUY_58",
                    '33B': "$v_33B"
                },
                pipeline: [{
                        $match: {
                            $expr: {
                                $and: [{
                                        $eq: ["$87A", "$$v_82A"]
                                    },
                                    {
                                        $eq: ["$82A", "$$v_87A"]
                                    },
                                    {
                                        $eq: ["$77H", "$$v_77H"]
                                    },
                                    {
                                        $eq: ["$30T", "$$v_30T"]
                                    },
                                    {
                                        $eq: ["$30V", "$$v_30V"]
                                    },
                                    {
                                        $eq: ["$36", "$$v_36"]
                                    },
                                    {
                                        $eq: ["$33B", "$$v_32B"]
                                    },
                                    {
                                        $eq: ["$SELL_56", "$$BUY_56"]
                                    },
                                    {
                                        $eq: ["$SELL_57", "$$BUY_57"]
                                    },
                                    {
                                        $eq: ["$SELL_58", "$$BUY_58"]
                                    },
                                    {
                                        $eq: ["$32B", "$$v_33B"]
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 0
                        }
                    }
                ],
                as: "matched_data"
            }
        }], function (err, results) {
            assert.equal(err, null);
            console.log(results);
            return results;
            //callback(results);
        });

        //console.log(matched);
        //client.close();
    });
} */
