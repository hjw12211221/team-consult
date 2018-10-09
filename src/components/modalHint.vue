<template lang="jade">
	.modalHint.mask(
		v-if='isShow'
		style="background-color:rgba(0,0,0,0.4)"
	)
		.contentText.bg-white.rounder(style="width:auto;")
			.mx4.p2.round-min {{content}}
</template>

<script>
export default {
	data () {
		return {
		}
	},
	computed: {
		isShow () {
			return this.$store.state.isShow
		},
		content () {
			return this.$store.state.content
		}
	}
}
</script>
