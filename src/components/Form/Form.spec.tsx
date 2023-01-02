import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Form from '.';
import theme from '../../styles/theme';
import {
  mockAssetTriggerTx,
  mockBuySection,
  mockCreateAssetSection,
  mockTransferContract,
} from '../../test/mocks/form';
import {} from '../../test/mocks/index';
import { renderWithTheme } from '../../test/utils';

const formProps = {
  sections: [] as any[],
  onSubmit: jest.fn(),
  loading: false,
  setData: jest.fn(),
  setIsMultisig: jest.fn(),
  setShowPayload: jest.fn(),
  showPayload: false,
  isMultisig: false,
};

describe('Component: Form', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const formSectionStyle = {
    position: 'relative',
    display: 'grid',
    gridAutoColumns: 'auto',
    columnGap: '1rem',
    rowGap: '3rem',
    borderRadius: '1rem',
    backgroundColor: theme.white,
  };

  const sectionTitleStyle = {
    display: 'flex',
    color: theme.darkText,
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    userSelect: 'none',
    alignItems: 'center',
  };

  const uriLabelPhrase = 'URI identifier. Ex: "foo"';
  const uriAddressPhrase = 'URI address. Ex: "http://bar.com"';

  it('Should render the Buy Contract Form', () => {
    formProps.sections = mockBuySection;
    renderWithTheme(
      <Form
        contractName={'BuyContract'}
        key={'BuyContract'}
        showForm={true}
        {...formProps}
      />,
    );

    mockBuySection[0].fields.forEach(field => {
      const label = screen.getByText(field.label);
      expect(label).toBeInTheDocument();
      expect(label.parentNode?.parentNode).toHaveStyle(formSectionStyle);

      if (field?.props && field?.props?.tooltip) {
        const tooltip = screen.getByText(field.props.tooltip);
        expect(tooltip).toBeInTheDocument();
        expect(tooltip.parentNode?.previousSibling?.nodeName).toBe('svg');
        expect(tooltip.parentNode?.parentNode).toHaveStyle({
          userSelect: 'none',
          position: 'relative',
        });
        expect(tooltip.parentNode).toHaveStyle({ visibility: 'hidden' });
      }
    });

    const createTxButton = screen.getByRole('button', {
      name: /Create Transaction/i,
    });
    expect(createTxButton).toBeInTheDocument();
  });

  describe('CreateAsset', () => {
    it('Should render the CreateAsset Form case is TOKEN', () => {
      formProps.sections = mockCreateAssetSection;
      renderWithTheme(
        <Form
          contractName={'CreateAssetContract'}
          key={'CreateAssetContract'}
          showForm={true}
          {...formProps}
        />,
      );

      mockCreateAssetSection.forEach(section => {
        if (section?.title) {
          const title = screen.getAllByText(section.title)[0];
          expect(title).toBeInTheDocument();
          expect(title.parentNode).toHaveStyle(sectionTitleStyle);
        }
        if (section?.tooltip) {
          const titleTooltip = screen.getByText(section.tooltip);
          expect(titleTooltip).toBeInTheDocument();
        }

        if (section.title === 'Uris') {
          section.fields.forEach(field => {
            if (field.props?.array && field?.innerSection) {
              field.fields.forEach(innerField => {
                const label = screen.getAllByText(innerField.label);
                expect(label[0]).toBeInTheDocument();

                if (innerField?.props && innerField?.props?.tooltip) {
                  const tooltip = screen.getByText(innerField.props.tooltip);
                  expect(tooltip).toBeInTheDocument();
                }
              });
            }
          });
        } else {
          section.fields.forEach(field => {
            const label = screen.getAllByText(field.label);
            expect(label[0]).toBeInTheDocument();
            expect(label[0].parentNode?.parentNode).toHaveStyle(
              formSectionStyle,
            );

            if (
              field?.props &&
              field?.props?.tooltip &&
              field.label !== 'Add Roles'
            ) {
              const tooltip = screen.getByText(field.props.tooltip);
              expect(tooltip).toBeInTheDocument();
              expect(tooltip.parentNode?.previousSibling?.nodeName).toBe('svg');
              expect(tooltip.parentNode).toHaveStyle({ visibility: 'hidden' });
            }
          });
        }
      });
    });

    it('Should add URI field when click on "Add" Button', async () => {
      formProps.sections = mockCreateAssetSection;
      const user = userEvent.setup();

      renderWithTheme(
        <Form
          contractName={'CreateAssetContract'}
          key={'CreateAssetContract'}
          showForm={true}
          {...formProps}
        />,
      );

      const urisTitle = screen.getByText('Uris');
      expect(urisTitle).toBeInTheDocument();

      const addUri = screen.getAllByRole('button', { name: /Add/i })[0];
      await user.click(addUri);

      const newLabelField = screen.getByText(uriLabelPhrase);
      const newAddressField = screen.getByText(uriAddressPhrase);

      expect(newLabelField).toBeInTheDocument();
      expect(newAddressField).toBeInTheDocument();
      await user.click(addUri);

      expect(screen.getAllByText(uriLabelPhrase).length).toBe(2);
      expect(screen.getAllByText(uriAddressPhrase).length).toBe(2);
    });

    it('Should remove URI field when click on "Remove" button', async () => {
      formProps.sections = mockCreateAssetSection;
      const user = userEvent.setup();

      renderWithTheme(
        <Form
          contractName={'CreateAssetContract'}
          key={'CreateAssetContract'}
          showForm={true}
          {...formProps}
        />,
      );

      const urisTitle = screen.getByText('Uris');
      expect(urisTitle).toBeInTheDocument();

      const addUri = screen.getAllByRole('button', { name: /Add/i })[0];
      await user.click(addUri);
      await user.click(addUri);
      await user.click(addUri);

      expect(screen.getAllByText(uriLabelPhrase).length).toBe(5);
      expect(screen.getAllByText(uriAddressPhrase).length).toBe(5);

      const removeUri = screen.getAllByRole('button', { name: /Remove/i })[0];

      await user.click(removeUri);
      await user.click(removeUri);
      await user.click(removeUri);
      await user.click(removeUri);

      expect(screen.getAllByText(uriLabelPhrase).length).toBe(1);
      expect(screen.getAllByText(uriAddressPhrase).length).toBe(1);
    });
  });

  it('Should render the Asset Trigger Contract form', () => {
    formProps.sections = mockAssetTriggerTx;

    renderWithTheme(
      <Form
        contractName={'AssetTriggerContract'}
        key={'AssetTriggerContract'}
        showForm={true}
        {...formProps}
      />,
    );

    const title = screen.getByText('Roles');
    const address = screen.getByText('Address');
    const hasRoleMint = screen.getByText('Has Role Mint');
    const hasRoleSetITOPrices = screen.getByText('Has Role Set ITO Prices');

    const hasRoleMintDefaultValue =
      hasRoleMint.nextSibling?.firstChild?.nextSibling?.firstChild;
    const hasRoleSetITOPricesDefaultValue =
      hasRoleSetITOPrices.nextSibling?.firstChild?.nextSibling?.firstChild;

    expect(title).toBeInTheDocument();
    expect(title).toBeVisible();
    expect(address).toBeInTheDocument();
    expect(address).toBeVisible();
    expect(hasRoleMint).toBeInTheDocument();
    expect(hasRoleMint).toBeVisible();
    expect(hasRoleSetITOPrices).toBeInTheDocument();
    expect(hasRoleSetITOPrices).toBeVisible();

    expect(hasRoleMintDefaultValue).toHaveProperty('value', 'true');
    expect(hasRoleSetITOPricesDefaultValue).toHaveProperty('value', 'true');
  });

  it('Should render the Transfer Contract form and click to show "Advanced Options"', async () => {
    const user = userEvent.setup();
    formProps.sections = mockTransferContract;

    renderWithTheme(
      <Form
        contractName={'TransferContract'}
        key={'TransferContract'}
        showForm={true}
        {...formProps}
      />,
    );
    const transferText = screen.getByText('Amount');
    const receiverAddress = screen.getByText('Receiver Address');
    const advancedOptions = screen.getByText('Advanced Options');
    const createTxButton = screen.getByRole('button', {
      name: /Create Transaction/i,
    });

    expect(advancedOptions).toBeInTheDocument();
    expect(advancedOptions).toBeVisible();
    expect(transferText).toBeInTheDocument();
    expect(receiverAddress).toBeInTheDocument();
    expect(transferText).toBeVisible();
    expect(receiverAddress).toBeVisible();

    expect(createTxButton.previousSibling?.firstChild).toHaveTextContent(
      'Advanced Options',
    );

    await user.click(advancedOptions.parentElement as any);
    await waitFor(() => {
      expect(screen.getByText('Is Multisig?')).toBeInTheDocument();
      expect(screen.getByText('Show payload?')).toBeInTheDocument();
    });
  });

  it('Should not render Form when the sections are empty', () => {
    formProps.sections = [];

    const { container } = renderWithTheme(
      <Form
        contractName={'TransferContract'}
        key={'TransferContract'}
        showForm={true}
        {...formProps}
      />,
    );

    expect(container.firstChild?.childNodes).toHaveLength(0);
  });

  describe('Advanced Options', () => {
    it('Should render the options correctly and the default values be false for "is multisig" and "show payload"', async () => {
      const user = userEvent.setup();
      formProps.sections = mockTransferContract;

      renderWithTheme(
        <Form
          contractName={'TransferContract'}
          key={'TransferContract'}
          showForm={true}
          {...formProps}
        />,
      );
      const advancedOptions = screen.getByText('Advanced Options');
      await user.click(advancedOptions.parentElement as any);

      const data = screen.getByText('Data');
      const isMultsig = screen.getByText('Is Multisig?');
      const showPayload = screen.getByText('Show payload?');

      const isMultsigValue =
        isMultsig.nextSibling?.firstChild?.nextSibling?.firstChild;
      const showPayloadValue =
        showPayload.nextSibling?.firstChild?.nextSibling?.firstChild;

      expect(data).toBeInTheDocument();
      expect(isMultsig).toBeInTheDocument();
      expect(showPayload).toBeInTheDocument();
      expect(data).toBeVisible();
      expect(isMultsig).toBeVisible();
      expect(showPayload).toBeVisible();

      expect(isMultsigValue).toHaveProperty('value', 'false');
      expect(showPayloadValue).toHaveProperty('value', 'false');
    });

    it('Should change the value of each field when click ( opposite value )', async () => {
      const user = userEvent.setup();
      formProps.sections = mockTransferContract;

      renderWithTheme(
        <Form
          contractName={'anyValue'}
          key={'anyValue'}
          showForm={true}
          {...formProps}
        />,
      );
      const advancedOptions = screen.getByText('Advanced Options');
      await user.click(advancedOptions.parentElement as any);

      const isMultsigInput = screen.getAllByRole('checkbox')[0];
      const showPayloadInput = screen.getAllByRole('checkbox')[1];
      const dataInput =
        screen.getByText('Is Multisig?').parentNode?.previousSibling?.firstChild
          ?.nextSibling;

      expect(isMultsigInput).not.toBeChecked();
      expect(showPayloadInput).not.toBeChecked();

      await user.click(isMultsigInput);
      await user.click(showPayloadInput);
      await user.type(dataInput as any, 'small text');

      await waitFor(() => {
        expect(isMultsigInput).toBeChecked();
        expect(showPayloadInput).toBeChecked();
        expect(dataInput).toHaveValue('small text');
      });
    });
  });
});
