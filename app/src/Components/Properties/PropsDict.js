import Props from './Props';
import {OBJ_TYPES} from '../ObjectsMenuEx/ObjectCreators'

//Dictionary of which properties panel to show for each component
const propPanelsDict = {
    Lists: {
        name: 'Lists',
        included: [OBJ_TYPES.list],
        object: Props.Lists
    },
    TextParagraphs: {
        name: 'TextParagraphs',      
        excluded: [OBJ_TYPES.carousel],  
        object: Props.TextParagraphs
    },
    Heading: {
        name: 'Headings',
        included: [OBJ_TYPES.heading],
        object: Props.Headings
    },
    Carousel: {
        name: 'Carousel',
        included: [OBJ_TYPES.carousel],
        object: Props.Carousel
    },
    PropsAlign: {
        name: 'PropsAlign',
        included: [OBJ_TYPES.layout],
        object: Props.PropsAlign
    },
    DimensionsPositions: {
        name: 'DimensionsPositions',        
        object: Props.DimensionsPositions
    },
    MarginsPaddings: {
        name: 'MarginsPaddings',        
        object: Props.MarginsPaddings
    },
    Styles: {
        name: 'Styles',        
        object: Props.Styles
    },    
}

export default propPanelsDict;