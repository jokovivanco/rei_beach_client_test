import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';

interface MenuLinkProps {
  name: string;
  to: string;
  iconElement: JSX.Element;
  hideText?: boolean;
}

const MenuLink = ({ name, to, iconElement, hideText }: MenuLinkProps) => {
  return (
    <Link
      to={to}
      className="menu-link menu-text"
      activeProps={{
        className: 'font-medium text-primary',
      }}
    >
      {iconElement}
      <p
        className={cn(
          'w-0 overflow-hidden whitespace-nowrap transition-all duration-300',
          hideText ? 'md:w-0' : 'md:w-28',
        )}
      >
        {name}
      </p>
    </Link>
  );
};
export default MenuLink;
