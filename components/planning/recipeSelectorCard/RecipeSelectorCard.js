import { Divider, Card, Text, Button, Spacer } from '@nextui-org/react';
import Select, { components } from 'react-select';
import { GoLinkExternal, GoAlert, GoCheck, GoArrowRight } from 'react-icons/go';

export default function RecipeSelectorCard({ selection, title, options, color, onChange }) {
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

  function validateSelection() {
    //
    // If no recipe is selected
    if (!selection)
      return (
        <Text b size={12} color='$muted' css={{ d: 'flex', alignItems: 'center', gap: 4 }}>
          <GoArrowRight />
          Selecione uma receita.
        </Text>
      );

    // If chosen recipe has no English translation
    if (!selection.title_en || selection.title_en == '')
      return (
        <>
          <Text b size={12} color='warning' css={{ d: 'flex', alignItems: 'center', gap: '$xs' }}>
            <GoAlert />
            Esta receita não tem tradução para Inglês.
          </Text>
          <Button onClick={() => window.open(selection.apicbase_url, '_blank')} size='xs' color='warning' flat css={{ p: '$sm' }}>
            Editar Receita
            <Spacer x={0.25} />
            <GoLinkExternal />
          </Button>
        </>
      );

    // If no errors are found
    return (
      <>
        <Text b size={12} color={color} css={{ d: 'flex', alignItems: 'center', gap: '$xs' }}>
          <GoCheck />
          Esta receita cumpre os requisitos de planeamento.
        </Text>
        <Button onClick={() => window.open(selection.apicbase_url, '_blank')} size='xs' color={color} flat css={{ p: '$sm' }}>
          Ver Receita
          <Spacer x={0.25} />
          <GoLinkExternal />
        </Button>
      </>
    );
  }

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
          isClearable
          isSearchable
          styles={colourStyles}
          options={options}
          value={selection}
          onChange={onChange}
          getOptionLabel={(option) => option.title_pt}
          getOptionValue={(option) => option.apicbase_id}
          components={{ Option }}
        />
      </Card.Body>
      <Divider />
      <Card.Footer css={{ p: '$sm', overflow: 'visible', d: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {validateSelection()}
      </Card.Footer>
    </Card>
  );
}
