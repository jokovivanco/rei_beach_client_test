import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Link, useLocation } from '@tanstack/react-router';

interface ISubMenu {
  name: string;
  to: string;
}

interface IMenu {
  name: string;
  iconElement: JSX.Element;
  menus: ISubMenu[];
}

interface SidebarMenuAccordionProps {
  menu: IMenu[];
}

const SidebarMenuAccordion = ({ menu }: SidebarMenuAccordionProps) => {
  const { pathname } = useLocation();

  return (
    <Accordion type="single" collapsible className="w-full">
      {menu.map((sidebarLink) => {
        const active = sidebarLink.menus.some((menu) => pathname === menu.to);
        return (
          <AccordionItem value={sidebarLink.name} key={sidebarLink.name}>
            <AccordionTrigger
              className={`flex gap-2 items-center ${active ? 'text-primary font-medium' : ''}`}
            >
              <div>{sidebarLink.iconElement}</div>
              {sidebarLink.name}
            </AccordionTrigger>
            <AccordionContent>
              <ul className="ml-8 space-y-4">
                {sidebarLink.menus.map((collapsed: ISubMenu) => (
                  <li key={collapsed.name}>
                    <Link
                      to={collapsed.to}
                      className="menu-link menu-text"
                      activeProps={{
                        className: 'font-medium text-primary',
                      }}
                    >
                      {collapsed.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
export default SidebarMenuAccordion;
