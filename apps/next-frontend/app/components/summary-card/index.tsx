import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const SummaryCard = ({
  title,
  value,
  percentage,
  isPercentage = false,
  className,
}: {
  title: string;
  value: number | string;
  percentage?: number;
  isPercentage?: boolean;
  className?: string;
}) => {
  const percentageColor =
    percentage && percentage > 0
      ? "text-red-500"
      : percentage && percentage < 0
        ? "text-green-500"
        : "text-gray-500";

  return (
    <Card
      className={cn(
        "transition-all duration-300 hover:shadow-lg flex flex-col justify-center border border-gray-200 shadow-sm",
        className,
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
        <CardTitle className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-baseline">
          <div
            className={cn(
              "font-bold tracking-tighter whitespace-nowrap", // tracking-tighter 縮小字距，nowrap 禁止換行
              isPercentage
                ? "text-xl sm:text-2xl lg:text-3xl tabular-nums" // 使用 tabular-nums 讓數字排列更整齊
                : "text-2xl lg:text-3xl",
            )}
          >
            {isPercentage ? value : `${Number(value).toLocaleString()}`}
          </div>

          {percentage !== undefined && (
            <span
              className={cn(
                "ml-1 text-sm font-medium shrink-0",
                percentageColor,
              )}
            >
              ({percentage > 0 ? "+" : ""}
              {percentage.toFixed(2)}%)
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
