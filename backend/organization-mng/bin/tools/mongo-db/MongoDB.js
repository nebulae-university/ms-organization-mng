"use strict";

const { bindNodeCallback, Observable, defer } = require("rxjs");
const { map } = require("rxjs/operators");
const uuidv4 = require("uuid/v4");
const dateFormat = require('dateformat');
const MongoClient = require("mongodb").MongoClient;
const { ConsoleLogger } = require('@nebulae/backend-node-tools').log;

let instance = null;

class MongoDB {
  /**
   * initialize and configure Mongo DB
   * @param { { url, dbName } } ops
   */
  constructor({ url, dbName }) {
    this.url = url;
    this.dbName = dbName;
  }

  /**
   * Starts DB connections
   * @returns {Observable} Obserable that resolve to the DB client
   */
  start$(configureServerHeartbeat = true) {
    const clientInstance = new MongoClient(this.url, {
      monitorCommands: true,
      serverSelectionTimeoutMS: 1000,
      useUnifiedTopology: true
    });

    return defer(() => clientInstance.connect()).pipe(
      map(client => {
        ConsoleLogger.i(this.url);
        this.client = client;
        this.db = this.client.db(this.dbName);
        this.running = true;
        if(configureServerHeartbeat) client.on("serverHeartbeatFailed", (e) => {
          if (!this.running) return;
          client.db("admin").collection('system.version').findOne({}).then((r) => {
            (()=>{})(r);
          }).catch((e) => {
            if(!this?.running) return;
            if (!this.running) return;
            ConsoleLogger.e(`MongoDB:start$: ${JSON.stringify(e)}`, e);
            process.exit(1);
          });
        });
        return `MongoDB connected to dbName= ${this.dbName}`;
      }
      )
    );
  }

  /**
   * Stops DB connections
   * Returns an Obserable that resolve to a string log
   */
  stop$() {
    this.running = false;
    return Observable.create(observer => {
      this.client.close();
      observer.next("Mongo DB Client closed");
      observer.complete();
    });
  }

  /**
   * Ensure Index creation
   * Returns an Obserable that resolve to a string log
   */
  createIndexes$() {
    return Observable.create(async observer => {

      observer.next(`Creating index for ${this.dbName}.User => ({ emailAddress: 1}, { unique: true })  `);
      await this.db.collection('User').createIndex({ emailAddress: 1 }, { unique: true });

      const indexToRemove = await this.db.collection('User').indexExists("documentId_1");
      if (indexToRemove) {
        observer.next(`Removing index for ${this.dbName}.User => ({ documentId: 1 }, { unique: true })  `);
        await this.db.collection('User').dropIndex("documentId_1");
      }

      observer.next(`Creating index for ${this.dbName}.User => ({  organizationId: 1, companyId: 1, documentId: 1 }, { unique: true })  `);
      await this.db.collection('User').createIndex({ organizationId: 1, companyId: 1, documentId: 1 }, { unique: true });

      observer.next(`Creating index for ${this.dbName}.Vehicle => ({ externalSystemId: 1})  `);
      await this.db.collection('Vehicle').createIndex({ externalSystemId: 1 });

      observer.next(`Creating index for ${this.dbName}.User => ({ organizationId: 1, companyId:1})  `);
      await this.db.collection('User').createIndex({ organizationId: 1, companyId: 1 });

      observer.next(`Creating index for ${this.dbName}.Vehicle => ({externalSystemId})  `);
      await this.db.collection('Vehicle').createIndex({ externalSystemId: 1 });

      observer.next(`Creating index for ${this.dbName}.VehicleEvent => ({ vehiceId: 1, type: 1, startingDayOfYear: -1})  `);
      await this.db.collection('VehicleEvent').createIndex({ vehiceId: 1, type: 1, startingDayOfYear: -1 });

      observer.next(`Creating index for ${this.dbName}.VehicleEvent => ({ vehiceId: 1, startingDayOfYear: -1 })  `);
      await this.db.collection('VehicleEvent').createIndex({ vehiceId: 1, startingDayOfYear: -1 });

      observer.next(`Creating index for ${this.dbName}.VehicleEvent => ({ vehiceId: 1, startingDayOfYear: -1 })  `);
      await this.db.collection('VehicleEvent').createIndex({ type: 1, startingDayOfYear: -1 });

      observer.next(`Creating index for ${this.dbName}.VehicleEvent => ({ startingDayOfYear: -1 })  `);
      await this.db.collection('VehicleEvent').createIndex({ startingDayOfYear: -1 });

      observer.next(`Creating index for ${this.dbName}.VehicleEvent => ({ scheduling.state: 1 })  `);
      await this.db.collection('VehicleEvent').createIndex({ "scheduling.state": 1 }, { partialFilterExpression: { "scheduling.state": "SCHEDULED" } });

      observer.next(`Creating index for ${this.dbName}.VehicleEvent => ({ startingDayOfYear:1, organizationId:1, closed: 1 })  `);
      await this.db.collection('VehicleEvent').createIndex({ startingDayOfYear: 1, organizationId: 1, closed: 1 });
      
      observer.next(`Creating index for ${this.dbName}.VehicleEvent => ({ organizationId:1, vehicleId:1, startingTimestamp: -1 })  `);
      await this.db.collection('VehicleEvent').createIndex({ organizationId: 1, vehicleId: 1, startingTimestamp: -1 });

      observer.next("All indexes created");
      observer.complete();
    });
  }

  /**
   * extracts every item in the mongo cursor, one by one
   * @param {*} cursor
   */
  extractAllFromMongoCursor$(cursor) {
    return Observable.create(async observer => {
      try {
        let obj = await MongoDB.extractNextFromMongoCursor(cursor);
        while (obj) {
          observer.next(obj);
          obj = await MongoDB.extractNextFromMongoCursor(cursor);
        }
        observer.complete();
      } catch (err) {
        observer.error(err);
      }

    });
  }

  /**
   * Extracts the next value from a mongo cursos if available, returns undefined otherwise
   * @param {*} cursor
   */
  static async extractNextFromMongoCursor(cursor) {
    const hasNext = await cursor.hasNext();
    if (hasNext) {
      const obj = await cursor.next();
      return obj;
    }
    return undefined;
  }

  /**
   * Generates an UUID with the year and month at the end, this is usefule when the data will be saved on historical partitioned collections
   * @param {*} createUtcMillis 
   */
  static generateHistoricDbID(createUtcMillis) {
    return `${uuidv4()}-${dateFormat(new Date(new Date(createUtcMillis).toLocaleString(process.env.LOCALE, { timeZone: process.env.TIMEZONE })), "yymm")}`;
  }
}

module.exports = {
  MongoDB,
  singleton() {
    if (!instance) {
      instance = new MongoDB({
        url: process.env.MONGODB_URL,
        dbName: process.env.MONGODB_DB_NAME
      });
      ConsoleLogger.i(`MongoDB instance created: ${process.env.MONGODB_DB_NAME}`);
    }
    return instance;
  }
};
