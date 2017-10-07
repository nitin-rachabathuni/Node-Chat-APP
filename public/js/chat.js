var socket = io();

function scrollToBottom() {
  // selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');
  // heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function() {
  var params = jQuery.deparam(window.location.search);
  socket.emit('join', params, function(error) {
    if (error) {
      alert(error);
      window.location.href = '/';
    } else {
    }
  });
});

socket.on('disconnect', function() {
  console.log(`Disconnected from Server`);
});

socket.on('updateUserList', function(users) {
  var ol = jQuery('<ol></ol>');
  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user))
  });
  jQuery('#users').html(ol);
});

socket.on('newMessage', function(message) {
  var formatedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formatedTime
  });
  //var li = jQuery('<li></li>');
  //li.text(`${message.from}:  ${message.text}`);
  jQuery('#messages').append(html);
  scrollToBottom();
});

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();
  var messageTextBox = jQuery('[name=message]');
  socket.emit(
    'createMessage',
    {
      text: messageTextBox.val()
    },
    function() {
      messageTextBox.val('');
    }
  );
});
