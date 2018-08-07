import { Injectable } from '@angular/core';
import { Observable, of, Subject, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CurrentUser } from '../../declarations';
import { OntologyMetadata, Properties, ResourceClasses, ResourceClassIrisForOntology } from '../v2/ontology-cache.service';

interface CacheContent {
    expiry: number;
    value: any;
}


/**
 * Represents cached ontology information (only used by this service internally).
 */
class AuthenticationCache {

    /**
     * a session id
     */
    session: string;

    /**
     * the current user object
     */
    user: CurrentUser;


    constructor() {
        this.session = '';

        this.user = new CurrentUser();
    }
}

@Injectable({
    providedIn: 'root'
})

/**
 * Cache Service is an observables based in-memory cache implementation
 * Keeps track of in-flight observables and sets a default expiry for cached values
 * @export
 * @class AuthenticationCacheService
 */
export class AuthenticationCacheService {

    private cache: Map<string, CacheContent> = new Map<string, CacheContent>();
    private inFlightObservables: Map<string, Subject<any>> = new Map<string, Subject<any>>();
    readonly DEFAULT_MAX_AGE: number = 86400;  // = (24h = 24 * 60 * 60)


    private subject = new Subject<any>();

    getData(): Observable<any> {
        console.log('get Data from Cache', this.subject);
        return this.subject.asObservable();
    }

    setData(data: any) {
        console.log('store Data in Cache', data);
        this.subject.next(data);
    }

    clearData() {
        this.subject.next();
    }



    /**
     * Gets the value from cache if the key is provided.
     * If no value exists in cache, then check if the same call exists
     * in flight, if so return the subject. If not create a new
     * Subject inFlightObservable and return the source observable.
     */
    get(key: string, fallback?: Observable<any>, maxAge?: number): Observable<any> | Subject<any> {

        // key is an own defined key by the module; or do we really need it?
        // fallback could be the /v2/authentication request
        if (!fallback) {
//            fallback = this.authenticate();
        }

        if (this.hasValidCachedValue(key)) {
            console.log(`%cGetting from cache ${key}`, 'color: green');
            return of(this.cache.get(key).value);
        }

        if (!maxAge) {
            maxAge = this.DEFAULT_MAX_AGE;
        }

        if (this.inFlightObservables.has(key)) {
            return this.inFlightObservables.get(key);
        } else if (fallback) {
            this.inFlightObservables.set(key, new Subject());
            console.log(`%c Calling api for ${key}`, 'color: purple');
            return fallback.pipe(
                tap((value) => {
                    console.log('fallback', value);
                    this.set(key, value, maxAge);
                })
            );
        } else {
            return throwError('Requested key \'' + key + '\' is not available in Cache');
        }

    }

    /**
     * Sets the value with key in the cache
     * Notifies all observers of the new value
     */
    set(key: string, value: any, maxAge: number = this.DEFAULT_MAX_AGE): void {
        const now = Math.floor(Date.now() / 1000);

        console.log('now', Math.floor(Date.now() / 1000));
        console.log('expire', now + maxAge);
        this.cache.set(key, {value: value, expiry: now + maxAge});

//        this.inFlightObservables.set(key, new Subject());

        this.notifyInFlightObservers(key, value);
    }

    /**
     * Checks if a key exists in cache
     */
    has(key: string): boolean {
        return this.cache.has(key);
    }

    /**
     * Publishes the value to all observers of the given
     * in progress observables if observers exist.
     */
    private notifyInFlightObservers(key: string, value: any): void {

        console.log('notifyInFlightObservers', key, value);
        console.log('this.inFlightObservables', this.inFlightObservables);

        if (this.inFlightObservables.has(key)) {
            const inFlight = this.inFlightObservables.get(key);
            const observersCount = inFlight.observers.length;
            if (observersCount) {
                console.log(`%cNotifying ${inFlight.observers.length} flight subscribers for ${key}`, 'color: blue');
                inFlight.next(value);
            }
            inFlight.complete();
            this.inFlightObservables.delete(key);
        }
    }

    /**
     * Checks if the key exists and has not expired.
     */
    private hasValidCachedValue(key: string): boolean {

        if (this.cache.has(key)) {

            console.log(this.cache.get(key));

            if (this.cache.get(key).expiry < Date.now()) {
                this.cache.delete(key);
                return false;
            }
            return true;
        } else {
            return false;
        }
    }

    getJwt(): string {
        return localStorage.getItem('token');
    }

}
