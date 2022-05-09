/* * */
/* * * * * */
/* PLAYER */
/* * */

/* * */
/* IMPORTS */
import React from 'react';
import lottie from 'lottie-web';

/* * */
/* PLAYER */
/* The player component is responsible for displaying Lottie animations */
/* given an animation JSON file. It also exposes many options, including speed */
/* and a callback function that is run when animations complete. */
class Player extends React.Component {
  // The element holding the animation
  container = null;

  // The lottie animation object
  animation = null;

  componentDidMount() {
    // Load animation properties
    this.animation = lottie.loadAnimation({
      container: this.container,
      renderer: 'svg',
      animationData: this.props.animationData,
      loop: this.props.loop === undefined ? true : this.props.loop,
      autoplay: this.props.autoplay === undefined ? true : this.props.autoplay,
      rendererSettings: {
        preserveAspectRatio: this.props.aspectRatio || '',
      },
    });

    // Set Animation speed
    if (this.props.speed) this.animation.setSpeed(this.props.speed);

    // When animation ends perform desired operation
    if (this.props.onComplete) this.animation.addEventListener('complete', this.props.onComplete);
  }

  render() {
    return (
      <div
        style={{
          height: this.props.height || 'auto',
          width: this.props.width || 'auto',
        }}
        ref={(ref) => (this.container = ref)}
      />
    );
  }
}

/* * */
export default Player;
