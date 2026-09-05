<template>
    <div class="team-card">
        <img :src="team.image" :alt="team.name"/>
        <h2>{{ team.name }}</h2>
        <p>{{ team.city }} · {{ team.conference }}</p>
    </div>
</template>
<script setup>
defineProps({
    team: {
        type: Object,
        required: true
    }
});
</script>
<style scoped>
.team-card {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
}
.team-card img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 4px;

}
</style>