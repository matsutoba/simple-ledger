import { Badge } from '@/components/shadcn/ui/badge';

interface CorrectionBadgeProps {
  showBadge: boolean;
}

export const CorrectionBadge: React.FC<CorrectionBadgeProps> = ({
  showBadge,
}) => {
  if (!showBadge) {
    return null;
  }

  return (
    <Badge className="bg-yellow-200 text-yellow-800 hover:bg-yellow-300">
      訂正
    </Badge>
  );
};
