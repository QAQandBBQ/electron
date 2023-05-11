
<script setup>
import { ref, onMounted } from 'vue'
const url = ref('')
const webview = ref(null)


const webviewDomReady = ref(false)
const canGoBack = ref(false)
const canGoForward = ref(false)


onMounted(() => {
  const el = webview.value
  if (!el) return
  el.addEventListener('dom-ready', () => {
    console.log('dom-ready')
    webviewDomReady.value = true
    updateNavigationState()
    console.log('current url', el.getURL())
  })
  el.addEventListener('did-start-loading', (event) => {
    console.log('did-start-loading', event)
    updateNavigationState()
  })
  el.addEventListener('did-stop-loading', (event) => {
    console.log('did-stop-loading', event)
    updateNavigationState()
    const title = el.getTitle()
    console.log(title, 'webview getTitle')
    if (!title) return
    window.preload.setTitle(title)
  })
  el.addEventListener('did-start-navigation', (event) => {
    console.log('did-start-navigation', event)
    updateNavigationState()
    if (event.url.startsWith('http')) {
      url.value = event.url
    }
  })
  el.addEventListener('will-navigate', (event) => {
    console.log('will-navigate', event)
    url.value = event.url
    go()
  })
  el.addEventListener('new-window', (event) => {
    console.log('will-navigate', event)
    url.value = event.url
    go()
  })
  // el.addEventListener('did-finish-load', () => {
  //   const title = el.getTitle();
  //   console.log(title, 'did-finish-load');
  // });
})

const updateNavigationState = () => {
  if (!webview.value) return
  if (!webviewDomReady.value) return
  canGoBack.value = webview.value.canGoBack()
  canGoForward.value = webview.value.canGoForward()
}

const isURL = (input) => {
  const pattern = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/
  if (pattern.test(input)) return true
  return pattern.test(`http://${input}`)
}

const goBack = () => {
  const el = webview.value
  if (el.canGoBack()) {
    el.goBack()
  }
}

const goForward = () => {
  const el = webview.value
  if (el.canGoForward()) {
    el.goForward()
  }
}

function go() {
  const el = webview.value
  const site = url.value || 'about:blank'
  if (isURL(site)) {
    el.loadURL(site.indexOf('://') === -1 ? `http://${site}` : site)
    console.log({el}, el.contentWindow.top.title)
  }
}
</script>

<template>
  <div>
    <div class="toolbar">
      <div :class="['back', { active: canGoBack }]" @click="goBack">&lt;</div>
      <div :class="['forward', { active: canGoForward }]" @click="goForward">&gt;</div>
      <input v-model="url" placeholder="Please enter the url" @keydown.enter="go" />
      <div class="go" @click="go">Go</div>
    </div>
    <!-- 默认需要加上about:blank，否则会报错 -->
    <webview ref="webview" class="webview" src="about:blank" allowpopups></webview>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  height: 50px;
  box-sizing: border-box;
}

.toolbar div {
  border-radius: 5px;
  background-color: #EEEEEE;
  margin: 3px;
  padding: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #d8d8d8;
  user-select: none;
}

input {
  flex: 1;
  margin: 0 5px;
  height: 26px;
  border: 1px solid #d8d8d8;
  outline: none;
  padding: 0 10px;
}

.back,
.forward {
  width: 20px;
  color: #BABCBE;
}

.back.active,
.forward.active {
  color: black;
}

.go {
  width: 50px;
}

.webview {
  width: 100%;
  height: calc(100vh - 50px);
}
</style>




