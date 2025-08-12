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
    }
    if (organizationId) {
      query.organizationId = organizationId;
    }
    if (Array.isArray(companyId) && companyId.length > 0) { 
      query.companyId = { $in: companyId };
    } 
    else if (companyId) {
      query.companyId = companyId;
    }
    return defer(() => collection.findOne(query)).pipe(
      map((res) => {
        return res !== null
          ? { ...res, id: res._id }
          : {}
      })
    );
  }

  static getUsersWithAnSpecificProjectionByCompanyId$(partnerId, projection) {


    const collection = mongoDB.db.collection(CollectionName);
    const query = {
      companyIds: { $in: [partnerId] }
    };

    let cursor = collection
      .find(query, { projection })

    return mongoDB.extractAllFromMongoCursor$(cursor).pipe(
      map(res => ({ ...res, id: res._id }))
    );
  }

  static getUserList$(filter = {}, pagination = {}, sortInput, ignoreProjection = false) {
    const collection = mongoDB.db.collection(CollectionName);
    const { page = 0, count = 10 } = pagination;

    const query = {};
    if (filter.name) {
      query["$or"] = [
        { "firstName": { $regex: filter.name, $options: "i" } },
        { "lastName": { $regex: filter.name, $options: "i" } },
        { "documentId": { $regex: filter.name, $options: "i" } },
        { "emailAddress": { $regex: filter.name, $options: "i" } }
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
    if (filter.company === "ALL_COMPANIES" &&  filter.companyId != null) {
      query["companyId"] ={ $in: filter.companyId }
    }
    if (filter.company !== undefined && filter.company !== "ALL_COMPANIES") {
      if (filter.company === "NO_COMPANY") {
        query["companyId"] = "";
      }
      else {
        query["companyId"] = filter.company;
      }
    }
    if (filter.companyIds !== undefined) {
      query["companyIds"] = { "$in": filter.companyIds };
    }
    if (filter.documentId !== undefined) {
      query["documentId"] = filter.documentId;
    }
    if (filter.userIds !== undefined && filter.userIds.userIds > 0) {
      query["_id"] = { "$in": filter.userIds };
    }
    if (filter.roleId) {
      query["roles"] = { $in: [filter.roleId] }
    }
    if (filter.roleMapName) {
      query["roleMapName"] = filter.roleMapName;
    }
    if (filter.isPointOfSaleManager) {
      query["metadata.createdBy"] = filter.isPointOfSaleManager;
    }

    const projection = !ignoreProjection
      ? { firstName: 1, lastName: 1, active: 1, documentId: 1, emailAddress: 1, metadata: 1 }
      : {};

    let cursor = collection
      .find(query, { projection })
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
    if (filter.company === "ALL_COMPANIES" &&  filter.companyId != null) {
      query["companyId"] ={ $in: filter.companyId }
    }
    if (filter.company !== undefined && filter.company !== "ALL_COMPANIES") {
      if (filter.company === "NO_COMPANY") {
        query["companyId"] = "";
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
    if (filter.roleId) {
      query["roles"] = { $in: [filter.roleId] }
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
  static updateUser$(_id, properties, updatedBy, isPointOfSaleManager, organizationId, companyId) {
    const collection = mongoDB.db.collection(CollectionName);
    const query = { _id };
    if (organizationId) {
      query.organizationId = organizationId;
    }
    // if (companyId) {
    //   query.companyId = companyId;
    // }
    if (isPointOfSaleManager) {
      query["metadata.createdBy"] = updatedBy;
    }
    (() => { })("QUERY", query);

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

  static updateUserRemovePartner$ = (_id, valueToEliminate) => {
    const collection = mongoDB.db.collection(CollectionName);
    const query = { _id };

    const update = {
      $pull: {
        companyIds: { $in: valueToEliminate }
      }
    };

    const options = {
      returnDocument: 'after',
    };

    return defer(() =>
      collection.findOneAndUpdate(query, update, options)
    ).pipe(
      map(result => result && result.value ? { ...result.value, id: result.value._id } : undefined)
      // map(result => result ? { result } : undefined),
    );
  };



  static updateUserAddPartner$ = (_id, valueToAdd) => {

    const collection = mongoDB.db.collection(CollectionName);
    const query = { _id };

    const update = {
      $addToSet: {
        companyIds: { $each: valueToAdd }
      }
    };

    const options = {
      returnDocument: "after" // Devuelve el documento después de la actualización
    };

    return defer(() =>
      collection.findOneAndUpdate(query, update, options)
    ).pipe(
      map(result => result.value) // Transforma el resultado para emitir el documento actualizado
    );
  };




  /**
  * modifies the User properties
  * @param {String} id  User ID
  * @param {*} User properties to update
  */
  static replaceUser$(_id, properties, updatedBy, isPointOfSaleManager, organizationId, companyId) {


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
  static deleteUsers$(_ids, companyIds) {
    const collection = mongoDB.db.collection(CollectionName);
    const update = { _id: { $in: _ids }}
    
    if (companyIds) {
      update["companyId"] = { $in: companyIds };
    }
    return defer(() =>
      collection.deleteMany(update)
    ).pipe(
      map(({ deletedCount }) => deletedCount > 0)
    );
  }

}
/**
 * @returns {UserDA}
 */
module.exports = UserDA;
