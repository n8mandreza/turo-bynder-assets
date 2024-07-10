import SpotIllustration from "~/components/SpotIllustration";
import SpotThumbsUpSuccess from "~/illustrations/SpotThumbsUpSuccess";

export default function SuccessRoute() {
    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen">
            <div className="surface-success rounded-2xl flex items-center gap-4 py-3 px-6">
                <SpotIllustration spotIllustration={<SpotThumbsUpSuccess />} />

                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-medium">You've successfully logged into Bynder</h1>
                    <p>You may now close this window and return to Figma.</p>
                </div>
            </div>
        </div>
    )
}