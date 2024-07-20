import {
  Avatar as AvatarUI,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';

interface IAvatar {
  src?: string;
  avatarFallback?: string;
}

const Avatar = ({ src, avatarFallback }: IAvatar) => {
  return (
    <AvatarUI>
      <AvatarImage src={src} />
      <AvatarFallback>{avatarFallback || 'JO'}</AvatarFallback>
    </AvatarUI>
  );
};
export default Avatar;
