<template>
<div>
  <div class="slider">
    <div class="line"></div>
    <div class="subline inc"></div>
    <div class="subline dec"></div>
  </div>
</div>
</template>

<script>
  export default {
    name: 'LoadingBar'
  }
</script>

<style scoped>
  .slider{
    position:absolute;
    width:100%;
    height:5px;
    overflow-x: hidden;
  }

  .line{
    position:absolute;
    opacity: 0.4;
    background: #e3a078;
    width:150%;
    height:4px;
  }

  .subline{
    position:absolute;
    background: #e5a179;
    height:4px;
  }
  .inc{
    animation: increase 2s infinite;
  }
  .dec{
    animation: decrease 2s 0.5s infinite;
  }

  @keyframes increase {
    from { left: -5%; width: 5%; }
    to { left: 130%; width: 100%;}
  }
  @keyframes decrease {
    from { left: -80%; width: 80%; }
    to { left: 110%; width: 10%;}
  }
</style>
