import { createKeyId } from "../../../Functions/ObjectProcessor";

export default function CarouselObject({ urls }) {
    const carouselItems = urls.map((url, idx) => {
        const className = idx === 0 ? 'carousel-item active' : 'carousel-item';

        return (
            <div key={createKeyId('carousel-item')} className={className}>
                <img key={createKeyId('img')} src={url} draggable={false} alt={url}/>
            </div>
        );
    });

    return (
        <div className='carousel' data-objtype='carousel'>
            <div className='carousel-wrapper'>
                {carouselItems}
            </div>

            <div className='prev-btn'>
                <i className='fas fa-chevron-left'></i>
            </div>
            <div className='next-btn'>
                <i className='fas fa-chevron-right'></i>
            </div>
        </div>
    );
}