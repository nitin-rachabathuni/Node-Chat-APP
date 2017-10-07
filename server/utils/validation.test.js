const expect = require('expect');

const {isRealString} =require('./validation');

describe('isRealString', () =>{
  
  it('should reject non String values', () => {
    var res = isRealString(00);
    expect(res).toBe(false);
  });

  it('should reject string with only spaces', () => {
    var res = isRealString('   ');
    expect(res).toBe(false);
  });

});
