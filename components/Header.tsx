import { ThemeToggle } from "./ThemeToggle";
import Image from "next/image";

export function Header() {
    return (
        <header className="mb-8 flex justify-between items-start">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-primary/10 flex items-center justify-center p-1">
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            width={40}
                            height={40}
                            className="object-contain"
                            priority
                        />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        포트폴리오 리밸런서
                    </h1>
                </div>
                <p className="text-muted-foreground ml-1">
                    정밀한 자산 배분 최적화 도구
                </p>
            </div>
            <ThemeToggle />
        </header>
    );
}
