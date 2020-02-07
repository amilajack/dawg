import * as framework from '@/lib/framework';
import { Command } from '@/dawg/extensions/core/commands';
import { uniqueId } from '@/lib/std';
import { menuBarCallbacks, ipcSender } from '@/ipcRenderer';

interface SubMenu {
  name: string;
  items: Array<Command | null>;
}

// FIXME Make this structure...
// [
//   this.menuItems.new,
//   null,
//   this.menuItems.open,
//   this.menuItems.backup,
//   null,
//   this.menuItems.addFolder,
//   null,
//   this.menuItems.save,
//   this.menuItems.saveAs,
// ],

export type Menu = SubMenu[];
type MenuNames = 'File' | 'Edit' | 'View' | 'Help';

export const menubar = framework.manager.activate({
  id: 'dawg.menubar',
  activate() {
    const menus: { [K in MenuNames]: Menu } = {
      File: [],
      Edit: [],
      View: [],
      Help: [],
    };

    Object.keys(menus).forEach((menu, i) => {
      ipcSender.send('defineMenu', { menu, order: i });
    });

    const transform = (menu: string, item: Command) => {
      let accelerator: string | undefined;
      if (item.shortcut) {
        accelerator = item.shortcut.join('+');
      }

      const uniqueEvent = uniqueId();
      menuBarCallbacks[uniqueEvent] = item.callback;

      return {
        menu,
        label: item.text,
        uniqueEvent,
        accelerator,
      };
    };

    return {
      getMenu(menu: MenuNames) {
        return {
          alreadyDefined: false,
          addItem: (item: Command) => {
            const electronItem = transform(menu, item);
            ipcSender.send('addToMenuBar', electronItem);

            return {
              dispose() {
                ipcSender.send('removeFromMenuBar', electronItem);
                delete menuBarCallbacks[electronItem.uniqueEvent];
              },
            };
          },
        };
      },
    };
  },
});
