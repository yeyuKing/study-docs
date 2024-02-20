<template>
  <h1>this is demo component props is {{ title }}</h1> 
</template>

<script>
export default {
  name: "DemoComponent",
  props: {
    title: {
      type: String,
      default:()=>""
    }
  }
}
</script>