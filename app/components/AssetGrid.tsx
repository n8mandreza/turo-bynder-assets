import AssetType from "~/types/AssetType";
import { Masonry, RenderComponentProps } from "masonic";

interface AssetGridProps {
    assets: AssetType[]
}

function AssetGridItem({index, data: { id, url }, width}: RenderComponentProps<AssetType>) {
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
        <div id={index.toString()} className="overflow-hidden rounded-lg">
            <img
                id={id}
                src={url} className="cursor-pointer hover:opacity-90"
                onClick={() => getImgData(url)}
            />
        </div>
    )
}

export default function AssetGrid({assets}: AssetGridProps) {
    return (
        <div className="p-4">
            <Masonry items={assets} render={AssetGridItem} columnGutter={16} columnWidth={160} />
        </div>
    )
}