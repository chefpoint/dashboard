import { Divider, Card, Text } from '@nextui-org/react';
import Select, { components } from 'react-select';

export default function RecipeSelectorCard({ value, title, options, color, onChange }) {
  //

  const Option = (props) => {
    return (
      <components.Option {...props}>
        <Text weight='medium'>{props.data.title_pt}</Text>
        <Text size={12}>{props.data.title_en}</Text>
      </components.Option>
    );
  };

  const colourStyles = {
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isDisabled ? undefined : isSelected ? '#c0e8ff' : isFocused ? '#c0e8ff' : undefined,

        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled ? (isSelected ? '#F9F9F9' : '#F9F9F9') : undefined,
        },
      };
    },
  };

  return (
    <Card bordered shadow={false} css={{ borderColor: color, overflow: 'visible' }}>
      <Card.Header>
        <Text b size={18} color={color}>
          {title}
        </Text>
      </Card.Header>
      <Divider />
      <Card.Body css={{ p: '$sm', overflow: 'visible' }}>
        <Select
          closeMenuOnSelect={false}
          isClearable
          isSearchable
          styles={colourStyles}
          options={options}
          value={value}
          onChange={onChange}
          getOptionLabel={(option) => option.title_pt}
          getOptionValue={(option) => option.apicbase_id}
          components={{ Option }}
        />
      </Card.Body>
    </Card>
  );
}
