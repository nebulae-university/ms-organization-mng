"use strict";

const { iif, from, of, concat, forkJoin } = require("rxjs");
const { map, filter, mergeMap, concatMap, first, tap } = require('rxjs/operators');
const { eventSourcing } = require("../../tools").EventSourcing;
const { eventSourcingProcessorMaps } = require("../../domain");
const { ConsoleLogger } = require('@nebulae/backend-node-tools').log;
/**
 * Singleton instance
 */
let instance;
/**
 * Micro-BackEnd key
 */
const mbeKey = process.env.MICROBACKEND_KEY;

class EventStoreService {
  constructor() {
    this.eventsProcessMap = this.joinEventsProcessMap();
    this.aggregateTypeVsEventsVsConfig = this.joinAggregateTypeVsEventsVsConfigMap();
    this.subscriptions = [];
    this.eventHandlerMapCache = { };
  }

  /**
   * Starts listening to the EventStore
   * Returns observable that resolves to each subscribe aggregate/event
   *    emit value: { aggregateType, eventType, handlerName}
   */
  start$() {
    //default error handler
    const onErrorHandler = error => {
      ConsoleLogger.e("Error handling EventStore incoming event", error);
      process.exit(1);
    };
    //default onComplete handler
    const onCompleteHandler = () => {
      () => ConsoleLogger.e("EventStore incoming event subscription completed");
    };
    ConsoleLogger.i("EventStoreService starting ...");

    eventSourcing.configAggregateEventMap(this.aggregateTypeVsEventsVsConfig);

    return of(Object.keys(this.eventsProcessMap)).pipe(
      map((aggregateType) => this.subscribeEventHandler({ aggregateType, onErrorHandler, onCompleteHandler }))
    );
  }

  /**
   * Stops listening to the Event store
   * Returns observable that resolves to each unsubscribed subscription as string
   */
  stop$() {
    return from(this.subscriptions).pipe(
      map(subscription => {
        if(subscription?.subscription != null) subscription.subscription.unsubscribe();
        return `${instance.constructor.name}.stop$: Unsubscribed`;
      })
    );
  }

  /**
   * 
   * Create a subscrition to the event store and returns the subscription info     
   * @param {{ aggregateType: string, onErrorHandler, onCompleteHandler  }} params
   * @return { aggregateType  }
   */
  subscribeEventHandler({ aggregateType, onErrorHandler, onCompleteHandler }) {
    const subscription =
      //MANDATORY:  AVOIDS ACK REGISTRY DUPLICATIONS
      eventSourcing.ensureAcknowledgeRegistry$(aggregateType, mbeKey).pipe(
        mergeMap(() => eventSourcing.getEventListener$(aggregateType, mbeKey, false)),

        map(event => ({ event, handlers: this.getEventHandlers(event,aggregateType) })),
        //map(event => ({ event: event.data, acknowledgeMsg: event.acknowledgeMsg, handlers: this.eventsProcessMap[aggregateType][event.data.et] })),
        map(({ event, handlers }) => ({
          handlerObservables: handlers ? handlers
            //Check if the event should be processed only on sync
            .filter(({ processOnlyOnSync }) => !processOnlyOnSync)
            .map(({ fn, instance }) => fn.call(instance, event)) : null,
          event
        })),
        filter(({ event, handlerObservables }) => handlerObservables),
        mergeMap(({ event, handlerObservables }) =>
          // if there are not handlers for this event, we have to acknowledge the event on event store         
          iif(() => handlerObservables.length == 0,
            eventSourcing.acknowledgeEvent$(event, mbeKey),
            concat(
              forkJoin(...handlerObservables),
            ).pipe(
              concatMap(() =>
                //MANDATORY: ACKWOWLEDGE THIS EVENT WAS PROCESSED
                eventSourcing.acknowledgeEvent$(event, mbeKey)
              ),
              //If the message should be acknowledged after being processed,             
              // we execute the callback function            
              tap(() => {
                if (event.acknowledgeMsg) {
                  event.acknowledgeMsg();
                }
              })
            )
          )
        ),
      ).subscribe(
        ({ at, aid, et, av }) => {
          ConsoleLogger.d(`EventStoreService.subscribeEventHandler: at:${at}, et:${et}, aid:${aid}, av:${av}`);
        },
        onErrorHandler,
        onCompleteHandler
      );
    this.subscriptions.push({ aggregateType, subscription });
    return `EventStoreService.subscribeEventHandler: aggregateType:${aggregateType}`;
  }

  /**
  * Starts listening to the EventStore
  * Returns observable that resolves to each subscribe aggregate/event
  *    emit value: { aggregateType, eventType, handlerName}
  */
  syncState$() {
    // return from(Object.keys(this.eventsProcessMap)).pipe(      
    //   mergeMap(aggregateType => this.subscribeEventRetrieval$(aggregateType))
    // );
    return of("skinpping sync routing");
  }


  /**
   * Create a subscrition to the event store and returns the subscription info     
   * @param {{aggregateType, eventType, onErrorHandler, onCompleteHandler}} params
   * @return { aggregateType, eventType, handlerName  }
   */
  subscribeEventRetrieval$(aggregateType) {
    //MANDATORY:  AVOIDS ACK REGISTRY DUPLICATIONS
    return eventSourcing.ensureAcknowledgeRegistry$(aggregateType, mbeKey).pipe(
      mergeMap(() => eventSourcing.retrieveUnacknowledgedEvents$(aggregateType, mbeKey)),
      filter(event => this.eventsProcessMap[aggregateType][event.et]),
      map(event => ({ event, handlers: this.getEventHandlers(event,aggregateType) })),
      map(({ event, handlers }) => ({
        handlerObservables: handlers.map(({ fn, instance }) => fn.call(instance, { onSync: true, ...event })),
        event
      })),
      concatMap(({ event, handlerObservables }) =>
        forkJoin(...handlerObservables).pipe(
          first(evt => evt, event),
          mergeMap(() =>
            //MANDATORY:  ACKWOWLEDGE THIS EVENT WAS PROCESSED
            eventSourcing.acknowledgeEvent$(event, mbeKey))
        )
      ),
    );
  }


  /**
   * Joins all the event processors maps in the domain
   * @return {*} joined map -> { AGGREGATE_TYPE vs { EVENT_TYPE vs [ {fn: HANDLER_FN, instance: HANDLER_INSTANCE} ] } }
   */
  joinEventsProcessMap() {
    return eventSourcingProcessorMaps.reduce(
      (acc, eventSourcingProcessorMap) => {
        Object.keys(eventSourcingProcessorMap).forEach(AggregateType => {
          if (!acc[AggregateType]) { acc[AggregateType] = {} }
          Object.keys(eventSourcingProcessorMap[AggregateType]).forEach(EventType => {
            if (!acc[AggregateType][EventType]) { acc[AggregateType][EventType] = []; }
            acc[AggregateType][EventType].push(eventSourcingProcessorMap[AggregateType][EventType]);
          })
        })
        return acc;
      },
      {}
    );
  }

  /**
   * Joins all the aggregate vs event vs autoAck
   * @return {*} joined map -> { AGGREGATE_TYPE vs { EVENT_TYPE vs { AUTO ACK, ... } } }
   */
  joinAggregateTypeVsEventsVsConfigMap() {
    return eventSourcingProcessorMaps.reduce(
      (acc, eventSourcingProcessorMap) => {
        Object.keys(eventSourcingProcessorMap).forEach(AggregateType => {
          if (!acc[AggregateType]) { acc[AggregateType] = {} }
          Object.keys(eventSourcingProcessorMap[AggregateType]).forEach(EventType => {
            if (!acc[AggregateType][EventType]) {
              acc[AggregateType][EventType] = {};
            }
            //acc[AggregateType][EventType].push(eventSourcingProcessorMap[AggregateType][EventType]);
            const processOnlyOnSync = eventSourcingProcessorMaps.find(aggregate => {
              return (aggregate[AggregateType] && aggregate[AggregateType][EventType] && aggregate[AggregateType][EventType].processOnlyOnSync);
            });

            const { autoAck } = eventSourcingProcessorMap[AggregateType][EventType];
            acc[AggregateType][EventType] = { autoAck, processOnlyOnSync: processOnlyOnSync != null };
          })
        })
        return acc;
      },
      {}
    );
  }

  getEventHandlers(event,aggregateType){
    const key = `${event.at}_${event.et}`;
    let handlers = this.eventHandlerMapCache[key];
    if(handlers !== undefined ) return handlers;
    if(Array.isArray(aggregateType)){
      if(!aggregateType.includes(event.at) && !aggregateType.includes('$ALL')){
        this.eventHandlerMapCache[key] = null;
        return null;  
      }
    }else if(aggregateType !== event.at){
      this.eventHandlerMapCache[key] = null;
      return null;  
    }  
    handlers = [];
    if(this.eventsProcessMap[event.at] && this.eventsProcessMap[event.at][event.et]){
      handlers.push(...this.eventsProcessMap[event.at][event.et]);
    }
    if(this.eventsProcessMap[event.at] && this.eventsProcessMap[event.at].$ALL){
      handlers.push(...this.eventsProcessMap[event.at].$ALL);
    }
    if(this.eventsProcessMap.$ALL && this.eventsProcessMap.$ALL.$ALL){
      handlers.push(...this.eventsProcessMap.$ALL.$ALL);
    }
    this.eventHandlerMapCache[key] = handlers.length>0 ? handlers : null;
    return this.eventHandlerMapCache[key]; 
  }

}

/**
 * @returns {EventStoreService}
 */
module.exports = () => {
  if (!instance) {
    instance = new EventStoreService();
    ConsoleLogger.i(`${instance.constructor.name} Singleton created`);
  }
  return instance;
};

