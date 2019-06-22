'use strict';

var constant = require('./../../config/constant');


var fs = require("fs");
var path = require('path');
var async = require('async');


var commonQuery = {};


commonQuery.findoneData = function findoneData(model, condition, fetchVal) {
    return new Promise(function (resolve, reject) {
        model.findOne(condition, fetchVal)
            .lean().exec((err, data) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(data);
                }
            });
    })
}

commonQuery.lastInsertedId = function lastInsertedId(model) {
    return new Promise(function (resolve, reject) {
        model.findOne().sort({
            id: -1
        }).exec(function (err, data) {
            if (err) {
                resolve(0);
            } else {
                if (data) {
                    var id = data.id + 1;
                } else {
                    var id = 1;
                }
            }
            resolve(id);
        });
    })
}


commonQuery.InsertIntoCollection = function InsertIntoCollection(model, obj) {
    return new Promise(function (resolve, reject) {
        new model(obj).save(function (err, insertedData) {
            if (err) {
                reject(err);
            } else {
                resolve(insertedData);
            }
        });
    })
}

commonQuery.fileUpload = function fileUpload(imagePath, buffer) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path.resolve(imagePath), buffer, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve('uploaded');
            }
        });
    });
}

commonQuery.deleteFile = function deleteFile(filePath) {
    return new Promise(function (resolve, reject) {
        fs.unlink(filePath, function (err) {
            if (err) {
                reject(err);
            } else {
                console.log("Success fully Deleted ");
                resolve("success");
            }
        });
    })
}


commonQuery.updateOneDocument = function updateOneDocument(model, updateCond, updateData) {
    return new Promise(function (resolve, reject) {
        model.findOneAndUpdate(updateCond, {
                $set: updateData
            }, {
                new: true
            })
            .lean().exec(function (err, updatedData) {
                if (err) {
                    reject(0);
                } else {
                    resolve(updatedData);
                }
            });
    })
}
commonQuery.updateOneDocumentIfNotInsert = function updateOneDocumentIfNotInsert(model, updateCond, updateData) {
    return new Promise(function (resolve, reject) {
        model.findOneAndUpdate(updateCond, {
                $set: updateData
            }, {
                new: true,
                upsert: true
            })
            .lean().exec(function (err, updatedData) {
                if (err) {
                    reject(0);
                } else {
                    resolve(updatedData);
                }
            });
    })
}

commonQuery.updateOneDocumentWithOutInserting = (model, updateCond, updateData) => {
    return new Promise((resolve, reject) => {
        model.findOneAndUpdate(updateCond, {
            $set: updateData
        }).lean().exec((err, updatedData) => {
            if (err) {
                console.log(err);
                return reject(0);
            } else {
                return resolve(updatedData);
            }
        });
    })
}


commonQuery.updateAllDocument = function updateAllDocument(model, updateCond, userUpdateData) {
    return new Promise(function (resolve, reject) {
        model.update(updateCond, {
                $set: userUpdateData
            }, {
                multi: true
            })
            .lean().exec(function (err, userInfoData) {
                if (err) {
                    resolve(0);
                } else {
                    resolve(userInfoData);
                }
            });
    })
}


commonQuery.fetch_all = function fetch_all(model, cond, fetchd) {
    return new Promise(function (resolve, reject) {
        model.find(cond, fetchd).lean().exec(function (err, userData) {
            if (err) {
                reject(err);
            } else {
                resolve(userData);
            }

        });
    })
}


commonQuery.fetch_all_distinct = function fetch_all_distinct(model, ditinctVal, cond) {
    return new Promise(function (resolve, reject) {
        model.distinct(ditinctVal, cond).exec(function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }

        });
    })
}


commonQuery.countData = function countData(model, cond) {
    return new Promise(function (resolve, reject) {
        model.count(cond).lean().exec(function (err, userData) {
            if (err) {
                reject(err);
            } else {
                resolve(userData);
            }

        });
    })
}

commonQuery.fetchAllLimit = function fetchAllLimit(query) {
    return new Promise(function (resolve, reject) {
        query.exec(function (err, userData) {
            if (err) {
                reject(err);
            } else {
                resolve(userData);
            }
        });
    })
}



commonQuery.uniqueInsertIntoCollection = function uniqueInsertIntoCollection(model, obj) {
    return new Promise(function (resolve, reject) {
        model.update(
                obj, {
                    $setOnInsert: obj
                }, {
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: true
                })
            .exec(function (err, data) {
                if (err) {
                    resolve(0);
                } else {
                    resolve(data);
                }
            });
    })
}


commonQuery.deleteOneDocument = function deleteOneDocument(model, cond) {
    return new Promise(function (resolve, reject) {
        model.deleteOne(cond).exec(function (err, userData) {
            if (err) {
                resolve(0);
            } else {
                resolve(1);
            }

        });
    })
}

commonQuery.InsertManyIntoCollection = function InsertManyIntoCollection(model, obj) {
    return new Promise(function (resolve, reject) {
        model.insertMany(obj, function (error, inserted) {
            if (error) {
                console.log('---------------------', error)
                resolve(error);
            } else {
                resolve(inserted);
            }

        });
    })
}


commonQuery.deleteManyfromCollection = function deleteManyfromCollection(model, obj) {
    return new Promise(function (resolve, reject) {
        model.deleteMany(obj, function (error, inserted) {
            if (error) {
                console.log("Reject", error);
                resolve(0);
            } else {
                console.log("Resolved");
                resolve(1);
            }

        });
    })
}



module.exports = commonQuery;