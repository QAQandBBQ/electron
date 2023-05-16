export default defineComponent({
  setup() {
    const textareaVal = ref("");
    const handleOk = () => {
      if (window.preload) {
        window.preload.save(textareaVal.value);
      }
    };
    return () => (
      <div class="p-10">
        <textarea
          class="display-block w-100% h-200px mb-30"
          placeholder="请输入文本内容"
          v-model={textareaVal.value}
        ></textarea>
        <div class="btn" onClick={handleOk}>
          保存
        </div>
      </div>
    );
  },
});

// <!-- <script setup lang="ts">
// // https://github.com/vueuse/head
// // you can use this to manipulate the document head in any components,
// // they will be rendered correctly in the html results with vite-ssg
// useHead({
//   title: 'Vitesse',
//   meta: [
//     { name: 'description', content: 'Opinionated Vite Starter Template' },
//     {
//       name: 'theme-color',
//       content: () => isDark.value ? '#00aba9' : '#ffffff',
//     },
//   ],
//   link: [
//     {
//       rel: 'icon',
//       type: 'image/svg+xml',
//       href: () => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg',
//     },
//   ],
// })
// </script>

// <template>
//   <RouterView />
// </template> -->
