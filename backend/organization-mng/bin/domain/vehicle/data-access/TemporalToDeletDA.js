"use strict";

let mongoDB = undefined;
const { map, mapTo } = require("rxjs/operators");
const { of, Observable, defer } = require("rxjs");

const { CustomError } = require("@nebulae/backend-node-tools").error;

const CollectionName = 'TemporalToDelet';

class TemporalToDeletDA {
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

  /**
  * creates a new TemporalToDelet 
  * @param {*} id TemporalToDelet ID
  * @param {*} TemporalToDelet properties
  */
   static createTemporalToDelet$(_id, properties, createdBy, organizationId, companyId) {

    const metadata = { createdBy, createdAt: Date.now(), updatedBy: createdBy, updatedAt: Date.now() };
    const collection = mongoDB.db.collection(CollectionName);
    return defer(() => collection.insertOne({
      _id,
      ids: [...properties],
      organizationId, 
      companyId,
      metadata,
    })).pipe(
      map(({ insertedId }) => ({ id: insertedId, ...properties, metadata }))
    );
  }

  /**
   * Gets an user by its username
   */
  static getTemporalToDelet$() {
    const collection = mongoDB.db.collection(CollectionName);
    const page = 0;
    const count = 10; 
    
    const query = {};

    let cursor = collection
      .find(query, { })
      .skip(count * page)
      .limit(count);

    return mongoDB.extractAllFromMongoCursor$(cursor).pipe(
      map(res => ({ ...res, id: res._id }))
    );
  }
  
  static deleteTemporalToDelet$(_id) {
    const collection = mongoDB.db.collection(CollectionName);
    return defer(() =>
      collection.deleteOne({ _id })
    );
  }

}
/**
 * @returns {TemporalToDeletDA}
 */
module.exports = TemporalToDeletDA;
