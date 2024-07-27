import { ChevronFirst, ChevronLast } from 'lucide-react';
import { useState } from 'react';
import SidebarMenu from '../SidebarMenu';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const [hiddenSidebar, setHiddenSidebar] = useState(false);

  function toggleSidebar() {
    setHiddenSidebar(!hiddenSidebar);
  }

  return (
    <div className="relative bg-slate-950">
      <div
        className={cn(
          'flex absolute top-0 px-2 pt-1 transition-all duration-300',
          hiddenSidebar ? 'right-1/2 translate-x-1/2' : 'right-0 ',
        )}
      >
        {hiddenSidebar ? (
          <ChevronLast
            className="text-muted-foreground cursor-pointer hidden md:block"
            onClick={toggleSidebar}
          />
        ) : (
          <ChevronFirst
            className="text-muted-foreground cursor-pointer hidden md:block"
            onClick={toggleSidebar}
          />
        )}
      </div>
      <div
        className={
          'pt-10 pl-4 pr-2 inset-20 shadow-[rgba(0,0,15,0.1)_2px_2px_10px_0px] h-full'
        }
      >
        <nav>
          <SidebarMenu hideText={hiddenSidebar} />
        </nav>
      </div>
    </div>
  );
};
export default Sidebar;
