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
