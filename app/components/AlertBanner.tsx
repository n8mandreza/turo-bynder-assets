import AlertFilled from "~/icons/AlertFilled"

interface AlertBannerProps {
    title?: string
    message: string
}

export default function AlertBanner({title, message}: AlertBannerProps) {
    return (
        <div className="surface-alert flex gap-3 items-center p-4">
            <div className="icon-alert w-6 h-6">
                <AlertFilled />
            </div>

            <div className="flex flex-col gap-1">
                {title ? (
                    <h4 className="font-black">{title}</h4>
                ) : null}

                <p className="text-sm">{message}</p>
            </div>
        </div>
    )
}