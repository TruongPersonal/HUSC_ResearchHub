import { HeroSection } from "@/components/shared/home/HeroSection";
import { InfoSection } from "@/components/shared/home/InfoSection";

export default function StudentHomePage() {
    return (
        <div className="relative w-full max-w-[1080px] mx-auto min-h-[65vh] flex flex-col justify-center">
            {/* Background Gradients */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-100/40 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <InfoSection />
                <HeroSection />
            </div>
        </div>
    );
}
