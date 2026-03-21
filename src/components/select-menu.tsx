interface SelectOption<T> {
  name: string;
  description: string;
  value: T;
}

interface SelectMenuProps<T> {
  options: SelectOption<T>[];
  onSelect: (value: T) => void;
}

export function SelectMenu<T>({ options, onSelect }: SelectMenuProps<T>) {
  return (
    <box justifyContent="center" marginTop={1}>
      <select
        options={options}
        selectedIndex={0}
        focused={true}
        wrapSelection={true}
        height={options.length * 2 + 1}
        // selectedBackgroundColor="yellow"
        // selectedTextColor="black"
        onSelect={(_index, option) => {
          if (option?.value != null) onSelect(option.value);
        }}
      />
    </box>
  );
}
