<template lang='jade'>
  .patient-search.py2.px3
      input.pl2.w10.ce5.c9.input-patient.box-sizing(placeholder="搜索患者" v-model='searchKey')
</template>
<script>
export default {
	data	()	{
		return {
			searchKey: ''
		}
	},
	watch: {
		'searchKey' (val) {
			if (val.length > 1) {
				this.$emit('searchVal', val)
			} else {
				return false
			}
		}
	}
}
</script>
<style lang='stylus' scoped>
.ce5
	background-color  #e5e5e5
.c9
	color #999999
.patient-search
	input
		border-radius 20px
		height 25px
		line-height 25px
</style>