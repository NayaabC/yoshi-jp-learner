import { Button } from "@/components/ui/button";
import Image from "next/image";

export const Footer = () => {
    return (
        <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
            <div className="max-w-screen-lg mx-auto flex items-center justify-evenly h-full">
                <Button size="lg" variant="ghost" className="w-full">
                    <Image 
                        src="/chikara.svg" 
                        alt="Kana" 
                        height={32} 
                        width={40}
                        className="mr-4 rounded-md"
                    />
                    Kana
                </Button>
                <Button size="lg" variant="ghost" className="w-full">
                    <Image 
                        src="/gaku.svg" 
                        alt="Radicals" 
                        height={32} 
                        width={40}
                        className="mr-4 rounded-md"
                    />
                    Radicals
                </Button>
                <Button size="lg" variant="ghost" className="w-full">
                    <Image 
                        src="/book.svg" 
                        alt="Search" 
                        height={32} 
                        width={40}
                        className="mr-4 rounded-md"
                    />
                    Search
                </Button>
                <Button size="lg" variant="ghost" className="w-full">
                    <Image 
                        src="/drawing-tool.svg" 
                        alt="Draw" 
                        height={32} 
                        width={40}
                        className="mr-4 rounded-md"
                    />
                    Draw
                </Button>
                <Button size="lg" variant="ghost" className="w-full">
                    <Image 
                        src="/random.svg" 
                        alt="Random Entry" 
                        height={32} 
                        width={40}
                        className="mr-4 rounded-md"
                    />
                    Random
                </Button>
            </div>
        </footer>
    );
};