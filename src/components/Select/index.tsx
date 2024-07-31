import { PropsWithChildren } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import ReactSelect, { components, Props } from 'react-select';
import Creatable from 'react-select/creatable';
import { Container } from './styles';

interface IBaseSelectProps extends Props {
  creatable?: boolean;
}

const BaseSelect: React.FC<PropsWithChildren<IBaseSelectProps>> = props => {
  const { creatable } = props;
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
    <Container $creatable={creatable}>
      {creatable ? (
        <Creatable
          classNamePrefix="react-select"
          placeholder=""
          components={{ Placeholder, DropdownIndicator }}
          formatCreateLabel={inputValue => `Create custom: "${inputValue}"`}
          {...props}
        />
      ) : (
        <ReactSelect
          classNamePrefix="react-select"
          placeholder=""
          components={{ Placeholder, DropdownIndicator }}
          {...props}
        />
      )}
    </Container>
  );
};

export default BaseSelect;
