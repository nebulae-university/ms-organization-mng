"use strict";

let mongoDB = undefined;
const { map, mapTo } = require("rxjs/operators");
const { of, Observable, defer } = require("rxjs");

const { CustomError } = require("@nebulae/backend-node-tools").error;

const CollectionName = 'User';

class UserDA {
  static start$(mongoDbInstance) {
    return Observable.create(observer => {
      if (mongoDbInstance) {
        mongoDB = mongoDbInstance;
        observer.next(`${this.name} using given mongo instance`);
      } else {
        mongoDB = require("../../../tools/mongo-db/MongoDB").singleton();
        observer.next(`${this.name} using singleton system-wide mongo instance`);
      }
      observer.next(`${this.name} started`);
      observer.complete();
    });
  }


  static getUserList$(userIds) {
    const collection = mongoDB.db.collection(CollectionName);
    const page = 0;
    const count = 20;
    
    const query = {"_id": { "$in": userIds }};    
    const projection = { name: 1, active: 1, documentId: 1, firstName:1, lastName:1 };

    const cursor = collection
      .find(query, {projection})
      .skip(count * page)
      .limit(count);
  
    return mongoDB.extractAllFromMongoCursor$(cursor).pipe(
      map(res => ({ ...res, id: res._id }))
    );
  }

  static getUsersByDocumentId$(documentIdList, organizationId){
    const collection = mongoDB.db.collection(CollectionName);

    const query = {"documentId": { "$in": documentIdList }, organizationId};    
    const projection = { _id:1 };
    const cursor = collection
      .find(query, {projection})
      .limit(documentIdList.length);
  
    return mongoDB.extractAllFromMongoCursor$(cursor).pipe(
      map(res => ({ ...res, id: res._id }))
    );
  }



}
/**
 * @returns {UserDA}
 */
module.exports = UserDA;
