type Props = {
  children: React.ReactNode;

  className?: string;
};

export default function PremiumCard({
  children,
  className = "",
}: Props) {

  return (
    <div
      className={`
        rounded-3xl
        border
        border-white/[0.08]
        bg-[#111111]
        shadow-[0_8px_30px_rgb(0,0,0,0.12)]
        backdrop-blur-xl
        transition-all
        duration-300
        hover:border-white/[0.12]
        hover:shadow-[0_12px_40px_rgb(0,0,0,0.18)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}