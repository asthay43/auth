'use strict';
/*
 * commonQuery - commnQuery.js
 * Author: smartData Enterprises
 * 
 */
//var constant = require('./../../constants');
var constant = require('./../../config/constant');


var fs = require("fs");
var path = require('path');
var async = require('async');

//var User = require('../models/users');

var commonQuery = {};

/**
 * Function is use to Fetch Single data
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 22-Jan-2018
 */
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
/**
 * Function is use to Last Inserted id
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 22-Jan-2018
 */
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

/**
 * Function is use to Insert object into Collections
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 22-Jan-2018
 */
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
/**
 * Function is use to upload file into specific location
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 31-Jan-2018
 */
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
/**
 * Function is use to check File Exist or not
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 23-Jan-2018
 */
// commonQuery.FileExist = function FileExist(imagePath, noImage, imageloc) {
//     return new Promise(function (resolve, reject) {
//         utility.fileExistCheck(imagePath, function (exist) {
//             if (!exist) {
//                 console.log("no Imagessssssssss");
//                 resolve(constant.config.baseUrl + noImage);
//             } else {
//                 resolve(constant.config.baseUrl + imageloc);
//             }
//         });
//     })
// }
/**
 * Function is use to delete file from specific directory
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 31-Jan-2018
 */
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

/**
 * Function is use to Update One Document
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 23-Jan-2018
 */
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
/**
 * Function is use to Update One Document, if not insert
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 23-Jan-2018
 */
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

/**
 * Function is use to Update One Document
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 23-Jan-2018
 */
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

/**
 * Function is use to Update All Document
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 23-Jan-2018
 */
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

/**
 * Function is use to Find all Documents
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 23-Jan-2018
 */
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

/**
 * Function is use to Find all Distinct value
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 27-June-2018
 */

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

/**
 * Function is use to Count number of record from a collection
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 23-Jan-2018
 */
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
/**
 * Function is use to Fetch All data from collection , Also it supports aggregate function
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 23-Jan-2018
 */
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

/**
 * Function is use to Insert object into Collections , Duplication restricted
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 07-Feb-2018
 */

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

/**
 * Function is use to DeleteOne Query
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 07-Feb-2018
 */
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
/**
 * Function is use to Insert Many object into Collections
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 15-Feb-2018
 */
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

/**
 * Function is use to delete Many document from Collection
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 16-Feb-2018
 */
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