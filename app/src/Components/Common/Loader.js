import './css/Loader.scss'

export default function Loader() {
    return (
        <div className='loader'>
            <div className='spinner'
                style={{
                    width: '120px',
                }}>
                <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                    <circle cx='8' cy='8' r='7' strokeWidth='1.6' />
                </svg>
            </div>

            <div className='spinner'
                style={{
                    width: '80px',
                    transform: 'rotate(60deg)',
                }}>
                <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                    <circle cx='8' cy='8' r='7' strokeWidth='1.5' />
                </svg>
            </div>

            <div className='spinner'
                style={{
                    width: '50px',
                    transform: 'rotate(180deg)',
                }}>
                <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                    <circle cx='8' cy='8' r='7' strokeWidth='2' />
                </svg>
            </div>

            <div className='spinner'
                style={{
                    width: '20px',
                    transform: 'rotate(270deg)',
                }}>
                <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                    <circle cx='8' cy='8' r='7' strokeWidth='3' />
                </svg>
            </div>
        </div>);
}