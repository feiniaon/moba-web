<template>
  <div class="page-article" v-if="model">
    <div class="d-flex py-3 px-2 border-bottom">
      <div class="iconfont icon-fanhui text-blue"></div>
      <strong class="flex-1 text-blue pl-2">{{model.title}}</strong>
      <div class="text-grey fs-xs">2020-09-05</div>
    </div>
    <div v-html="model.body" class="px-3 body fs-lg"></div>
    <div class="px-3 border-top py-3">
      <div class="d-flex ai-center">
        <i class="iconfont icon-lianjie"></i>
        <strong class="text-blue">相关资讯</strong>
      </div>
      <div class="pt-2">
        <router-link 
        class="py-2"
        tag="div" 
        v-for="item in model.related" 
        :to="`/articles/${item._id}`"
        :key="item._id"
        >{{item.title}}</router-link>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    id: { required: true },
  },
  data() {
    return {
      model: null,
    };
  },
  watch:{
    id: 'fetch',
    // id(){
    //   this.fetch()
    // }
  },
  methods: {
    async fetch() {
      const res = await this.$http.get(`articles/${this.id}`);
      this.model = res.data;
    },
  },
  created() {
    this.fetch();
  },
};
</script>

<style lang="scss">
.page-article {
  .body {
    img {
      max-width: 100%;
      height: auto;
    }
  }
}
</style>