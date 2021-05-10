import { extractString } from "../../Functions/Common";

export const getStyle = (obj, styleProp, defaultValue = '') => {   
    if(!obj || !obj.props)
        return;

    if (!obj.props.style || !obj.props.style[styleProp] || 
        (typeof(obj.props.style[styleProp]) === 'string' && !obj.props.style[styleProp]))
        return defaultValue;
        
    return obj.props.style[styleProp];
};

export const getTextAlign = obj => {
    return getStyle(obj, 'textAlign', 'left');
};

export const getFontFamily = obj => {
    return getStyle(obj, 'fontFamily', '');
}

export const getTextDeco = (obj, textDecoStr) => {
    if(!obj || !obj.props) 
        return;

    if (obj.props.style && obj.props.style.textDecoration) {
        return extractString(obj.props.style.textDecoration, textDecoStr);
    }
};