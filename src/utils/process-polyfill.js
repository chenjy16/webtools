// 为浏览器环境提供 process 对象的 polyfill
if (typeof window !== 'undefined') {
  // 添加 process 对象
  if (!window.process) {
    window.process = {
      env: {},
      nextTick: function(fn) {
        setTimeout(fn, 0);
      },
      cwd: function() {
        return '/';
      }
    };
  }
  
  // 添加 __require 对象及其 resolve 方法
  if (!window.__require) {
    window.__require = {
      resolve: function(path) {
        return path;
      }
    };
  }
}

export default window.process;