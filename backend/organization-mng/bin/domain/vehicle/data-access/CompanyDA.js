"use strict";

let mongoDB = undefined;
const { map, mapTo } = require("rxjs/operators");
const { of, Observable, defer } = require("rxjs");

const { CustomError } = require("@nebulae/backend-node-tools").error;

const CollectionName = 'Company';

class CompanyDA {
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
  static getCompany$(id, organizationId) {
    const collection = mongoDB.db.collection(CollectionName);
    
    const query = {
      _id: id, organizationId
    };
    return defer(() => collection.findOne(query)).pipe(
      map((res) => {
        return res !== null
          ? { ...res, id: res._id }
          : {}
      })
    );
  }

  static getCompanyByName$(name, organizationId){
    const collection = mongoDB.db.collection(CollectionName);
    
    const query = {
      name: name, organizationId
    };
    return defer(() => collection.findOne(query)).pipe(
      map((res) => {
        return res !== null
          ? { ...res, id: res._id }
          : null
      })
    );
  }
  static getCompanyList$(filter = {}, pagination = {}, sortInput) {
    const collection = mongoDB.db.collection(CollectionName);
    const { page = 0, count = 10 } = pagination;

    const query = {};

    if (filter.name) {
      query["name"] = { $regex: filter.name, $options: "i" };
    }
    if (filter.organizationId) {
      query["organizationId"] = filter.organizationId;
    }
    if (filter.active !== undefined) {
      query["active"] = filter.active;
    }
    const projection = { name: 1, active: 1 };

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

  static getCompanySize$(filter = {}) {
    const collection = mongoDB.db.collection(CollectionName);

    const query = {};

    if (filter.name) {
      query["name"] = { $regex: filter.name, $options: "i" };
    }
    if (filter.organizationId) {
      query["organizationId"] = filter.organizationId;
    }
    if (filter.active !== undefined) {
      query["active"] = filter.active;
    }

    return defer(() => collection.countDocuments(query));
  }

  /**
  * creates a new Company 
  * @param {*} id Company ID
  * @param {*} Company properties
  */
  static createCompany$(_id, properties, createdBy) {

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
  * modifies the Company properties
  * @param {String} id  Company ID
  * @param {*} Company properties to update
  */
  static updateCompany$(_id, properties, updatedBy) {
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
  * modifies the Company properties
  * @param {String} id  Company ID
  * @param {*} Company properties to update
  */
  static updateCompanyFromRecovery$(_id, properties, av) {
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
  * modifies the Company properties
  * @param {String} id  Company ID
  * @param {*} Company properties to update
  */
  static replaceCompany$(_id, properties) {
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
    * deletes an Company 
    * @param {*} _id  Company ID
  */
  static deleteCompany$(_id) {
    const collection = mongoDB.db.collection(CollectionName);
    return defer(() =>
      collection.deleteOne({ _id })
    );
  }

  /**
    * deletes multiple Company at once
    * @param {*} _ids  Company IDs array
  */
  static appendCompanyDocument$(_id,name, fileURL, uploaderUserId,uploaderUserFullname, uploadTimestamp) {
    const collection = mongoDB.db.collection(CollectionName);
    return defer(() =>
      collection.findOneAndUpdate({ _id }, 
        {
          $push: { documents: { name, fileURL, uploaderUserId, uploaderUserFullname, uploadTimestamp } }
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
    * deletes multiple Company at once
    * @param {*} _ids  Company IDs array
  */
 static removeCompanyDocumentsByFileUrl$(_id, fileUrls) {
  const collection = mongoDB.db.collection(CollectionName);
  return defer(() =>
    collection.findOneAndUpdate({ _id }, 
      {
        $pull: { documents: {fileURL: { $in: [...fileUrls]}} }
      },
      {
        returnDocument: 'after',
      }
    )
  ).pipe(
    map(result => result && result.value ? { ...result.value, id: result.value._id } : undefined)
  );
}

}
/**
 * @returns {CompanyDA}
 */
module.exports = CompanyDA;
