import AssetType from "~/types/AssetType";
import { Masonry } from "masonic";

interface AssetGridProps {
    assets: AssetType[]
}

interface AssetGridItemProps {
    asset: AssetType;
}

function AssetGridItem({asset}: AssetGridItemProps) {
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
        <div className="overflow-hidden rounded-lg">
            <img
                id={asset.id}
                src={asset.url} className="cursor-pointer hover:opacity-90"
                onClick={() => getImgData(asset.url)}
            />
        </div>
    )
}

export default function AssetGrid({assets}: AssetGridProps) {
    return (
        <div className="grid grid-cols-2 gap-4 p-4">
            {assets.map((asset: AssetType) => (
                <AssetGridItem asset={asset}/>
            ))}
        </div>
    )
}