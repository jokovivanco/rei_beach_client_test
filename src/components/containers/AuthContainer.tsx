import { ReactChildren } from '@/types';

const LoginContainer = ({ children }: ReactChildren) => {
  return (
    <div className="w-96 mx-auto p-10 rounded-xl shadow-lg flex flex-col gap-8 bg-card">
      {children}
    </div>
  );
};
export default LoginContainer;
