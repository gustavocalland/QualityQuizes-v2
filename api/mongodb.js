var mongo = require('mongodb').MongoClient;

exports.init = function (options, callback) {

    mongo.connect(options.mongoDatabase, function (err, database) {
        if (err) { return callback(err); }

        exports.db = database;

        callback();
    });

    return this;

};

exports.insert = function (collection, entry, callback) {
    collection.insert(entry, { w: 0 }, callback);
};

exports.find = function (collection, criteria, callback) {
    collection.find(criteria).toArray(function (err, docs) {
        callback(err, docs);
    });
};

exports.update = function (collection, criteria1, criteria2, criteria3, callback) {
  collection.update(criteria1, criteria2, criteria3, callback);
}

exports.remove = function (collection, criteria1, criteria2, callback) {
    collection.remove(criteria1, criteria2, callback);
};

exports.createIndex = function (collection, fieldName, order) {
    collection.createIndex(JSON.parse('{ "' + fieldName + '" : ' + order + ' }'), function (err) {
        if (err) console.log(err);
    });
}