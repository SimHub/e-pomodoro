export default function editMenuTemplate(win) {
  return [
    {
      label: "edit",
      submenu: [
        {
          label: "default-size",
          click() {
            console.log(this);
            win.send("minimize", false);
            win.setSize(356, 380, true);
          },
        },
      ],
    },
  ];
}
