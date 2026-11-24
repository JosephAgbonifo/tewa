import Image from "next/image";

export default function BackgroundDecor({
  variant = "page",
}: {
  variant?: "page" | "hero";
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div
        className={
          variant === "hero"
            ? "absolute inset-0 bg-gradient-to-br from-purple/50 via-cream to-gold/15"
            : "absolute inset-0 bg-gradient-to-br from-purple/8 via-cream to-gold/10"
        }
      />

      <div className="absolute -right-24 -top-24 h-[500px] w-[500px] opacity-10 md:h-[700px] md:w-[700px]">
        <Image src="/tewa.png" alt="" fill className="object-contain" />
      </div>

      {variant === "page" && (
        <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] opacity-10">
          <Image src="/tewa.png" alt="" fill className="object-contain" />
        </div>
      )}
    </div>
  );
}
