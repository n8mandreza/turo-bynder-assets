interface SpotIllustrationProps {
    spotIllustration: React.ReactNode
}

export default function SpotIllustration({ spotIllustration }: SpotIllustrationProps) {
    return (
        <div className="w-16 h-16 relative">
            <div className="opacity-60 rounded-full spot-bg-success"></div>

            <div className="z-10 absolute top-0 left-0 right-0 bottom-0">
                {spotIllustration}
            </div>
        </div>
    )
}