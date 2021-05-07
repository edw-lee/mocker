export const createTypeObj = type => {
    return { type };
}

export const createStyleObj = (prop, value) => {
    const props = { style: {} }
    props.style[prop] = value;

    return { props }
}

export const createTextDecoObj = (textDeco, style, isBold, isItalic, isUnderlined, isStrikeThrough) => {
    if (!style)
        style = {};

    if (!style.textDecoration)
        style.textDecoration = '';

    switch (textDeco) {
        case 'italic':
            if (isItalic)
                return createStyleObj('fontStyle', '')
            else
                return createStyleObj('fontStyle', 'italic')
        case 'underline':
            if (isUnderlined) {
                return createStyleObj('textDecoration', style.textDecoration.replace(/underline/g, ''));
            } else {
                if (!style.textDecoration.includes('underline')) {
                    return createStyleObj('textDecoration', `${style.textDecoration.trim()} underline`.trim());
                }
            }
            break;
        case 'line-through':
            if (isStrikeThrough) {
                return createStyleObj('textDecoration', style.textDecoration.replace(/line-through/g, ''));
            } else {
                if (!style.textDecoration.includes('line-through'))
                    return createStyleObj('textDecoration', `${style.textDecoration.trim()} line-through`.trim());
            }
            break;
        case 'bold':
            let fontWeight = 'bold';

            if (isBold)
                fontWeight = '';

            return createStyleObj('fontWeight', fontWeight);
        default:
            return { props: { style } };
    }

    return { props: { style } };
}