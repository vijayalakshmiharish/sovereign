import { $ } from 'meteor/jquery';
import { timers } from '/lib/const';

// Calls

// Does specific animation
export const animate = function animate(node, animation, params) {
  var main = node;
  var standard = {
    duration: timers.ANIMATION_DURATION,
    loop: false
  };
  var settings = Object.assign(standard, params)
  switch(animation) {
  case 'hide-up':
    node
      .velocity("stop")
      .velocity({ translateY: '0px' }, settings)
      .velocity({ translateY: '-100px' }, settings)
      .velocity("stop");
    break;
  case 'show-down':
    node
      .velocity("stop")
      .velocity({'translateY': '-100px'}, settings)
      .velocity({'translateY': '0px'}, settings)
      .velocity("stop");
    break;
  case 'color-activate':
    node
      .velocity("stop")
      .velocity({'backgroundColor': '#ccc'}, settings)
      .velocity({'backgroundColor': '#00bf8f'}, settings)
      .velocity("stop");
    break;
  case 'color-deactivate':
      node
        .velocity("stop")
        .velocity({'backgroundColor': '#00bf8f'}, settings)
        .velocity({'backgroundColor': '#ccc'}, settings)
        .velocity("stop");
      break;
  case 'slide-right':
    node
      .velocity("stop")
      .velocity({'margin-left': '2px'}, settings)
      .velocity({'margin-left': '42px'}, settings)
      .velocity("stop");
    break;
  case 'slide-left':
    node
      .velocity("stop")
      .velocity({'margin-left': '42px'}, settings)
      .velocity({'margin-left': '2px'}, settings)
      .velocity("stop");
    break;
  case 'fade-in':
    node
      .velocity("stop")
      .velocity({'opacity': '0'}, settings)
      .velocity({'opacity': '1'}, settings)
      .velocity("stop");
    break;
  case 'tilt':
    node
      .velocity({'opacity': '0'}, settings)
      .velocity("reverse");
    break;
  }
};

// Attaches animation to reactive behaviour
export const behave = function behave(node, animation, params, hook) {
  var main = node;
  var standard = {
    duration: timers.ANIMATION_DURATION,
    loop: false
  };
  var settings = Object.assign(standard, params);

  if (hook != undefined) {
    main.parentNode._uihooks = hook;
  }

  if (main.parentNode != null) {
    if (main.parentNode._uihooks == undefined) {
      switch (animation) {
      case 'fade':
        if (hook == undefined) { main.parentNode._uihooks = fadeTag; }
        fadeIn(main, main.nextSibling);
        break;
      case 'fade-and-roll':
        if (params != undefined) {
          aniFinish['height'] = settings['height'];
        }
        if (hook === undefined) {
          main.parentNode._uihooks = fadeLabel;
        }
        fadeInRolldown(main, main.nextSibling);
        break;
      default:
      }
    }
  }
};

//**********
//UI Hooks
//**********

const fadeLabel = {
  insertElement: function(node, next) {
    fadeInRolldown(node,next);
    Deps.afterFlush(function() {
      $(node).width();
      $(node).removeClass('off-screen');
    });
  },
  moveElement: function(node, next) {
    fadeLabel.removeElement(node);
    fadeLabel.insertElement(node, next);
  },
  removeElement: function(node) {
    fadeOutRollup(node);
  }
};

const fadeTag = {
  insertElement: function(node, next) {
    fadeIn(node,next);
    Deps.afterFlush(function() {
      $(node).width();
      $(node).removeClass('off-screen');
    });
  },
  moveElement: function(node, next) {
    fadeTag.removeElement(node);
    fadeTag.insertElement(node, next);
  },
  removeElement: function(node) {
    fadeOut(node);
  }
};

//**********
//States
//**********


const aniInitial = {
  opacity: '0',
  // overflow: 'hidden',
  height: '0px',
};
const aniFinish = {
  opacity: '1',
  height: '36px',
};
const aniExit = {
  opacity: '0',
  height: '0px',
};

// **
// Animations
// **

function fadeInRolldown(node, next) {
  $(node).addClass('off-screen');
  $(node).css(aniInitial);
  $(node).insertBefore(next);
  $(node).velocity(aniFinish, {
    duration: timers.ANIMATION_DURATION,
    queue: false,
  });
}

function fadeOutRollup(node) {
  $(node)
    .velocity(aniExit, {
      duration: timers.ANIMATION_DURATION,
      queue: false,
      complete() {
        $(node).remove();
      },
    });
}

function fadeIn(node, next) {
  $(node).addClass('off-screen');
  $(node).css('opacity: 0px');
  $(node).insertBefore(next);
  $(node).velocity({ opacity: '1' }, {
    duration: timers.ANIMATION_DURATION,
    queue: false,
  });
}

function fadeOut(node) {
  $(node)
    .velocity({ opacity: '0' }, {
      duration: timers.ANIMATION_DURATION,
      queue: false,
      complete() {
        $(node).remove();
      },
    });
}

export const animationSettings = {
  duration: timers.ANIMATION_DURATION,
  loop: false,
};
