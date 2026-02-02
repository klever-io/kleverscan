import { PropsWithChildren } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import ReactSelect, {
  components,
  Props as ReactSelectProps,
} from 'react-select';
import Creatable from 'react-select/creatable';
import { Container } from './styles';

export interface IBaseSelectProps extends ReactSelectProps<any, boolean, any> {
  creatable?: boolean;
}

const BaseSelect: React.FC<PropsWithChildren<IBaseSelectProps>> = props => {
  const { creatable } = props;
  const Placeholder = (props: any) => {
    const Component = components.Placeholder as any;
    return <Component {...props} />;
  };
  const CaretDownIcon = () => {
    return <IoIosArrowDown />;
  };
  const DropdownIndicator = (props: any): React.JSX.Element => {
    const Component = components.DropdownIndicator as any;
    return (
      <Component {...props}>
        <CaretDownIcon />
      </Component>
    );
  };

  return (
    <Container $creatable={creatable}>
      {creatable ? (
        <Creatable
          classNamePrefix="react-select"
          placeholder=""
          components={{ Placeholder, DropdownIndicator }}
          formatCreateLabel={(inputValue: string) =>
            `Create custom: "${inputValue}"`
          }
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
