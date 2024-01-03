import {ChangeEvent, Component} from 'react';
import "./_TextArea.css";

interface _TextAreaProps {
    label?: string,
    value?: string,
    onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void,
    fontSize?: number,
    width?: number,
    borderColor?: string,
    outlineColor?: string,
    marginTop?: number
    marginBottom?: number,
}

class _TextArea extends Component<_TextAreaProps> {
    constructor(props: _TextAreaProps) {
        super(props);

    }

    state = {
        clicked: false
    };

    textAreaStyle = {
        fontSize: this.props.fontSize ? this.props.fontSize : 15,

        height: this.props.fontSize ?  this.props.fontSize * 2 : 30,
        width: this.props.width ? this.props.width : '100%',

        paddingTop: this.props.fontSize ?  this.props.fontSize : 15,
        paddingLeft: 15,
        paddingBottom: 0,
        paddingRight: 15,

        marginTop: this.props.marginTop ? this.props.marginTop: 0,
        marginBottom: this.props.marginBottom ? this.props.marginBottom: 0,

        borderColor: this.props.borderColor ? this.props.borderColor : 'blue',
        outlineColor: this.props.outlineColor ? this.props.outlineColor : 'black',
    }

    handleTextAreaOnChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
        if (this.props.onChange) {
            this.props.onChange(event);
        } else {
            console.warn('onChange methiod not defined');
        }
    }

    render() {
        return (
            <div className="component-container">
                <div className="text-area-container">
                    <label className="label" htmlFor="text-area-id">{this.props.label}</label>
                    <textarea style={{...this.textAreaStyle}} id="text-area-id" value={this.props.value} onChange={this.handleTextAreaOnChange} className="text-area"></textarea>
                </div>
            </div>
        );
    }
}

export default _TextArea;