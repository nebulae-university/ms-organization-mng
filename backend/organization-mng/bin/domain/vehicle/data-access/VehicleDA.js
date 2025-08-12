"use strict";

let mongoDB = undefined;
const { map, mapTo } = require("rxjs/operators");
const { of, Observable, defer } = require("rxjs");
const uuidv4 = require("uuid/v4");

const { CustomError } = require("@nebulae/backend-node-tools").error;

const CollectionName = 'Vehicle';

class VehicleDA {

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
   * Update vehicle in maintance
   */
  static updateVehicleInMaintance$(_id, organizationId, companyId, properties) {
    const collection = mongoDB.db.collection(CollectionName);
    const query = {
      _id,
      organizationId,
      companyId
    };
    
    properties["metadata.updatedBy"] = "SYSTEM";
    properties["metadata.updatedAt"] = Date.now();
    properties["metadata.createdBy"] = "SYSTEM";

    return defer(() =>
      collection.findOneAndUpdate(
        query,
        {
          $set: {
            ...properties
          }
        },
        {          
          returnDocument: 'after'
        }
      )
    ).pipe(
      map(result => result && result.value ? { ...result.value, id: result.value._id } : undefined)
    );
  }

  /**
   * Gets an user by its username
   */
  static getVehicle$(id, organizationId, companyId) {
    const collection = mongoDB.db.collection(CollectionName);

    const query = {
      _id: id, organizationId
    };
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



  /**
 * Gets an user by its username
 */
  static getVehicleByPlate$(plate, organizationId, vehicleId = null) {
    const collection = mongoDB.db.collection(CollectionName);

    const query = {
      plate,
      organizationId
    };
    if (vehicleId) {
      query._id = { $ne: vehicleId };
    }
    return defer(() => collection.findOne(query)).pipe(
      map((res) => {
        return res !== null
          ? { ...res, id: res._id }
          : null
      })
    );
  }

  /**
   * Gets an user by its username
   */
  static getExternalVehicle$(id, organizationId, companyId) {
    const collection = mongoDB.db.collection(CollectionName);

    const query = {
      externalSystemId: id, organizationId
    };
    if (companyId) {
      query.companyId = companyId;
    }
    return defer(() => collection.findOne(query)).pipe(
      map((res) => {
        return res !== null
          ? { ...res, id: res.externalSystemId }
          : {}
      })
    );
  }

  /**
  * modifies the Route properties
  * @param {String} id  Route ID
  * @param {*} Route properties to update
  */
  static persistVehicle$(externalSystemId, properties, organizationId, companyId, createdBy, updatedBy) {
    const collection = mongoDB.db.collection(CollectionName);
    delete properties.pendingToReportToParent;

    properties["metadata.updatedBy"] = updatedBy;
    properties["metadata.updatedAt"] = Date.now();
    delete properties._id;
    if (createdBy) {
      properties._id = uuidv4();
      properties["metadata.createdBy"] = createdBy;
      properties["metadata.createdAt"] = Date.now();
      properties.capacity = properties.capacity || {};
      properties.colors = properties.colors || [];
      properties.regulatoryCompliance = properties.regulatoryCompliance || {};

      properties["humanResources.ownerIds"] = (properties.humanResources || {}).ownerIds || [];
      properties["humanResources.driverIds"] = (properties.humanResources || {}).driverIds || [];
      properties["humanResources.managerIds"] = (properties.humanResources || {}).managerIds || [];
    }
    const query = { externalSystemId };
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
            ...properties, deviceId: properties.deviceId || properties.plate
          }
        },
        {
          upsert: true,
          returnDocument: 'after'
        }
      )
    ).pipe(
      map(result => result && result.value ? { ...result.value, id: externalSystemId } : undefined)
    );
  }


  static updatePintVehicle$(id, properties, organizationId, companyId) {
    const collection = mongoDB.db.collection(CollectionName);
    delete properties.pendingToReportToParent;
    if (properties.metadata) {
      properties.metadata.updatedBy = "SYSTEM";
      properties.metadata.updatedAt = Date.now();
      properties.metadata.createdBy = "SYSTEM";
    } else {
      properties["metadata.updatedBy"] = "SYSTEM";
      properties["metadata.updatedAt"] = Date.now();
      properties["metadata.createdBy"] = "SYSTEM";
    }

    const query = { _id: id };
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
            ...properties, deviceId: properties.deviceId || properties.plate
          }
        },
        {
          upsert: true,
          returnDocument: 'after'
        }
      )
    );
  }

  static generateListingQuery(filter) {
    const query = {};
    if (filter.organizationId) {
      query["organizationId"] = filter.organizationId;
    }

    if (filter.keyword) {
      query["$or"] = [
        { "internalNumber": { $regex: filter.keyword, $options: "i" } },
        { "plate": { $regex: filter.keyword, $options: "i" } },
        { "model": { $regex: filter.keyword, $options: "i" } },
        { "manufacturer": { $regex: filter.keyword, $options: "i" } },
        { "deviceId": { $regex: filter.keyword, $options: "i" } }
      ];
    }

    if (filter.plate) {
      query["plate"] = filter.plate;
    }

    if (filter.active !== undefined) {
      query["active"] = filter.active;
    }

    if (filter.ownerId !== undefined) {
      query["humanResources.ownerIds"] = filter.ownerId;
    }

    if (filter.managerId !== undefined) {
      query["humanResources.managerIds"] = filter.managerId;
    }

    if (filter.driverId !== undefined) {
      query["humanResources.driverIds"] = filter.driverId;
    }
    if (filter.company === "ALL_COMPANIES" &&  filter.companyId != null) {
      query["companyId"] ={ $in: filter.companyId }
    }

    if (filter.company !== undefined && filter.company !== "ALL_COMPANIES") {
      if (filter.company === "NO_COMPANY") {
        query["companyId"] = null;
      }
      else {
        query["companyId"] = filter.company;
      }
    }

    return query;
  }

  static getVehicleList$(filter = {}, pagination = {}, sortInput, ignoreProjection = false) {
    const collection = mongoDB.db.collection(CollectionName);
    const { page = 0, count = 10 } = pagination;

    const query = this.generateListingQuery(filter);    


    const projection = ignoreProjection
      ? {}
      : { plate: 1, active: 1, internalNumber: 1, type: 1, deviceId: 1, devSerial: 1, externalSystemId: 1, pendingToReportToParent: 1, companyId: 1, humanResources: 1, hasDriverDoor: 1 };

    let cursor = collection.find(query, { projection });


    if (!filter.unlimitedQuery) {
      cursor = cursor.skip(count * page).limit(count);
    }

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

  static getVehicleSize$(filter = {}) {
    const collection = mongoDB.db.collection(CollectionName);

    const query = this.generateListingQuery(filter);

    return defer(() => collection.countDocuments(query));
  }

  /**
  * creates a new Vehicle 
  * @param {*} id Vehicle ID
  * @param {*} Vehicle properties
  */
  static createVehicle$(_id, properties, createdBy) {

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
  * modifies the Vehicle properties
  * @param {String} id  Vehicle ID
  * @param {*} Vehicle properties to update
  */
  static updateVehicle$(_id, properties, updatedBy, organizationId, companyId) {
    const collection = mongoDB.db.collection(CollectionName);
    const query = { _id };
    if (organizationId) {
      query.organizationId = organizationId;
    }
    // if (companyId) {
    //   query.companyId = companyId;
    // }
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
  * modifies the Vehicle properties
  * @param {String} id  Vehicle ID
  * @param {*} Vehicle properties to update
  */
  static setPendingToReportToParentFlagOnVehicle$(_id, properties, updatedBy, organizationId, companyId, statePending) {
    const collection = mongoDB.db.collection(CollectionName);
    delete properties._id;
    delete properties.metadata;

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
            "pendingToReportToParent": statePending,
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
  * modifies the Vehicle properties
  * @param {String} id  Vehicle ID
  * @param {*} Vehicle properties to update
  */
  static updateVehicleFromRecovery$(_id, properties, av) {
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
  * modifies the Vehicle properties
  * @param {String} id  Vehicle ID
  * @param {*} Vehicle properties to update
  */
  static replaceVehicle$(_id, properties, organizationId, companyId) {
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
    * deletes an Vehicle 
    * @param {*} _id  Vehicle ID
  */
  static deleteVehicle$(_id) {
    const collection = mongoDB.db.collection(CollectionName);
    return defer(() =>
      collection.deleteOne({ _id })
    );
  }

  /**
    * deletes multiple Vehicle at once
    * @param {*} _ids  Vehicle IDs array
  */
  static deleteVehicles$(_ids, organizationId, companyIds) {
    const collection = mongoDB.db.collection(CollectionName);
    const query = { _id: { $in: _ids } };
    if (organizationId) {
      query.organizationId = organizationId;
    }
    if (companyIds) {
      query["companyId"] = { $in: companyIds };
    }
    return defer(() =>
      collection.deleteMany(query)
    ).pipe(
      map(({ deletedCount }) => deletedCount > 0)
    );
  }

  static deleteVehicleExternalSystemIds$(_ids, organizationId, companyId) {
    const collection = mongoDB.db.collection(CollectionName);
    const query = { $or: [{ _id: { $in: _ids } }, { externalSystemId: { $in: _ids } }] };

    if (organizationId) {
      query.organizationId = organizationId;
    }
    if (companyId) {
      query.companyId = companyId;
    }

    return defer(() =>
      collection.deleteMany(query)
    ).pipe(
      map(({ deletedCount }) => deletedCount > 0)
    );
  }

  /**
   * get vehicles PendingToReportToParent true
   */

  static getVehiclePendingToReportToParent$() {
    const collection = mongoDB.db.collection(CollectionName);
    const page = 0;
    const count = 10;

    const query = { "pendingToReportToParent": true };

    let cursor = collection
      .find(query, {})
      .skip(count * page)
      .limit(count);

    return mongoDB.extractAllFromMongoCursor$(cursor).pipe(
      map(res => ({ ...res, id: res._id }))
    );

  }

  static updateVehicleFromImportation$(_id, properties, organizationId, updatedBy) {
    const collection = mongoDB.db.collection(CollectionName);
    const { deviceId, companyId, ...propertiesToSet } = properties
    const query = { _id, organizationId };
    return defer(() =>
      collection.findOneAndUpdate(
        query,
        {
          $set: {
            ...propertiesToSet,
            "metadata.updatedBy": updatedBy, "metadata.updatedAt": Date.now()
          }
        },
        {
          returnDocument: 'after',
          upsert: true
        }
      )
    ).pipe(
      map(result => result && result.value ? { ...result.value, id: result.value._id } : undefined)
    );
  }
  static createVehicleFromImportation$(_id, properties, organizationId, createdBy) {
    const collection = mongoDB.db.collection(CollectionName);
    const { plate, ...propertiesToSet } = properties
    const query = { plate, organizationId };
    const propertiesToSetOnInsert = {
      _id,
      ownership: 'OWN',
      active: true,
      hasDriverDoor: false,
      type: 'OTHER',
      manufacturer: 'OTHER',
      model: '',
      year: new Date().getFullYear(),
      fuelType: 'GASOLINE',
      emissionsStandard: 'OTHER',
      schemaType: 'NONE',
      colors: [],
      chassisNumber: '',
      engineNumber: '',
      internalNumber: '',
      bodyworkBrand: '',
      fuelRangeWithFullTank: 0,
      "capacity.seated":0,
      "capacity.standing":0,
      "regulatoryCompliance.operationCardNumber": "",
      "regulatoryCompliance.operationCardExpeditionDate": Date.now(),
      "regulatoryCompliance.operationCardExpirationDate": Date.now(),
      "regulatoryCompliance.operationCardCompany": "",
      "regulatoryCompliance.operationCardInternalNumber": "",
      "regulatoryCompliance.mandatoryInsuranceNumber": "",
      "regulatoryCompliance.mandatoryInsuranceExpeditionDate": Date.now(),
      "regulatoryCompliance.mandatoryInsuranceExpirationDate": Date.now(),
      "regulatoryCompliance.mandatoryInsuranceIssuer": "",
      "regulatoryCompliance.technomechanicalNumber": "",
      "regulatoryCompliance.technomechanicalExpeditionDate": Date.now(),
      "regulatoryCompliance.technomechanicalExpirationDate": Date.now(),
      "regulatoryCompliance.technomechanicalIssuer": "",
      "regulatoryCompliance.carInsuranceNumber": "",
      "regulatoryCompliance.carInsuranceExpeditionDate": Date.now(),
      "regulatoryCompliance.carInsuranceExpirationDate": Date.now(),
      "regulatoryCompliance.carInsuranceIssuer": "",
      deviceId: '',
      "humanResources.ownerIds": [],
      "humanResources.driverIds": [],
      "humanResources.managerIds": [],
      ...propertiesToSet,
      organizationId
    };
    return defer(() =>
      collection.findOneAndUpdate(
        query,
        {
          $setOnInsert: {
            ...propertiesToSetOnInsert,
            "metadata.createdBy": createdBy, "metadata.createdAt": Date.now(),
            "metadata.updatedBy": createdBy, "metadata.updatedAt": Date.now()
          }
        },
        {
          returnDocument: 'after',
          upsert: true
        }
      )
    ).pipe(
      map(result => result && result.value ? { ...result.value, id: result.value._id } : undefined)
    );
  }


}
/**
 * @returns {VehicleDA}
 */
module.exports = VehicleDA;
