import AssetType from "~/types/AssetType";

interface AssetGridProps {
    assets: AssetType[]
}

export default function AssetGrid({assets}: AssetGridProps) {
    function getImgData(url: string) {
        fetch(url)
            .then(r => r.arrayBuffer())
            .then(a =>
                parent.postMessage({
                    pluginMessage: {
                        message: 'IMG_DATA',
                        imgData: new Uint8Array(a)
                    },
                    pluginId: '1381050062397011474'
                }, '*')
            )
    }

    return (
        <div className="grid grid-cols-2 gap-4 p-4">
            {assets.map((asset: AssetType) => (
                <div>
                    <img
                        src={asset.url} className="cursor-pointer hover:opacity-90"
                        onClick={() => getImgData(asset.url)}
                    />
                </div>
            ))}
        </div>
    )
}