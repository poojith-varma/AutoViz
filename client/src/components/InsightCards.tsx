import PremiumCard from "./ui/PremiumCard";

type Props = {
  insights: any[];
};

export default function InsightCards({
  insights,
}: Props) {

  if (
    !Array.isArray(
      insights
    ) ||
    !insights.length
  ) {
    return null;
  }

  return (
    <div className="mt-14">
      <h2 className="text-3xl font-semibold tracking-tight mb-8">
        AI Insights
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {insights.map(
          (
            insight,
            index
          ) => (
            <PremiumCard
  key={index}
  className="p-7"
>
              <h3 className="text-lg font-semibold tracking-tight mb-3 text-white">
                {
                  insight?.title ||
                  "Insight"
                }
              </h3>

              <p className="text-sm leading-7 text-zinc-400">
                {
                  insight?.description ||
                  "No description"
                }
              </p>
            </PremiumCard>
          )
        )}
      </div>
    </div>
  );
}