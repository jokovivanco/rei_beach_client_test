import {
  Breadcrumb as BreadcrumbUI,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Fragment } from 'react/jsx-runtime';

interface BreadcrumbProps {
  paths: [string, ...string[]];
}

const Breadcrumb = ({ paths }: BreadcrumbProps) => {
  return (
    <BreadcrumbUI>
      <BreadcrumbList>
        {paths.map((path, index) => (
          <Fragment key={path}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {index === paths.length - 1 ? (
                <BreadcrumbPage>{path}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink>{path}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </BreadcrumbUI>
  );
};
export default Breadcrumb;
