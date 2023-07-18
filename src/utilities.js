// utilities.js
// Points for fingers
const fingerJoints = {
    thumb: [0, 1, 2, 3, 4],
    indexFinger: [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger: [0, 13, 14, 15, 16],
    pinkyFinger: [0, 17, 18, 19, 20],
  };
  
  // Gauntlet style
  const style = {
    0: { color: 'red', size: 15 },
    1: { color: 'gold', size: 6 },
    2: { color: 'red', size: 10 },
    3: { color: 'gold', size: 6 },
    4: { color: 'red', size: 5 },
    5: { color: 'red', size: 10 },
    6: { color: 'gold', size: 6 },
    7: { color: 'gold', size: 6 },
    8: { color: 'red', size: 5 },
    9: { color: 'red', size: 10 },
    10: { color: 'gold', size: 6 },
    11: { color: 'gold', size: 6 },
    12: { color: 'red', size: 5 },
    13: { color: 'red', size: 10 },
    14: { color: 'gold', size: 6 },
    15: { color: 'gold', size: 6 },
    16: { color: 'red', size: 5 },
    17: { color: 'red', size: 10 },
    18: { color: 'gold', size: 6 },
    19: { color: 'gold', size: 6 },
    20: { color: 'red', size: 5 },
  };
  
  // Drawing function
  export const drawHand = (hand, ctx) => {
    const landmarks = hand.landmarks;
  
    // Draw fingers
    for (let finger in fingerJoints) {
      const fingerJointsIndices = fingerJoints[finger];
  
      for (let k = 0; k < fingerJointsIndices.length - 1; k++) {
        const firstJointIndex = fingerJointsIndices[k];
        const secondJointIndex = fingerJointsIndices[k + 1];
  
        const [x1, y1] = landmarks[firstJointIndex];
        const [x2, y2] = landmarks[secondJointIndex];
  
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'gold';
        ctx.lineWidth = 4;
        ctx.stroke();
      }
    }
  
    // Draw landmarks
    for (let i = 0; i < landmarks.length; i++) {
      const [x, y] = landmarks[i];
  
      ctx.beginPath();
      ctx.arc(x, y, style[i].size, 0, 2 * Math.PI);
      ctx.fillStyle = style[i].color;
      ctx.fill();
    }
  };
  