var socket = io();

socket.on('connect', function() {
  console.log(`Connected to Server`);
});

socket.on('disconnect', function() {
  console.log(`Disconnected from Server`);
});

socket.on('newMessage', function(message) {
  console.log('New Message:', message);
  var li = jQuery('<li></li>');
  li.text(`${message.from}:  ${message.text}`);
  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();
  var messageTextBox = jQuery('[name=message]');
  socket.emit(
    'createMessage',
    {
      from: 'User',
      text: messageTextBox.val()
    },
    function() {
      messageTextBox.val('');
    }
  );
});
