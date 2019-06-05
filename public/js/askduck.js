$(function() {
  $('#duck-dialog > div:not(#message-intro)').hide();

  var siriWave = new SiriWave({
    container: document.getElementById('siri-container'),
    width: 300,
    height: 150,
    color: '#fc0',
    frequency: 2,
    speed: 0.02
  });

  $('#message-intro button').click(function() {
    $('#message-intro').slideUp();
    $('#message-listening').slideDown();

    siriWave.start();

    $('#message-listening button').click(function() {
      siriWave.stop();

      $('#message-listening').slideUp();
      $('#message-thinking').slideDown();

      setTimeout(function() {
        $('#message-thinking').slideUp();
        $('#message-quack').slideDown();

        $('#message-quack button').click(function() {
          $('#message-quack').slideUp();
          $('#message-np').slideDown();

          $('#message-np button').click(function() {
            $('#message-np').slideUp();
            $('#message-i-know').slideDown();
          });
        });
      }, 4000);
    });
  });
});
