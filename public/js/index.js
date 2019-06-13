// The API object contains methods for each kind of request we'll make
var API = {
  saveDuck: function(duck) {
    return $.ajax({
      headers: {
        'Content-Type': 'application/json'
      },
      type: 'POST',
      url: '/api/ducks',
      data: JSON.stringify(duck)
    });
  },
  getDucks: function() {
    return $.ajax({
      url: '/api/ducks',
      type: 'GET'
    });
  },
  deleteExample: function(id) {
    return $.ajax({
      url: 'api/ducks/' + id,
      type: 'DELETE'
    });
  }
};

//Check if the fillStyle is a function (so the parameters for the function can be passed)
//or a solid color (so the hex value can be passed)
function funcStyleCheck(toCheck, checkLayer) {
  console.log(toCheck);
  if (typeof toCheck === 'function') {
    if (toCheck === headGrad || toCheck === bodyGrad) {
      return 'grad';
    } else if (
      toCheck === headPat ||
      toCheck === billPat ||
      toCheck === bodyPat
    ) {
      return 'pat';
    }
  } else {
    return $('canvas').getLayer(checkLayer).fillStyle;
  }
}

// handleFormSubmit is called whenever we submit a new Duck
// Save the new Duck to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var $head = funcStyleCheck($('canvas').getLayer('head').fillStyle, 'head');
  var $bill = funcStyleCheck($('canvas').getLayer('bill').fillStyle, 'bill');
  var $body = funcStyleCheck($('canvas').getLayer('body').fillStyle, 'body');
  if (hatOn) {
    var $hat = hatsrc;
  }
  if (headGradientOn) {
    var $headgradient = headGradsrc.c1 + ',' + headGradsrc.c2;
  }
  if (headPatternOn) {
    var $headpattern = headPatsrc.replace('.duck/patterns/', '');
  }
  if (billPatternOn) {
    var $billpattern = billPatsrc.replace('.duck/patterns/', '');
  }
  if (bodyGradientOn) {
    var $bodygradient = bodyGradsrc.c1 + ',' + bodyGradsrc.c2;
  }
  if (bodyPatternOn) {
    var $bodypattern = bodyPatsrc.replace('.duck/patterns/', '');
  }

  var duck = {
    head: $head,
    bill: $bill,
    body: $body,
    hat: $hat,
    headgradient: $headgradient,
    headpattern: $headpattern,
    billpattern: $billpattern,
    bodygradient: $bodygradient,
    bodypattern: $bodypattern
  };

  API.saveDuck(duck).then(function() {
    //refreshExamples();
  });
};

// Add event listeners to the submit and delete buttons
$('#submit').on('click', handleFormSubmit);
$('#submit').on('click', function() {
  alert('Your duck has been created!');
  location.reload();
});
