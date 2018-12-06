import { async, TestBed } from '@angular/core/testing';
import { ReversePipe } from './reverse.pipe';

describe('ReversePipe', () => {

  let pipe: ReversePipe;
  const data = ['Bernouilli', 'Euler', 'Goldbach', 'Hermann'];

  beforeEach(() => {
    pipe = new ReversePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should slice and reverse data', () => {
    expect(pipe.transform(data)).toEqual(['Hermann', 'Goldbach', 'Euler', 'Bernouilli']);
  });
});
