import { Injectable } from '@angular/core';

import { KuiCoreModule } from '../../core.module';

import { Observable, of, Subject, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

interface CacheContent {
    expiry: number;
    value: any;
}


@Injectable({
    providedIn: KuiCoreModule
})
export class SimpleCacheService {

    private subject = new Subject<any>();

    sendData(data: any) {
        this.subject.next(data);
    }

    clearData() {
        this.subject.next();
    }

    getData(): Observable<any> {
        return this.subject.asObservable();
    }

}


@Injectable({
    providedIn: KuiCoreModule
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
    readonly DEFAULT_MAX_AGE: number = 300000;

    /**
     * Gets the value from cache if the key is provided.
     * If no value exists in cache, then check if the same call exists
     * in flight, if so return the subject. If not create a new
     * Subject inFlightObservable and return the source observable.
     */
    get(key: string, fallback?: Observable<any>, maxAge?: number): Observable<any> | Subject<any> {

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
                    this.set(key, value, maxAge);
                })
            );
        } else {
            return throwError('Requested key is not available in Cache');
        }

    }

    /**
     * Sets the value with key in the cache
     * Notifies all observers of the new value
     */
    set(key: string, value: any, maxAge: number = this.DEFAULT_MAX_AGE): void {
        this.cache.set(key, {value: value, expiry: Date.now() + maxAge});
        this.notifyInFlightObservers(key, value);
    }

    /**
     * Checks if the a key exists in cache
     */
    has(key: string): boolean {
        return this.cache.has(key);
    }

    /**
     * Publishes the value to all observers of the given
     * in progress observables if observers exist.
     */
    private notifyInFlightObservers(key: string, value: any): void {
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
     * Checks if the key exists and   has not expired.
     */
    private hasValidCachedValue(key: string): boolean {
        if (this.cache.has(key)) {
            if (this.cache.get(key).expiry < Date.now()) {
                this.cache.delete(key);
                return false;
            }
            return true;
        } else {
            return false;
        }
    }
}
