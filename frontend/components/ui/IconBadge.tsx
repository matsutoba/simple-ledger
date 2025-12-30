import { Icon } from '@/components/ui/Icon';
import { iconBadgeColors, type IconBadgeColorKey } from '@/theme/colors';

type IconName =
  | 'lock'
  | 'mail'
  | 'eye'
  | 'eyeOff'
  | 'menu'
  | 'search'
  | 'settings'
  | 'logout'
  | 'plus'
  | 'trash'
  | 'edit'
  | 'check'
  | 'x'
  | 'chevronDown'
  | 'chevronUp'
  | 'arrowRight'
  | 'home';

type BadgeSize = 'sm' | 'md' | 'lg';

const sizeMap: Record<BadgeSize, { container: string; iconSize: number }> = {
  sm: {
    container: 'w-10 h-10',
    iconSize: 20,
  },
  md: {
    container: 'w-12 h-12',
    iconSize: 24,
  },
  lg: {
    container: 'w-16 h-16',
    iconSize: 32,
  },
};

interface IconBadgeProps {
  icon: IconName;
  color?: IconBadgeColorKey;
  size?: BadgeSize;
  className?: string;
}

export const IconBadge = ({
  icon,
  color = 'primary',
  size = 'md',
  className = '',
}: IconBadgeProps) => {
  const { container, iconSize } = sizeMap[size];
  const colorConfig = iconBadgeColors[color];
  const baseStyles = `inline-flex items-center justify-center rounded-full ${colorConfig.bg} ${container}`;
  const combinedClassName = `${baseStyles} ${className}`.trim();

  return (
    <div className={combinedClassName}>
      <Icon name={icon} size={iconSize} className={colorConfig.icon} />
    </div>
  );
};
