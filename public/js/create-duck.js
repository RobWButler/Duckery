$(document).ready(function() {
  // eslint-disable-next-line no-unused-vars
  var headGradientOn = false;
  // eslint-disable-next-line no-unused-vars
  var bodyGradientOn = false;
  // eslint-disable-next-line no-unused-vars
  var headPatternOn = false;
  // eslint-disable-next-line no-unused-vars
  var billPatternOn = false;
  // eslint-disable-next-line no-unused-vars
  var bodyPatternOn = false;

  $('#download').on('click', function() {
    console.log('Download');
    var thumbimg = $('canvas').getCanvasImage();
    $('#downloadurl').attr('src', thumbimg);
  });

  $('#addhat').on('click', function() {
    hatButton();
  });

  var hatOn = false;

  var headGradsrc = {
    c1: '',
    c2: ''
  };

  var bodyGradsrc = {
    c1: '',
    c2: ''
  };

  var headGrad = function(layer) {
    return $(this).createGradient({
      // Gradient is drawn relative to layer position
      x1: 0,
      y1: layer.y - layer.height,
      x2: 0,
      y2: layer.y + layer.height,
      c1: headGradsrc.c1,
      c2: headGradsrc.c2
    });
  };

  // eslint-disable-next-line no-unused-vars
  var bodyGrad = function(layer) {
    return $(this).createGradient({
      // Gradient is drawn relative to layer position
      x1: 0,
      y1: layer.y - layer.height,
      x2: 0,
      y2: layer.y + layer.height,
      c1: bodyGradsrc.c1,
      c2: bodyGradsrc.c2
    });
  };
  var headPatsrc = '';
  var billPatsrc = '';
  var bodyPatsrc = '';
  // eslint-disable-next-line no-unused-vars
  const headPat = function(layer) {
    return $(this).createPattern({
      source: '../duck/patterns/' + headPatsrc,
      repeat: 'repeat'
    });
  };
  // eslint-disable-next-line no-unused-vars
  const billPat = function(layer) {
    return $(this).createPattern({
      source: '../duck/patterns/' + billPatsrc,
      repeat: 'repeat'
    });
  };
  // eslint-disable-next-line no-unused-vars
  const bodyPat = function(layer) {
    return $(this).createPattern({
      source: '../duck/patterns/' + bodyPatsrc,
      repeat: 'repeat'
    });
  };

  var colGradPat = {
    head: {
      color: '#ffff00',
      pattern: headPat,
      gradient: headGrad
    },
    body: {
      color: '#ffff00',
      pattern: bodyPat,
      gradient: bodyGrad
    },
    bill: {
      color: '#ffa500',
      pattern: billPat
    }
  };

  function drawBody() {
    $('canvas').removeLayerGroup('body');

    $('canvas')
      .drawEllipse({
        layer: true,
        name: 'body',
        groups: ['body', 'duck'],
        index: 0,
        strokeStyle: '#000',
        strokeWidth: 3,
        fillStyle: colGradPat.body.color,
        shadowColor: 'rgb(0, 0, 0, 0.5)',
        shadowBlur: 15,
        shadowX: 4,
        shadowY: 10,
        x: 210,
        y: 230,
        width: 200,
        height: 150
      })
      .drawBezier({
        layer: true,
        name: 'wing',
        groups: ['body', 'beziers'],
        index: 1,
        strokeStyle: 'rgb(0,0,0, 0.5)',
        fillStyle: 'rgb(0,0,0, 0.04)',
        strokeWidth: 3,
        x1: 205,
        y1: 280,
        cx1: 225,
        cy1: 310,
        cx2: 375,
        cy2: 210,
        x2: 205,
        y2: 240
      });
  }

  function drawHead() {
    $('canvas').removeLayerGroup('head');

    $('canvas')
      .drawEllipse({
        layer: true,
        name: 'head',
        groups: ['head', 'duck'],
        index: 3,
        strokeStyle: '#000',
        strokeWidth: 3,
        fillStyle: colGradPat.head.color,
        shadowColor: 'rgb(0, 0, 0, 0.3)',
        shadowBlur: 15,
        shadowX: 0,
        shadowY: 5,
        x: 160,
        y: 150,
        width: 120,
        height: 120
      })
      .drawEllipse({
        layer: true,
        name: 'lefteye',
        groups: ['head', 'duck'],
        index: 9,
        strokeStyle: 'black',
        strokeWidth: 5,
        fillStyle: 'white',
        x: 110,
        y: 140,
        width: 14,
        height: 18
      })
      .drawEllipse({
        layer: true,
        name: 'righteye',
        groups: ['head', 'duck'],
        index: 9,
        strokeStyle: 'black',
        strokeWidth: 5,
        fillStyle: 'white',
        x: 170,
        y: 140,
        width: 14,
        height: 18
      });
  }

  function drawBill() {
    $('canvas').removeLayer('bill');

    $('canvas').drawPath({
      layer: true,
      name: 'bill',
      groups: ['beziers'],
      index: 4,
      strokeStyle: '#000',
      strokeWidth: 3,
      fillStyle: colGradPat.bill.color,
      shadowColor: 'rgb(0, 0, 0, 0.2)',
      shadowBlur: 15,
      shadowX: 0,
      shadowY: 3,
      p1: {
        type: 'bezier',
        x1: 115,
        y1: 160, // Start point
        cx1: 155,
        cy1: 100, // Control point
        cx2: 140,
        cy2: 160, // Control point
        x2: 175,
        y2: 160 // Start/end point
      },
      p2: {
        type: 'bezier',
        x1: 115,
        y1: 160,
        cx1: 50,
        cy1: 190,
        cx2: 95,
        cy2: 220,
        x2: 175,
        y2: 160
      }
    });
  }

  function drawDuck() {
    drawBody();
    drawHead();
    drawBill();
    if (hatOn) {
      drawHat();
    }
  }
  var hatsrc = 'l3helmet.svg';
  function drawHat() {
    $('canvas').removeLayer('hat');
    $('canvas').drawImage({
      name: 'hat',
      groups: ['duck'],
      imageSmoothing: true,
      layer: true,
      index: 10,
      load: $('canvas').drawLayers(),
      shadowColor: 'rgb(0, 0, 0, 0.3)',
      shadowBlur: 15,
      shadowX: 0,
      shadowY: 5,
      source: '../duck/accessories/' + hatsrc,
      x: 200,
      y: 200
    });
  }

  drawDuck();

  function changeStyle(varlayer, style, val) {
    style = val;
    $('canvas').setLayer(varlayer, {
      fillStyle: style
    });
    if (hatOn) {
      drawHat();
    }
    $('canvas').drawLayers();
  }

  // Apply Color Functions
  $('#head_color').change(function() {
    changeStyle('head', colGradPat.head.color, $('#head_color').val());
    headPatternOn = false;
    headGradientOn = false;
  });

  $('#bill_color').change(function() {
    changeStyle('bill', colGradPat.bill.color, $('#bill_color').val());
    billPatternOn = false;
  });

  $('#body_color').change(function() {
    changeStyle('body', colGradPat.body.color, $('#body_color').val());
    bodyPatternOn = false;
    bodyGradientOn = false;
  });

  // Apply Gradient Functions
  $('#grad_head').on('click', function() {
    headGradsrc.c1 = $('#head_c1_color').val();
    headGradsrc.c2 = $('#head_c2_color').val();
    changeStyle('head', colGradPat.head.gradient, colGradPat.head.gradient);
    headGradientOn = true;
    headPatternOn = false;
  });

  $('#grad_body').on('click', function() {
    bodyGradsrc.c1 = $('#body_c1_color').val();
    bodyGradsrc.c2 = $('#body_c2_color').val();
    changeStyle('body', colGradPat.body.gradient, colGradPat.body.gradient);
    bodyGradientOn = true;
    bodyPatternOn = false;
  });

  // Apply Pattern Functions
  $('.head-pat').on('click', function() {
    $('#showheadPat').attr('src', $(this).attr('src'));
    headPatsrc = $(this)
      .attr('src')
      .replace('./duck/patterns/', '');
    changeStyle('head', colGradPat.head.pattern, colGradPat.head.pattern);
    headGradientOn = false;
    headPatternOn = true;
  });
  $('.bill-pat').on('click', function() {
    $('#showbillPat').attr('src', $(this).attr('src'));
    billPatsrc = $(this)
      .attr('src')
      .replace('./duck/patterns/', '');
    changeStyle('bill', colGradPat.bill.pattern, colGradPat.bill.pattern);
    billPatternOn = true;
  });
  $('.body-pat').on('click', function() {
    $('#showbodyPat').attr('src', $(this).attr('src'));
    bodyPatsrc = $(this)
      .attr('src')
      .replace('./duck/patterns/', '');
    changeStyle('body', colGradPat.body.pattern, colGradPat.body.pattern);
    bodyGradientOn = false;
    bodyPatternOn = true;
  });

  $('.accessory').on('click', function() {
    $('#showaccessory').attr('src', $(this).attr('src'));
    hatsrc = $(this)
      .attr('src')
      .replace('./duck/accessories/', '');
    hatOn = true;
    drawHat();
  });

  $('.nohat').on('click', function() {
    $('canvas').removeLayer('hat');
    $('canvas').drawLayers();
    hatOn = false;
  });
});
