import { IoIosArrowDown } from 'react-icons/io';
import ReactSelect, { components, Props } from 'react-select';
import { Container } from './styles';

const BaseSelect: React.FC<Props> = props => {
  const Placeholder = (props: any) => {
    return <components.Placeholder {...props} />;
  };
  const CaretDownIcon = () => {
    return <IoIosArrowDown />;
  };
  const DropdownIndicator = (props: any) => {
    return (
      <components.DropdownIndicator {...props}>
        <CaretDownIcon />
      </components.DropdownIndicator>
    );
  };
  return (
    <Container>
      <ReactSelect
        classNamePrefix="react-select"
        placeholder=""
        components={{ Placeholder, DropdownIndicator }}
        {...props}
      />
    </Container>
  );
};

export default BaseSelect;
