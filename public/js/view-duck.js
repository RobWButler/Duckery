$('document').ready(function() {
  const obj = document.createElement('audio');
  obj.src = '../sound/squeak.wav';
  obj.volume = 0.2;
  obj.autoPlay = false;
  obj.preLoad = true;
  obj.controls = true;

  //Plays squeeze animation and sound
  $('canvas').on('click', function() {
    squeeze();
    obj.play();
  });
});

//Squeeze the duck to perform an animation. Depresses and returns slightly slower, like rubber.
API.getDucks().then(function(data) {
  var id = $('canvas').attr('id') || '';
  var data = data[id];
  if (data.headgradient) {
    var gradresult = data.headgradient.split(',');
    headGradsrc.c1 = gradresult[0];
    headGradsrc.c2 = gradresult[1];
    $('canvas').setLayer('head', {
      // eslint-disable-next-line quotes
      fillStyle: headGrad
    });
  } else if (data.headpattern) {
    headPatsrc = data.headpattern;
    $('canvas').setLayer('head', {
      fillStyle: headPat
    });
  } else {
    $('canvas').setLayer('head', {
      fillStyle: data.head
    });
  }
  if (data.billpattern) {
    billPatsrc = data.billpattern;
    $('canvas').setLayer('bill', {
      fillStyle: billPat
    });
  } else {
    $('canvas').setLayer('bill', {
      fillStyle: data.bill
    });
  }

  if (data.bodygradient) {
    var gradresult = data.bodygradient.split(',');
    bodyGradsrc.c1 = gradresult[0];
    bodyGradsrc.c2 = gradresult[1];
    $('canvas').setLayer('body', {
      // eslint-disable-next-line quotes
      fillStyle: bodyGrad
    });
  } else if (data.bodypattern) {
    bodyPatsrc = data.bodypattern;
    $('canvas').setLayer('body', {
      fillStyle: bodyPat
    });
  } else {
    $('canvas').setLayer('body', {
      fillStyle: data.body
    });
  }

  if (data.hat) {
    hatsrc = data.hat;
    $('canvas').setLayer('hat', {
      source: data.hat
    });
    drawHat();
  }
  $('canvas').drawLayers();
});

function squeeze() {
  $('canvas').removeLayerGroup('tips');

  $('canvas')
    .animateLayerGroup(
      'duck',
      {
        scaleY: 0.8
      },
      80
    )
    .animateLayerGroup(
      'beziers',
      {
        scaleY: 0.8,
        y: +30
      },
      80
    )
    .animateLayerGroup(
      'accessory',
      {
        scaleY: 0.9
      },
      80
    )
    .animateLayerGroup(
      'duck',
      {
        scaleY: 1
      },
      120
    )
    .animateLayerGroup(
      'beziers',
      {
        scaleY: 1,
        y: 0
      },
      120
    )
    .animateLayerGroup(
      'accessory',
      {
        scaleY: 1
      },
      120
    )
    .drawImage({
      name: 'balloon',
      groups: ['tips'],
      layer: true,
      source: './duck/balloon.svg',
      x: 435,
      y: 90
    })
    .drawText({
      name: 'tip',
      groups: ['tips'],
      layer: true,
      fillStyle: '#000',
      fontStyle: 'bold',
      fontSize: '16pt',
      fontFamily: 'Comic Sans MS, cursive, sans-serif',
      text:
        'Quack! Use camelCase or snake_case! PascalCase is the tool of Satan!',
      x: 440,
      y: 90,
      maxWidth: 290
    });
  clearBalloon();
}

function clearBalloon() {
  var bclear = function() {
    $('canvas').removeLayer('balloon');
    $('canvas').drawLayers();
    $('canvas').animateLayerGroup(
      'tips',
      {
        fillStyle: 'rgb(255, 255, 255, 0)'
      },
      0
    );
  };
  setTimeout(bclear, 2000);
}
