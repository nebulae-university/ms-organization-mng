"use strict";

let mongoDB = undefined;
const { map, mapTo, catchError, tap } = require("rxjs/operators");
const { of, Observable, defer, throwError } = require("rxjs");
const { ConsoleLogger } = require('@nebulae/backend-node-tools').log;
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

  static getCompanyByNameOrDocument$(name, document, organizationId) {
    const collection = mongoDB.db.collection(CollectionName);

    const query = {
      $or: [{ name, organizationId }, { document, organizationId }]
    };
    let cursor = collection
      .find(query);
    return mongoDB.extractAllFromMongoCursor$(cursor).pipe(
      map(res => ({ ...res, id: res._id }))
    )
  }

  static getAlliesList$(alliesSearch, organizationId, companyId) {
    const collection = mongoDB.db.collection(CollectionName);
    const query = {
      _id: { $ne: companyId },
      organizationId,
      name: new RegExp(alliesSearch, 'i'),
      active: true,
      $or: [
        { "partners": { "$exists": false } },
        { 
            $expr: { 
                $eq: [
                    { "$ifNull": [{ "$size": { "$ifNull": ["$partners", []] } }, 0] },
                    0
                ] 
            }
        }
    ]
    }
    const projection = { name: 1, active: 1 };

    let cursor = collection
      .find(query, { projection })

    return mongoDB.extractAllFromMongoCursor$(cursor).pipe(
      map(res => ({ ...res, id: res._id }))
    )
  }

  static getAlliesSelectingListing$(ids) {
    const collection = mongoDB.db.collection(CollectionName);
    const query = {
      _id: { $in: ids },
      active: true
    }
    const projection = { name: 1, active: 1 };

    let cursor = collection
      .find(query, { projection })

    return mongoDB.extractAllFromMongoCursor$(cursor).pipe(
      map(res => ({ ...res, id: res._id }))
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
    if(filter.companyIds != null){
      query["_id"] = { $in : filter.companyIds };
   }

    const projection = { name: 1, active: 1, document: 1, authorityCode: 1, partners: 1, partnerId: 1 };

    let cursor = collection
      .find(query, { projection })
      .skip(count * page)
      .limit(count)
      .sort({ name: 1 });

    return mongoDB.extractAllFromMongoCursor$(cursor).pipe(
      map(res => ({ ...res, id: res._id }))
    );
  }

  static getCompanyExternalList$(filter, pagination = {}) {
    const collection = mongoDB.db.collection(CollectionName);
    const { page = 0, count = 0 } = pagination;
    const query = {};

    if (filter.organizationId) {
      query["organizationId"] = filter.organizationId;
    }

    const projection = {
      name: 1,
      active: 1,
      document: 1,
      documentType: 1,
      authorityCode: 1,
      useGeocodeTranslation: 1,
      organizationId: 1,
      description: 1,
      logoUrl: 1,
      industry: 1,
      vehicleQuota: 1,
      paymentMediumCode: 1,
      metadata: 1,
      attributes: 1
    };

    let cursor = collection
      .find(query, { projection })
      .sort({ _id: 1 })
      .skip(page * count)
      .limit(count);

    return mongoDB.extractAllFromMongoCursor$(cursor);
  }

  static insertCompanies$(propertiesToInsert) {
    const collection = mongoDB.db.collection(CollectionName);
    return defer(() => collection.bulkWrite(propertiesToInsert)).pipe(
      catchError(err => {
        ConsoleLogger.e(`CompanyDA.insertCompanies: Error writing bulk data: ${JSON.stringify(propertiesToInsert)}`, err);
        return throwError(err);
      })
    );
  }

  static updateAlliesFromCompanys$(companyId, ids, organizationId) {
    const collection = mongoDB.db.collection(CollectionName);
    const updateObj = {
      $set: {
        partners: ids
      }
    };
    return defer(() =>
      collection.findOneAndUpdate(
        { _id: companyId, organizationId },
        updateObj,
        {
          returnDocument: 'after',
        }
      )
    ).pipe(
      map(result => result && result.value ? { ...result.value, id: result.value._id } : undefined)
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
    if(filter.companyIds != null) {
      query._id = { $in: filter.companyIds };
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



    delete properties.partnerId;
    delete properties.agregatePartnersToDelete;

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


  static agregateNewPropertieForAlliesCompanies$ = (properties) => {

    const collection = mongoDB.db.collection(CollectionName);
    const query = { _id: { $in: properties?.partners } };



    const update = {
      $addToSet: {
        partnerId: properties.id
      }
    };

    return defer(() =>
      collection.updateMany(query, update)
    ).pipe(
      map(result => result ? properties : undefined),
    );
  };

  static deleteNewPropertieForAlliesCompanies$ = (properties, idsToEliminate) => {


    const collection = mongoDB.db.collection(CollectionName);
    const query = { _id: { $in: idsToEliminate } };



    const update = {
      $pull: {
        partnerId: properties.id
      }
    };

    return defer(() =>
      collection.updateMany(query, update)
    ).pipe(
      map(result => result ? properties : undefined),
    );
  };






  /**
  * modifies the Company properties
  * @param {String} id  Company ID
  * @param {*} Company properties to update
  */
  static updateCompanyFromRecovery$(properties) {
    const collection = mongoDB.db.collection(CollectionName);
    return defer(() =>
      collection.updateMany(
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
  static appendCompanyDocument$(_id, name, fileURL, uploaderUserId, uploaderUserFullname, uploadTimestamp) {
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
          $pull: { documents: { fileURL: { $in: [...fileUrls] } } }
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
