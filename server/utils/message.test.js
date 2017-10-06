var expect = require('expect');
var { generateMessage } = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var from = 'Nitin';
    var text = 'Some Message';
    var message = generateMessage(from, text);
    //expect(message.createdAt).toBe(number);
    expect(message.from).toBe(from);
    expect(message.text).toBe(text);
    console.log();
  });
});
