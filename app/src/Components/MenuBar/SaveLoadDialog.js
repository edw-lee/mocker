/**@type{React.CSSProperties} */
const buttonStyle = {
    display: 'flex',
    width: '100px',
    height: '100px',
    fontSize: '24px',
    padding: '0',
    margin: '0',
    justifyContent: 'center',
    alignItems: 'center'
}

/**@type{React.CSSProperties} */
const containerStyle = {
    display: 'flex',
    justifyContent: 'space-evenly'
}

//*isLoadLocalFile flag changes the Local Storage button to an input file type button that will prompt the file selection window
export default function SaveLoadDialog({ closeDialogBox, localCallback, driveCallback, isLoadLocalFile }) {

    const localClick = e => {
        localCallback(e);
        closeDialogBox();
    }

    const driveClick = e => {
        driveCallback(e)
        closeDialogBox();
    }

    return (
        <div style={containerStyle}>
            {
                !isLoadLocalFile ?
                    <button type='button' className='secondary-light-btn'
                        onClick={localClick}
                        title='Local Storage'
                        style={buttonStyle}>
                        <i className='fas fa-hdd'></i>
                    </button>
                    :
                    <label className='secondary-light-btn' style={buttonStyle} title='Local Storage'>
                        <input type='file'
                            onChange={localClick}                            
                            style={{display:'none'}} />
                        <i className='fas fa-hdd'></i>
                    </label>
            }


            <button type='button' className='secondary-light-btn'
                onClick={driveClick}
                title='Google Drive'
                style={buttonStyle}>
                <i className='fab fa-google-drive'></i>
            </button>
        </div>
    );
}