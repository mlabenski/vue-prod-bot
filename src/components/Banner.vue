<template>
    <div class="jumbotron jumbotron-fluid">
        <div class="container">
            <h1  v-b-tooltip="'This is a Tooltip!'" class="display-4">Balance</h1>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Banner',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.display-4{
    text-align: center;
    text-emphasis: weight;
    font-weight: 700;
}

</style>
