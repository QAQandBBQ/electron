const tpl = [
  {
    label: "自定义菜单",
    submenu: [
      {
        label: "点我试试",
        click: () => {
          console.log("try");
        },
      },
      {
        label: "默认选中",
        type: "checkbox",
        checked: true,
      },
      { type: "separator" },
      {
        label: "单选菜单",
        submenu: [
          { label: "选项1", type: "radio" },
          { label: "选项2", type: "radio" },
          { label: "选项3", type: "radio" },
        ],
      },
      {
        label: "多级菜单",
        submenu: [
          {
            label: "二级菜单",
            submenu: [{ label: "三级菜单", submenu: [{ label: "四级菜单" }] }],
          },
        ],
      },
    ],
  },
  {
    label: "调试菜单",
    submenu: [
      { role: "toggleDevTools" },
      {
        role: "reload",
        accelerator: "Shift+K",
        click: () => {
          console.log("reload");
        },
      },
    ],
  },
];

/**
 * 下面都是合法的快捷键：
    ● CmdOrCtrl+A
    ● CmdOrCtrl+Shift+Z
    ● Shift+Space
    ● Option+Delete
 */

/**
 * 实操
 */
const ownTpl = [
  {
    label: "文字加粗",
    key: "bold",
    click: () => {
      console.log("文字加粗");
    },
  },
  {
    label: "改变颜色",
    key: "color",
    click: () => {
      console.log("改变颜色");
    },
  },
];

module.exports = {
  tpl,
  ownTpl,
};
