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
      <h2 className="text-4xl font-black mb-8">
        AI Insights
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {insights.map(
          (
            insight,
            index
          ) => (
            <div
              key={index}
              className="bg-slate-800/60 backdrop-blur p-6 rounded-3xl shadow-xl border border-slate-700"
            >
              <h3 className="text-xl font-bold mb-3 text-blue-400">
                {
                  insight?.title ||
                  "Insight"
                }
              </h3>

              <p className="text-slate-300 leading-relaxed">
                {
                  insight?.description ||
                  "No description"
                }
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}