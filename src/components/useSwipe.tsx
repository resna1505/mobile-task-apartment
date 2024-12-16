import {Dimensions} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export function useSwipe(
  onSwipeLeft?: any,
  onSwipeRight?: any,
  onSwipeUp?: any,
  onSwipeDown?: any,
  rangeOffset = 4,
) {
  let firstTouch = 0;

  // set user touch start position
  function onTouchStart(e: any) {
    firstTouch = e.nativeEvent.pageX;
  }

  // when touch ends check for swipe directions
  function onTouchEnd(e: any) {
    // get touch position and screen size
    const positionX = e.nativeEvent.pageX;
    const positionY = e.nativeEvent.pageY;
    const range = windowWidth / rangeOffset;
    const rangeX = windowHeight / rangeOffset;

    // check if position is growing positively and has reached specified range
    if (positionX - firstTouch > range) {
      onSwipeRight && onSwipeRight();
    }
    // check if position is growing negatively and has reached specified range
    else if (firstTouch - positionX > range) {
      onSwipeLeft && onSwipeLeft();
    } else if (positionX - firstTouch < rangeX) {
      onSwipeUp && onSwipeUp();
    //   console.log('check bottom', positionX - firstTouch, rangeX);
    } else if (firstTouch + positionX < rangeX) {
    //   console.log('asiik');
      onSwipeDown && onSwipeDown();
    }
  }

//   let startingX, startingY, movingX, movingY;
//   function touchStart(evt) {
//     startingX = evt.touches[0].clientX;
//     startingY = evt.touches[0].clientY;
//   }
//   function touchMove(evt) {
//     movingX = evt.touches[0].clientX;
//     movingY = evt.touches[0].clientY;
//   }
//   function touchEnd() {
//     if (startingX + 100 < movingX) {
//       console.log('right');
//     } else if (startingX - 100 > movingX) {
//       console.log('left');
//     }

//     if (startingY + 100 < movingY) {
//       console.log('down');
//     } else if (startingY - 100 > movingY) {
//       console.log('up');
//     }
//   }

  return {onTouchStart, onTouchEnd};
}
