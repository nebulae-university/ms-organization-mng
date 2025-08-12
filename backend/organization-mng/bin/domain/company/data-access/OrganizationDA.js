"use strict";

let mongoDB = undefined;
const { map, mapTo } = require("rxjs/operators");
const { of, Observable, defer } = require("rxjs");

const { CustomError } = require("@nebulae/backend-node-tools").error;

const CollectionName = 'Organization';

class OrganizationDA {
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
  static getOrganization$(id) {
    const collection = mongoDB.db.collection(CollectionName);

    const query = {
      _id: id
    };
    return defer(() => collection.findOne(query)).pipe(
      map((res) => {
        return res !== null
          ? { ...res, id: res._id }
          : {}
      })
    );
  }

  static getOrganizationToSync$() {
    const collection = mongoDB.db.collection(CollectionName);
    const query = {
      active:true,
      'attributes.PINT_CONFIGURATIONS': { $exists: true }
    };
    let cursor = collection.find(query, {});
    return mongoDB.extractAllFromMongoCursor$(cursor).pipe(
      map(res => ({ ...res, id: res._id }))
    );
  }

  static getOrganizationList$(filter = {}, pagination = {}, sortInput) {
    const collection = mongoDB.db.collection(CollectionName);
    const { page = 0, count = 10 } = pagination;

    const query = {};

    if (filter.name) {
      query["name"] = { $regex: filter.name, $options: "i" };
    }    
    if (filter.organizationId) {
      query["_id"] = filter.organizationId;
    }    
    const projection = { name: 1, active: 1, logoUrl: 1 };

    let cursor = collection
      .find(query, {projection})
      .skip(count * page)
      .limit(count);

    const sort = {};
    if (sortInput) {
      sort[sortInput.field] = sortInput.asc ? 1 : -1;
    } else {
      sort["metadata.createdAt"] = -1;
    }
    cursor = cursor.sort(sort);


    return mongoDB.extractAllFromMongoCursor$(cursor).pipe(
      map(res => ({ ...res, id: res._id }))
    );
  }

  static getOrganizationSize$(filter = {}) {
    const collection = mongoDB.db.collection(CollectionName);

    const query = {};

    if (filter.name) {
      query["name"] = { $regex: filter.name, $options: "i" };
    }    
    if (filter.organizationId) {
      query["_id"] = filter.organizationId;
    }    

    return defer(() => collection.countDocuments(query));
  }

  /**
  * creates a new Organization 
  * @param {*} id Organization ID
  * @param {*} Organization properties
  */
  static createOrganization$(_id, properties, createdBy) {

    const metadata = { createdBy, createdAt: Date.now(), updatedBy: createdBy, updatedAt: Date.now() };
    const collection = mongoDB.db.collection(CollectionName);
    return defer(() => collection.insertOne({
      _id,
      ...properties,
      metadata,
    })).pipe(
      map(({ insertedId }) => ({ id: insertedId, ...properties, metadata }))
    );
  }

  /**
  * modifies the Organization properties
  * @param {String} id  Organization ID
  * @param {*} Organization properties to update
  */
  static updateOrganization$(_id, properties, updatedBy) {
    const collection = mongoDB.db.collection(CollectionName);
    return defer(() =>
      collection.findOneAndUpdate(
        { _id },
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
  * modifies the Organization properties
  * @param {String} id  Organization ID
  * @param {*} Organization properties to update
  */
  static updateOrganizationFromRecovery$(_id, properties, av) {
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
  * modifies the Organization properties
  * @param {String} id  Organization ID
  * @param {*} Organization properties to update
  */
  static replaceOrganization$(_id, properties) {
    const collection = mongoDB.db.collection(CollectionName);
    return defer(() =>
      collection.replaceOne(
        { _id },
        properties,
      )
    ).pipe(
      mapTo({ id: _id, ...properties })
    );
  }

  /**
    * deletes an Organization 
    * @param {*} _id  Organization ID
  */
  static deleteOrganization$(_id) {
    const collection = mongoDB.db.collection(CollectionName);
    return defer(() =>
      collection.deleteOne({ _id })
    );
  }

  /**
    * deletes multiple Organization at once
    * @param {*} _ids  Organization IDs array
  */
  static deleteOrganizations$(_ids) {
    const collection = mongoDB.db.collection(CollectionName);
    return defer(() =>
      collection.deleteMany({ _id: { $in: _ids } })
    ).pipe(
      map(({ deletedCount }) => deletedCount > 0)
    );
  }

}
/**
 * @returns {OrganizationDA}
 */
module.exports = OrganizationDA;
