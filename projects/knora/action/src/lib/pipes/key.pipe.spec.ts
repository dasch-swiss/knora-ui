import { KeyPipe } from './key.pipe';

describe('KeyPipe', () => {

  let pipe: KeyPipe;
  const data = [{ title: 'Euler to Goldbach, October 13th (24th), 1729' }, { repoNumber: 715 }, { language: 'latin' }];

  beforeEach(() => {
    pipe = new KeyPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the keys', () => {
    expect(pipe.transform(data)).toEqual([
      { key: '0', value: Object({ title: 'Euler to Goldbach, October 13th (24th), 1729' }) },
      { key: '1', value: Object({ repoNumber: 715 }) },
      { key: '2', value: Object({ language: 'latin' }) }
    ]);
  });
});
