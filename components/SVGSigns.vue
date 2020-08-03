<template>
  <svg class="sign" width="270px" height="30px" xmlns="http://www.w3.org/2000/svg">
    <!-- Positive -->
      <g class="force">
        <path d="M20,20L25,30L30,20z" stroke="none" />
        <path d="M25,20v-20" stroke-width="2" />
      </g>
      <g class="moment">
        <path d="M 10,0L20,5L10,10z" stroke="none" />
        <path d="M 15 5 A 10 10 1 1 0 15 25" stroke-width="2" fill="none" />
      </g>

      <g class="support">
        <path d="M 70 15 A 70 70 0 0 1 30 15" stroke-width="2" fill="none" />
      </g>

      <text x="50" y="15" text-anchor="middle">+</text>

      <g class="force">
        <path d="M70,10L75,0L80,10z" stroke="none" />
        <path d="M75,10v20" stroke-width="2" />
      </g>
      <g class="moment">
        <path d="M90,0L80,5L90,10z" stroke="none" />
        <path d="M 85 5 A 10 10 0 0 1 85 25" stroke-width="2" fill="none" />
      </g>
    <!-- Positive -->
    
    <!-- Negative -->
      <g class="force">
        <path d="M140,10L145,0L150,10z" stroke="none" />
        <path d="M145,10v20" stroke-width="2" />
      </g>
      <g class="moment">
        <path d="M 130,20L140,25L130,30z" stroke="none" />
        <path d="M 135 5 A 10 10 1 1 0 135 25" stroke-width="2" fill="none" />
      </g>

      <g class="support">
        <path d="M 150 15 A 70 70 0 0 1 190 15" stroke-width="2" fill="none" />
      </g>

      <text x="170" y="30" text-anchor="middle" font-size="1.5em">-</text>

      <g class="force">
        <path d="M190,20L195,30L200,20z" stroke="none" />
        <path d="M195,20v-20" stroke-width="2" />
      </g>
      <g class="moment">
        <path d="M210,20L200,25L210,30z" stroke="none" />
        <path d="M 205 5 A 10 10 0 0 1 205 25" stroke-width="2" fill="none" />
      </g>
    <!-- Negative -->
  </svg>
</template>

<script>
  export default {
  }
</script>