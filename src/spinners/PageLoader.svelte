<div>
  <span />
  <span />
  <span />
  <span />
</div>

<style>
  div {
    position: absolute;
    width: 30px;
    height: 30px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }

  div span {
    width: 30px;
    height: 30px;
    position: absolute;
  }

  div span:nth-child(1) {
    background: rgb(187, 217, 140);
    top: 0;
    left: 0;
    z-index: 1;
    animation: item-1_move 1.8s cubic-bezier(0.6, 0.01, 0.4, 1) infinite;
  }

  div span:nth-child(2) {
    background: rgb(140, 142, 217);
    top: 0;
    right: 0;
    animation: item-2_move 1.8s cubic-bezier(0.6, 0.01, 0.4, 0.3) infinite;
  }

  div span:nth-child(3) {
    background: rgb(192, 92, 88);
    bottom: 0;
    right: 0;
    z-index: 1;
    animation: item-3_move 1.8s cubic-bezier(0.6, 0.01, 0.4, 1) infinite;
  }

  div span:nth-child(4) {
    background: rgb(194, 157, 110);
    bottom: 0;
    left: 0;
    animation: item-4_move 1.8s cubic-bezier(0.6, 0.01, 0.4, 0.3) infinite;
  }

  @keyframes item-1_move {
    0%,
    100% {
      transform: translate(0, 0);
    }
    25% {
      transform: translate(0, 20px);
    }
    50% {
      transform: translate(10px, 10px);
    }
    75% {
      transform: translate(10px, 0);
    }
  }

  @keyframes item-2_move {
    0%,
    100% {
      transform: translate(0, 0);
    }
    25% {
      transform: translate(-15px, 0);
    }
    50% {
      transform: translate(-10px, 10px);
    }
    75% {
      transform: translate(0, 10px);
    }
  }

  @keyframes item-3_move {
    0%,
    100% {
      transform: translate(0, 0);
    }
    25% {
      transform: translate(0, -30px);
    }
    50% {
      transform: translate(-10px, -10px);
    }
    75% {
      transform: translate(-10px, 0);
    }
  }

  @keyframes item-4_move {
    0%,
    100% {
      transform: translate(0, 0);
    }
    25% {
      transform: translate(5px, 0);
    }
    50% {
      transform: translate(10px, -10px);
    }
    75% {
      transform: translate(0, -15px);
    }
  }
</style>
