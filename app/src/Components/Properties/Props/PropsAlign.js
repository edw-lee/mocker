import React from 'react';
import PropsBox from '../PropsBox'

function AlignDistributeIcon({ size = 30, justifyContent = 'space-evenly', alignItems = 'center', orientation }) {
    const width = size / 8;
    const height = size;
    const rotation = orientation === 'v' ? -90 : 0;
    const strokeWidth = size / 10;

    return (
        <span style={{
            display: 'flex',
            width: size,
            transform: `rotate(${rotation}deg)`,
            justifyContent,
            alignItems
        }}>
            <svg width={size} height={size} style={{ position: 'absolute' }}>
                <path d={`M0 0 L${size} 0 L${size} ${size} L0 ${size} Z`} strokeWidth={`${strokeWidth}px`} fill='none' />
            </svg>

            <svg width={width} height={height}>
                <rect width='100%' height='100%' />
            </svg>

            <svg width={width} height={height * 0.5}>
                <rect width='100%' height='100%' />
            </svg>

            <svg width={width} height={height * 0.75}>
                <rect width='100%' height='100%' />
            </svg>
        </span>
    );
}

export default function PropsAlignClass({ updateObjectsProps }) {
    const alignDistribute = (orientation, alignment) => {
        updateObjectsProps(obj => {
            const { flexDirection } = obj.props.style;

            if (flexDirection === 'column') {
                if (orientation === 'h')
                    return { props: { style: { alignItems: alignment } } };
                else
                    return { props: { style: { justifyContent: alignment } } };
            } else {
                if (orientation === 'h')
                    return { props: { style: { justifyContent: alignment } } };
                else
                    return { props: { style: { alignItems: alignment } } };
            }
        });
    }

    return (
        <PropsBox title='Align & Distribute'>
            <div className='props-title'>Align</div>
            <div className='props-row'>
                <span className='props-btn-grp'>
                    <button className='icon-btn' title='Align Right' onClick={()=> alignDistribute('h', 'flex-start')}>
                        <AlignDistributeIcon alignItems='flex-start' orientation='v' />
                    </button>

                    <button className='icon-btn' title='Align Center' onClick={()=> alignDistribute('h', 'center')}>
                        <AlignDistributeIcon alignItems='center' orientation='v' />
                    </button>

                    <button className='icon-btn' title='Align Left' onClick={()=> alignDistribute('h', 'flex-end')}>
                        <AlignDistributeIcon alignItems='flex-end' orientation='v' />
                    </button>
                </span>

                <span className='props-btn-grp'>
                    <button className='icon-btn' title='Align Top' onClick={()=> alignDistribute('v', 'flex-start')}>
                        <AlignDistributeIcon alignItems='flex-start' />
                    </button>

                    <button className='icon-btn' title='Align Middle' onClick={()=> alignDistribute('v', 'center')}>
                        <AlignDistributeIcon alignItems='center' />
                    </button>

                    <button className='icon-btn' title='Align Bottom' onClick={()=> alignDistribute('v', 'flex-end')}>
                        <AlignDistributeIcon alignItems='flex-end' />
                    </button>
                </span>
            </div>

            <div className='props-title'>Distribute</div>
            <div className='props-row'>
                <span className='props-btn-grp'>
                    <button className='icon-btn' title='Horizontal Distribute Space Between' onClick={()=> alignDistribute('h', 'space-between')}>
                        <AlignDistributeIcon justifyContent='space-between' />
                    </button>

                    <button className='icon-btn' title='Horizontal Distribute Space Around' onClick={()=> alignDistribute('h', 'space-around')}>
                        <AlignDistributeIcon justifyContent='space-around' />
                    </button>

                    <button className='icon-btn' title='Horizontal Distribute Space Evenly' onClick={()=> alignDistribute('h', 'space-evenly')}>
                        <AlignDistributeIcon justifyContent='space-evenly' />
                    </button>
                </span>

                <span className='props-btn-grp'>
                    <button className='icon-btn' title='Vertical Distribute Space Between' onClick={()=> alignDistribute('v', 'space-between')}>
                        <AlignDistributeIcon justifyContent='space-between' orientation='v' />
                    </button>

                    <button className='icon-btn' title='Vertical Distribute Space Around' onClick={()=> alignDistribute('v', 'space-around')}>
                        <AlignDistributeIcon justifyContent='space-around' orientation='v' />
                    </button>

                    <button className='icon-btn' title='Vertical Distribute Space Evenly' onClick={()=> alignDistribute('v', 'space-evenly')}>
                        <AlignDistributeIcon justifyContent='space-evenly' orientation='v' />
                    </button>
                </span>
            </div>
        </PropsBox>
    );
}