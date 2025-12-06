import Image from "next/image";

export function HeroSection() {
    return (
        <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[600px] aspect-[4/3]">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-3xl transform scale-90" />

                <Image
                    src="/images/husc_scientific_research.png"
                    alt="Student Research"
                    fill
                    className="object-contain relative z-10 drop-shadow-2xl"
                    priority
                />
            </div>
        </div>
    )
}
