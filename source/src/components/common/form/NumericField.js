import { Form, InputNumber } from 'antd';
import React from 'react';
import useFormField from '@hooks/useFormField';
import { formatNumber } from '@utils';

const NumericField = (props) => {
    const { label, name, disabled, min, max, width, onChange, onBlur, formatter, parser, className, defaultValue } =
        props;

    const fieldParser = (value) => {
        return value.replace(/\$\s?|(,*)/g, '');
    };

    const fieldFormatter = (value) => {
        return formatNumber(value);
    };

    const { rules, placeholder } = useFormField(props);

    return (
        <Form.Item label={label} name={name} rules={rules} className={className}>
            <InputNumber
                placeholder={placeholder}
                max={max}
                min={min}
                disabled={disabled}
                style={{ width: width || '100%' }}
                formatter={formatter || fieldParser}
                parser={parser || fieldFormatter}
                onChange={onChange}
                onBlur={onBlur}
                defaultValue={defaultValue}
            />
        </Form.Item>
    );
};

export default NumericField;
