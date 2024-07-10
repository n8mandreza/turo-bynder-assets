import SpotIllustration from "~/components/SpotIllustration";
import SpotThumbsUpSuccess from "~/illustrations/SpotThumbsUpSuccess";

export default function SuccessRoute() {
    return (
        <div className="flex flex-col gap-4 items-center justify-center w-screen h-screen">
            <SpotIllustration spotIllustration={<SpotThumbsUpSuccess />} />
            <h1 className="text-xl">You've successfully logged into Bynder</h1>
            <p>You may now close this window and return to Figma.</p>
        </div>
    )
}