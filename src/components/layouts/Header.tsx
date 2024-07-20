import Avatar from '../custom-ui/Avatar';
import { Link } from '@tanstack/react-router';
// import { useRefreshQuery } from '@/hooks/queries/userQuery';

const Header = () => {
  // const { data } = useRefreshQuery();

  return (
    <header className="bg-navigationBackground sticky w-full top-0 z-50">
      <div className="px-8 py-2 flex justify-between items-center">
        <Link to="/" className="flex gap-2 items-center">
          <img src="/logo-icon.svg" alt="logo" className="h-10" />
          <img src="/logo.png" alt="logo" className="h-10" />
        </Link>
        <div className="flex items-center gap-2">
          <Avatar avatarFallback="JO" />
          <div className="text-white">
            <p>Jo</p>
            {/* <p>{data.data.name}</p> */}
            {/* <p>{data.data.role}</p> */}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
