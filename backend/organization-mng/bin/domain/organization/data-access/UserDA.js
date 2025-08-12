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

  /**
   * Gets an user by its username
   */
  static getUser$(id, organizationId, companyId) {
    const collection = mongoDB.db.collection(CollectionName);
    const query = {
      _id: id
    };
    if (companyId) {
      query.companyId = companyId;
    }
    if (organizationId) {
      query.organizationId = organizationId;
    }
    return defer(() => collection.findOne(query)).pipe(
      map((res) => {
        return res !== null
          ? { ...res, id: res._id }
          : {}
      })
    );
  }

  static getUserList$(organizationId) {
    const collection = mongoDB.db.collection(CollectionName);
    const query = {
      // _id: {
      //   $nin: ["f1d9fbab-8ac9-4461-8e0a-341b66ffa2f8", "5558a648-9e93-46bf-8bd3-259bcade81a4", "21e8235b-3b73-4f9d-89a7-4563c5e4a0ae"]
      // },
      organizationId: organizationId
    };
    let cursor = collection
      .find(query)
    return mongoDB.extractAllFromMongoCursor$(cursor).pipe(
      map(res => ({ ...res, id: res._id }))
    );
  }


  static getUserSize$(filter = {}) {
    const collection = mongoDB.db.collection(CollectionName);

    const query = {};

    if (filter.name) {
      query["$or"] = [
        { "firstName": { $regex: filter.name, $options: "i" } },
        { "lastName": { $regex: filter.name, $options: "i" } },
        { "documentId": { $regex: filter.name, $options: "i" } }
      ];
    }
    if (filter.emailAddress) {
      query["emailAddress"] = { $regex: filter.emailAddress, $options: "i" };
    }
    if (filter.username) {
      query["username"] = { $regex: filter.username, $options: "i" };
    }
    if (filter.organizationId) {
      query["organizationId"] = filter.organizationId;
    }
    if (filter.active !== undefined) {
      query["active"] = filter.active;
    }
    if (filter.company !== undefined && filter.company !== "ALL_COMPANIES") {
      if (filter.company === "NO_COMPANY") {
        query["companyId"] = null;
      }
      else {
        query["companyId"] = filter.company;
      }
    }
    if (filter.documentId !== undefined) {
      query["documentId"] = filter.documentId;
    }
    if (filter.userIds !== undefined && filter.userIds.userIds > 0) {
      query["_id"] = { "$in": filter.userIds };
    }

    return defer(() => collection.countDocuments(query));
  }

  /**
  * creates a new User 
  * @param {*} id User ID
  * @param {*} User properties
  */
  static createUser$(_id, properties, createdBy) {

    const metadata = { createdBy, createdAt: Date.now(), updatedBy: createdBy, updatedAt: Date.now() };
    const auth = {};
    const collection = mongoDB.db.collection(CollectionName);
    return defer(() => collection.insertOne({
      _id,
      ...properties,
      auth,
      metadata,
    })).pipe(
      map(({ insertedId }) => ({ id: insertedId, ...properties, metadata }))
    );
  }

  /**
  * modifies the User properties
  * @param {String} id  User ID
  * @param {*} User properties to update
  */
  static updateUser$(_id, properties, updatedBy, organizationId, companyId) {
    const collection = mongoDB.db.collection(CollectionName);
    const query = { _id };
    if (organizationId) {
      query.organizationId = organizationId;
    }
    if (companyId) {
      query.companyId = companyId;
    }
    return defer(() =>
      collection.findOneAndUpdate(
        query,
        {
          $set: {
            ...properties,
            "metadata.updatedBy": updatedBy, "metadata.updatedAt": Date.now()
          }
        },
        {
          returnDocument: 'after',
        }
      )
    ).pipe(
      map(result => result && result.value ? { ...result.value, id: result.value._id } : undefined)
    );
  }

  /**
  * modifies the User properties
  * @param {String} id  User ID
  * @param {*} User properties to update
  */
  static updateUserFromRecovery$(_id, properties, av) {
    const collection = mongoDB.db.collection(CollectionName);
    return defer(() =>
      collection.updateOne(
        {
          _id,
        },
        { $set: { ...properties } },
        {
          returnDocument: 'after',
          upsert: true
        }
      )
    ).pipe(
      map(result => result && result.value ? { ...result.value, id: result.value._id } : undefined)
    );
  }

  /**
  * modifies the User properties
  * @param {String} id  User ID
  * @param {*} User properties to update
  */
  static replaceUser$(_id, properties, updatedBy, organizationId, companyId) {
    const collection = mongoDB.db.collection(CollectionName);
    const query = { _id };
    if (organizationId) {
      query.organizationId = organizationId;
    }
    if (companyId) {
      query.companyId = companyId;
    }
    return defer(() =>
      collection.replaceOne(
        query,
        properties,
      )
    ).pipe(
      mapTo({ id: _id, ...properties })
    );
  }

  /**
    * deletes an User 
    * @param {*} _id  User ID
  */
  static deleteUser$(_id) {
    const collection = mongoDB.db.collection(CollectionName);
    return defer(() =>
      collection.deleteOne({ _id })
    );
  }

  /**
    * deletes multiple User at once
    * @param {*} _ids  User IDs array
  */
  static deleteUsers$(_ids) {
    const collection = mongoDB.db.collection(CollectionName);
    return defer(() =>
      collection.deleteMany({ _id: { $in: _ids } })
    ).pipe(
      map(({ deletedCount }) => deletedCount > 0)
    );
  }

}
/**
 * @returns {UserDA}
 */
module.exports = UserDA;
