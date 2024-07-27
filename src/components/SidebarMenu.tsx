import MenuLink from './custom-ui/MenuLink';
import { sidebarMenu } from '@/constants/sidebar-menu';

const SidebarMenu = ({ hideText }: { hideText: boolean }) => {
  return (
    <ul className="space-y-6">
      {sidebarMenu.map((menu) => (
        <li key={menu.name}>
          <MenuLink
            name={menu.name}
            to={menu.to}
            iconElement={menu.iconElement}
            hideText={hideText}
          />
        </li>
      ))}
    </ul>
  );
};
export default SidebarMenu;
