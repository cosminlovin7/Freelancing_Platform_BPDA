import {ChangeEvent, Component} from 'react';
import "./_InputField.css";

interface _InputFieldProps {
    label?: string,
    value?: string | number,
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
    fontSize?: number,
    width?: number,
    borderColor?: string,
    outlineColor?: string,
    marginTop?: number
    marginBottom?: number,
    type?: string
}

class _InputField extends Component<_InputFieldProps> {
    constructor(props: _InputFieldProps) {
        super(props);

    }

    state = {
        clicked: false
    };

    textAreaStyle = {
        fontSize: this.props.fontSize ? this.props.fontSize : 15,

        height: this.props.fontSize ?  this.props.fontSize * 2 : 30,
        width: this.props.width ? this.props.width : '100%',

        paddingTop: this.props.fontSize ?  this.props.fontSize : 10,
        paddingLeft: 15,
        paddingBottom: 10,
        paddingRight: 15,

        marginTop: this.props.marginTop ? this.props.marginTop: 0,
        marginBottom: this.props.marginBottom ? this.props.marginBottom: 0,

        borderColor: this.props.borderColor ? this.props.borderColor : 'blue',
        outlineColor: this.props.outlineColor ? this.props.outlineColor : 'black',
    }

    handleInputFieldOnChange = (event: ChangeEvent<HTMLInputElement>): void => {
        if (this.props.onChange) {
            this.props.onChange(event);
        } else {
            console.warn('onChange method not defined');
        }
    }

    render() {
        return (
            <div className="component-container">
                <div className="input-field-container">
                    <label className="label" htmlFor="input-field-id">{this.props.label}</label>
                    <input type={this.props.type}
                           style={{...this.textAreaStyle}}
                           id="input-field-id"
                           value={this.props.value}
                           onChange={this.handleInputFieldOnChange}
                           className="input-field">
                    </input>
                </div>
            </div>
        );
    }
}

export default _InputField;