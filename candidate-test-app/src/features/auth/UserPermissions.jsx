export const UserPermissions = ({ session }) => {
  const isAdmin = session?.user?.role === 'admin';
  const isUser = session?.user?.role === 'user';
  return { isAdmin, isUser };
};