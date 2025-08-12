"use strict";

let mongoDB;
const { map, mapTo } = require("rxjs/operators");
const { of, Observable, defer } = require("rxjs");

const { CustomError } = require("@nebulae/backend-node-tools").error;

const CollectionName = 'PaymentMediumCode';

class PaymentMediumCodeDA {
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
  * autoIncrement to generate the paymentMediumCode
  */
  static incrementAndGet$() {
    const collection = mongoDB.db.collection(CollectionName);
    return defer(() =>
      collection.findOneAndUpdate(
        { _id: "Organization" },
        {
          $inc: {
            seq: 1
          }
        },
        {
          upsert: true,
          returnDocument: 'after',
        }
      )
    ).pipe(
      map(result => result && result.value ? { ...result.value } : undefined)
    );
  }

  static getPaymentMediumCode$(id) {
    const collection = mongoDB.db.collection(CollectionName);
    return defer(() =>collection.findOne({ _id: id }));
  }

  static syncPaymentMediumCode$(paymentMediumCodeSeq, id) {
    const collection = mongoDB.db.collection(CollectionName);
    return defer(() =>
      collection.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            seq: paymentMediumCodeSeq
          }
        },
        {
          upsert: true
        }
      )
    ).pipe(
      map(result => result && result.value ? { ...result.value } : undefined)
    );
  }

}
/**
 * @returns {PaymentMediumCodeDA}
 */
module.exports = PaymentMediumCodeDA;
