import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Menu,
  Search,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Home,
  AlertCircle,
  Info,
  DollarSign,
  BarChart3,
  Users,
  TrendingUp,
  TrendingDown,
  Wallet,
  Funnel,
} from 'lucide-react';

export type IconName =
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
  | 'home'
  | 'check-circle'
  | 'x-circle'
  | 'alert-circle'
  | 'info'
  | 'dollar-sign'
  | 'bar-chart-3'
  | 'users'
  | 'trending-up'
  | 'trending-down'
  | 'wallet'
  | 'funnel';

type LucideIcon = React.ComponentType<{ size?: number; className?: string }>;

const iconMap: Record<IconName, LucideIcon> = {
  lock: Lock,
  mail: Mail,
  eye: Eye,
  eyeOff: EyeOff,
  menu: Menu,
  search: Search,
  settings: Settings,
  logout: LogOut,
  plus: Plus,
  trash: Trash2,
  edit: Edit,
  check: Check,
  x: X,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  arrowRight: ArrowRight,
  home: Home,
  'check-circle': Check,
  'x-circle': X,
  'alert-circle': AlertCircle,
  info: Info,
  'dollar-sign': DollarSign,
  'bar-chart-3': BarChart3,
  users: Users,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  wallet: Wallet,
  funnel: Funnel,
};

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export const Icon = ({ name, size = 24, className = '' }: IconProps) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent size={size} className={className} />;
};
