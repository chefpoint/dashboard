import { forwardRef } from 'react';
import styles from './SelectRecipe.module.css';
import { Stack, Avatar, Text, Select } from '@mantine/core';

// eslint-disable-next-line react/display-name
const SelectItem = forwardRef(({ title_pt, title_en, ...others }, ref) => {
  return (
    <div ref={ref} className={styles.container} {...others}>
      <Text size='sm'>{title_pt}</Text>
      <Text size='xs' color='dimmed'>
        {title_en}
      </Text>
    </div>
  );
});

export default function SelectRecipe({ data, label, value, onChange }) {
  return (
    <Select
      label={label}
      placeholder='Choose a recipe'
      itemComponent={SelectItem}
      data={data}
      searchable
      clearable
      value={value}
      onChange={onChange}
      nothingFound='No recipes found'
      filter={(value, item) =>
        item.title_pt.toLowerCase().includes(value.toLowerCase().trim()) || item.title_en.toLowerCase().includes(value.toLowerCase().trim())
      }
    />
  );
}
