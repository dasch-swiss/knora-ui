import { StringifyStringLiteralPipe } from './stringify-string-literal.pipe';

describe('StringifyStringLiteralPipe', () => {
  it('create an instance', () => {
    const pipe = new StringifyStringLiteralPipe();
    expect(pipe).toBeTruthy();
  });
});
