import { useEffect, useState } from 'react';
import Select from 'react-select';
import { changeObject } from '../../utils';
import { contracts, options } from './contracts';

import { core, sendTransaction, TransactionType } from '@klever/sdk';
import { toast } from 'react-toastify';
import { getNonce, getType } from './utils';
import { formatLabel } from '../../utils/index';

import {
  AddButton,
  CompoundContainer,
  ContainerButtons,
  DivisorContainer,
  DivisorLine,
  FormContainer,
  InputContainer,
  InputMap,
  InputMapContainer,
  MapContainer,
  RepeatedContainer,
  SubFormContainer,
  SubmitButton,
  LoadingContainer,
  SelectContainer,
  MainContainer,
} from './styles';
import React from 'react';

interface ISigner {
  address: string;
  weight: number;
}

interface IRoles {
  address: string;
  hasRoleMint: boolean;
  hasRoleSetITOPrices: boolean;
}

interface ITransferPercentage {
  amount: number;
  percentage: number;
}

const ContractSpecific: React.FC<any> = () => {
  const [formSelected, setFormSelected] = useState<any>({});
  const [contractValues, setContractValues] = useState<any>({});
  const [repeatedElements, setRepeatedElements] = useState<any>({});
  const [packInfo, setPackInfo] = useState<any>([]);
  const [signers, setSigners] = useState<ISigner[][]>([]);
  const [roles, setRoles] = useState<IRoles[]>([]);
  const [transferPercentage, setTransferPercentage] = useState<
    ITransferPercentage[]
  >([]);
  const [mapValues, setMapValues] = useState({});
  const [selectedContractType, setSelectedContractType] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    setContractValues({ ...formSelected });
  }, [formSelected]);

  useEffect(() => {
    const values = { ...contractValues };
    changeObject(values, 'roles', roles);
    setContractValues({ ...values });
  }, [roles]);

  useEffect(() => {
    const values = { ...contractValues };
    changeObject(
      values,
      'transferPercentage',
      transferPercentage,
      '',
      'royalties',
    );
    setContractValues({ ...values });
  }, [transferPercentage]);

  const handleOption = (selectedOption: any) => {
    if (contracts[selectedOption.value]) {
      setSelectedContractType(selectedOption.value);
      setFormSelected(contracts[selectedOption.value]);
    }
  };

  const repeateElement = (
    obj: any,
    toFind: string,
    parent = '',
    lastParent = '',
  ) => {
    Object.keys(obj).map(item => {
      if (item === toFind && lastParent === parent) {
        const patternValue = obj[item][0];
        obj[item].push(patternValue);
      }
      if (parent !== '') {
        if (typeof obj[item] === 'object' && !obj[item].length) {
          repeateElement(obj[item], toFind, parent, item);
        }
      }
    });

    return;
  };

  const removeElement = (
    obj: any,
    toFind: string,
    parent = '',
    lastParent = '',
  ) => {
    Object.keys(obj).map(item => {
      if (item === toFind && lastParent === parent) {
        if (obj[item].length > 1) {
          obj[item].pop();
        }
      }
      if (parent !== '') {
        if (typeof obj[item] === 'object' && !obj[item].length) {
          removeElement(obj[item], toFind, parent, item);
        }
      }
    });

    return;
  };

  const changeValueInIndex = (
    obj: any,
    value: any,
    key: any,
    index: number,
    parent: string,
  ) => {
    Object.keys(obj).map(item => {
      if (item === parent) {
        obj[item][index][key] = value;
        return;
      } else {
        if (typeof obj[item] === 'object' && !obj[item].length) {
          changeValueInIndex(obj[item], value, key, index, parent);
        }
      }
    });

    return;
  };

  const renderRoles = () => {
    return (
      <RepeatedContainer>
        <b>Roles</b>

        {roles.map((item: any, index: number) => {
          return (
            <>
              <InputContainer isCheckbox={false}>
                <label>address</label>
                <input
                  type={'text'}
                  onChange={e => {
                    const newRoles: IRoles[] = [...roles];
                    newRoles[index].address = e.target.value;
                    setRoles([...newRoles]);
                  }}
                />
              </InputContainer>
              <InputContainer isCheckbox>
                <label>hasRoleMint</label>
                <input
                  type={'checkbox'}
                  onChange={e => {
                    const newRoles: IRoles[] = [...roles];
                    newRoles[index].hasRoleMint = e.target.checked;
                    setRoles([...newRoles]);
                  }}
                />
              </InputContainer>
              <InputContainer isCheckbox>
                <label>hasRoleSetITOPrices</label>
                <input
                  type={'checkbox'}
                  onChange={e => {
                    const newRoles: IRoles[] = [...roles];
                    newRoles[index].hasRoleSetITOPrices = e.target.checked;
                    setRoles([...newRoles]);
                  }}
                />
              </InputContainer>
            </>
          );
        })}

        <ContainerButtons>
          <AddButton
            onClick={() => {
              const newRoles: IRoles[] = [...roles];
              newRoles.push({
                address: '',
                hasRoleMint: false,
                hasRoleSetITOPrices: false,
              });
              setRoles([...newRoles]);
            }}
          >
            ADD
          </AddButton>
          <AddButton
            onClick={() => {
              const newRoles: IRoles[] = [...roles];
              newRoles.pop();
              setRoles([...newRoles]);
            }}
          >
            REMOVE
          </AddButton>
        </ContainerButtons>
      </RepeatedContainer>
    );
  };

  const renderTransferPercentage = () => {
    return (
      <RepeatedContainer>
        <b>Transfer Percentage</b>

        {transferPercentage.map((item: any, index: number) => {
          return (
            <>
              <InputContainer isCheckbox={false}>
                <label>amount</label>
                <input
                  type={'number'}
                  onChange={e => {
                    const transfer: ITransferPercentage[] = [
                      ...transferPercentage,
                    ];
                    transfer[index].amount = Number(e.target.value);
                    setTransferPercentage([...transfer]);
                  }}
                />
              </InputContainer>
              <InputContainer isCheckbox={false}>
                <label>percentage</label>
                <input
                  type={'number'}
                  onChange={e => {
                    const transfer: ITransferPercentage[] = [
                      ...transferPercentage,
                    ];
                    transfer[index].percentage = Number(e.target.value);
                    setTransferPercentage([...transfer]);
                  }}
                />
              </InputContainer>
            </>
          );
        })}

        <ContainerButtons>
          <AddButton
            onClick={() => {
              const transfer: ITransferPercentage[] = [...transferPercentage];
              transfer.push({
                amount: 0,
                percentage: 0,
              });
              setTransferPercentage([...transfer]);
            }}
          >
            ADD
          </AddButton>
          <AddButton
            onClick={() => {
              const transfer: ITransferPercentage[] = [...transferPercentage];
              transfer.pop();
              setTransferPercentage([...transfer]);
            }}
          >
            REMOVE
          </AddButton>
        </ContainerButtons>
      </RepeatedContainer>
    );
  };

  const renderRepeated = (fields: any, parent: string, grandparent: string) => {
    return (
      <RepeatedContainer>
        <b>{parent ? formatLabel(parent) : ''}</b>

        {fields?.map((item: any, index: number) => {
          return (
            <>
              {renderCompound(item, parent, true, index, grandparent)}
              {fields.length > 1 && index !== fields.length - 1 && (
                <DivisorContainer>
                  <DivisorLine />
                </DivisorContainer>
              )}
            </>
          );
        })}

        <ContainerButtons>
          <AddButton
            onClick={() => {
              const values = { ...contractValues };
              repeateElement(values, parent, grandparent);
              setContractValues({ ...values });
            }}
          >
            ADD
          </AddButton>
          <AddButton
            onClick={() => {
              const values = { ...contractValues };
              removeElement(values, parent, grandparent);
              setContractValues({ ...values });
            }}
          >
            REMOVE
          </AddButton>
        </ContainerButtons>
      </RepeatedContainer>
    );
  };

  const renderURIs = (label: string, field: any, parent: string) => {
    const mapsInputs = { ...mapValues };

    if (!mapsInputs[label]) {
      mapsInputs[label] = {};
      mapsInputs[label]['parent'] = parent;
      mapsInputs[label]['values'] = [{}];
      setMapValues({ ...mapsInputs });
    }

    return (
      <MapContainer>
        <b>{label}</b>
        {mapsInputs[label].values.map((item: any, index: number) => {
          return (
            <InputMapContainer key={String(index)}>
              <InputMap
                type="text"
                onChange={e => {
                  const input = e.target.value;
                  const obj = mapsInputs[label]['values'][index];
                  if (Object.keys(obj).length === 0) {
                    obj[input] = '';
                  } else {
                    delete Object.assign(obj, {
                      [input]: obj[Object.keys(obj)[0]],
                    })[Object.keys(obj)[0]];
                  }

                  setMapValues({ ...mapsInputs });
                }}
              />
              <InputMap
                type="text"
                onChange={e => {
                  const input = e.target.value;
                  const obj = mapsInputs[label]['values'][index];

                  if (Object.keys(obj).length === 0) {
                    obj[''] = input;
                  } else {
                    obj[Object.keys(obj)[0]] = input;
                  }

                  setMapValues({ ...mapsInputs });
                }}
              />
            </InputMapContainer>
          );
        })}
        <ContainerButtons>
          <AddButton
            onClick={() => {
              const mapsInputs = { ...mapValues };
              mapsInputs[label]['values'].push({});
              setMapValues({ ...mapsInputs });
            }}
          >
            ADD
          </AddButton>
          {mapValues[label]?.values?.length > 1 && (
            <AddButton
              onClick={() => {
                const mapsInputs = { ...mapValues };
                mapsInputs[label]['values'].pop();
                setMapValues({ ...mapsInputs });
              }}
            >
              REMOVE
            </AddButton>
          )}
        </ContainerButtons>
      </MapContainer>
    );
  };

  const renderPackInfo = () => {
    const packInfoGroup = [...packInfo];

    return (
      <CompoundContainer>
        <b>PackInfo</b>
        {packInfo.map((item: any, index: number) => {
          return (
            <>
              <InputContainer isCheckbox={false}>
                <label>PackInfo Label</label>
                <input
                  type={'text'}
                  onChange={e => {
                    const input = e.target.value;
                    const obj = packInfoGroup[index];
                    if (Object.keys(obj).length === 0) {
                      obj[input] = { PackItem: [] };
                    } else {
                      delete Object.assign(obj, {
                        [input]: obj[Object.keys(obj)[0]],
                      })[Object.keys(obj)[0]];
                    }
                    setPackInfo([...packInfoGroup]);
                  }}
                />
                <CompoundContainer>
                  <b>Packs</b>
                  {packInfo[index][
                    Object.keys(packInfo[index])[0]
                  ]?.PackItem?.map((item: any, index2: number) => {
                    return (
                      <>
                        <InputContainer isCheckbox={false}>
                          <label>Amount</label>
                          <input
                            type={'number'}
                            onChange={e => {
                              const input = Number(e.target.value);
                              const packsInfos = [...packInfo];
                              const obj =
                                packsInfos[index][
                                  Object.keys(packInfo[index])[0]
                                ]?.PackItem[index2];

                              if (Object.keys(obj).length === 0) {
                                obj[input] = '';
                              } else {
                                delete Object.assign(obj, {
                                  [input]: obj[Object.keys(obj)[0]],
                                })[Object.keys(obj)[0]];
                              }

                              setPackInfo([...packsInfos]);
                            }}
                          />
                        </InputContainer>
                        <InputContainer isCheckbox={false}>
                          <label>Price</label>
                          <input
                            type={'number'}
                            onChange={e => {
                              const input = Number(e.target.value);
                              const packsInfos = [...packInfo];

                              const obj =
                                packsInfos[index][
                                  Object.keys(packInfo[index])[0]
                                ]?.PackItem[index2];

                              if (Object.keys(obj).length === 0) {
                                obj[''] = input;
                              } else {
                                obj[Object.keys(obj)[0]] = input;
                              }

                              setPackInfo([...packsInfos]);
                            }}
                          />
                        </InputContainer>
                      </>
                    );
                  })}
                  <ContainerButtons>
                    <AddButton
                      onClick={() => {
                        const packsInfos = [...packInfo];
                        packsInfos[index][
                          Object.keys(packInfo[index])[0]
                        ]?.PackItem?.push({});
                        setPackInfo([...packsInfos]);
                      }}
                    >
                      ADD
                    </AddButton>
                    <AddButton
                      onClick={() => {
                        const packsInfos = [...packInfo];
                        packsInfos[index][
                          Object.keys(packInfo[index])[0]
                        ]?.PackItem?.pop();
                        setPackInfo([...packsInfos]);
                      }}
                    >
                      REMOVE
                    </AddButton>
                  </ContainerButtons>
                </CompoundContainer>
              </InputContainer>
            </>
          );
        })}
        <ContainerButtons>
          <AddButton
            onClick={() => {
              const packsInfos = [...packInfo];
              packsInfos.push({});
              setPackInfo(packsInfos);
            }}
          >
            ADD
          </AddButton>
          <AddButton
            onClick={() => {
              const packsInfos = [...packInfo];
              packsInfos.pop();
              setPackInfo(packsInfos);
            }}
          >
            REMOVE
          </AddButton>
        </ContainerButtons>
      </CompoundContainer>
    );
  };

  const renderSigners = (index: number) => {
    const signersArr = [...signers];

    if (!signersArr[index]) {
      signersArr[index] = [];
      setSigners([...signersArr]);
    }

    return (
      <CompoundContainer>
        <b>Signer</b>
        {signers.length > 0 &&
          signers[index]?.length > 0 &&
          signers[index].map((item: ISigner, index2: number) => {
            return (
              <>
                <InputContainer isCheckbox={false}>
                  <label>Address</label>
                  <input
                    type={'text'}
                    onChange={e => {
                      signers[index][index2].address = e.target.value;
                    }}
                  />
                </InputContainer>
                <InputContainer isCheckbox={false}>
                  <label>Weight</label>
                  <input
                    type={'number'}
                    onChange={e => {
                      signers[index][index2].weight = Number(e.target.value);
                    }}
                  />
                </InputContainer>
              </>
            );
          })}
        <ContainerButtons>
          <AddButton
            onClick={() => {
              const signersArr = [...signers];
              signersArr[index].push({ address: '', weight: 0 });
              setSigners([...signersArr]);
            }}
          >
            ADD
          </AddButton>
          <AddButton
            onClick={() => {
              const signersArr = [...signers];
              signersArr[index].pop();
              setSigners([...signersArr]);
            }}
          >
            REMOVE
          </AddButton>
        </ContainerButtons>
      </CompoundContainer>
    );
  };

  const renderCompound = (
    fields: any,
    parent?: string,
    isRepeated = false,
    index?: number,
    grandparent?: string,
  ) => {
    return (
      <>
        {parent && !isRepeated && <b>{formatLabel(parent)}</b>}
        <SubFormContainer>
          {Object.keys(fields).map(item => {
            if (item === 'packInfo') {
              return renderPackInfo();
            } else if (item === 'uris' || item === 'parameters') {
              return renderURIs(item, fields[item], parent ? parent : '');
            } else if (item === 'signers') {
              if (!isNaN(Number(index)) && typeof index !== 'undefined') {
                return renderSigners(index);
              }
            }

            let type = 'text';

            if (item === 'roles') {
              return renderRoles();
            } else if (item === 'transferPercentage') {
              return renderTransferPercentage();
            }

            if (typeof fields[item] === 'string') {
              type = 'text';
            } else if (typeof fields[item] === 'number') {
              type = 'number';
            } else if (typeof fields[item] === 'boolean') {
              type = 'checkbox';
            } else if (typeof fields[item]?.length === 'number') {
              if (parent) {
                return renderRepeated(fields[item], item, parent);
              } else {
                return renderRepeated(fields[item], item, '');
              }
            }

            return (
              <React.Fragment key={String(item)}>
                {typeof fields[item] === 'object' ? (
                  <CompoundContainer>
                    {renderCompound(fields[item], item)}
                  </CompoundContainer>
                ) : (
                  <InputContainer isCheckbox={type === 'checkbox'}>
                    <label>{formatLabel(item)}</label>
                    <input
                      type={type}
                      onChange={e => {
                        if (!isRepeated) {
                          const values = { ...contractValues };
                          changeObject(
                            values,
                            item,
                            type === 'checkbox'
                              ? Boolean(e.target.checked)
                              : e.target.value,
                            '',
                            parent,
                          );
                          setContractValues({ ...values });
                        } else if (
                          !isNaN(Number(index)) &&
                          typeof index !== 'undefined'
                        ) {
                          const values = { ...repeatedElements };

                          if (parent && !values[parent]) {
                            values[parent] = {};
                            if (grandparent) {
                              values[parent]['parent'] = grandparent;
                            }
                            values[parent]['values'] = [];
                          }

                          if (parent && !values[parent]['values'][index]) {
                            values[parent]['values'][index] = {};
                          }

                          if (parent) {
                            if (type === 'checkbox') {
                              values[parent]['values'][index][item] =
                                e.target.checked;
                            } else if (type === 'text') {
                              values[parent]['values'][index][item] =
                                e.target.value;
                            } else if (type == 'number') {
                              values[parent]['values'][index][item] = Number(
                                e.target.value,
                              );
                            }
                          }

                          setRepeatedElements({ ...values });
                        }
                      }}
                    />
                  </InputContainer>
                )}
              </React.Fragment>
            );
          })}
        </SubFormContainer>
      </>
    );
  };

  const generateJSON = () => {
    const values = { ...contractValues };
    const rep = { ...repeatedElements };
    const mapInputs = { ...mapValues };

    Object.keys(rep).map((item: any) => {
      changeObject(values, item, rep[item].values, '', rep[item].parent);
    });

    Object.keys(mapInputs).map((item: any) => {
      const obj = {};
      if (mapInputs[item].values.length > 0) {
        mapInputs[item].values.map((item: any) => {
          Object.assign(obj, obj, item);
        });
      }

      changeObject(values, item, obj, '', mapInputs[item].parent);
    });

    if (packInfo.length > 0) {
      const obj = {};

      packInfo.forEach((item: any) => {
        if (Object.keys(item).length > 0) {
          Object.assign(obj, obj, item);
        }
      });

      changeObject(values, 'packInfo', obj, '', '');
    }

    if (signers.length > 0) {
      if (values.Permissions) {
        values.Permissions.map((item: any, index: number) => {
          item.Signers = signers[index];
        });
      }
    }

    setContractValues({ ...values });
  };

  const handleSubmit = async () => {
    generateJSON();

    const walletAddress = sessionStorage.getItem('walletAddress');
    const nonce = await getNonce(walletAddress || '');
    const payload = {
      sender: walletAddress,
      nonce,
      ...contractValues,
    };

    setLoading(true);
    try {
      const unsignedTx = await sendTransaction(
        getType(selectedContractType),
        payload,
        {
          autobroadcast: false,
        },
      );

      const signature = await window.klever.sign(unsignedTx[0]);

      unsignedTx[0].Signature = [signature];
      const response = await core.broadcastTransactions(
        JSON.stringify(unsignedTx),
      );
      setLoading(false);
      setTxHash(response.txHashes[0]);
      toast.success('Transaction broadcast successfully');
    } catch (e: any) {
      setLoading(false);

      toast.error(e.message);
    }
  };

  const showForm =
    (Object.keys(formSelected).length !== 0 ||
      selectedContractType === 'UnjailContract') &&
    !loading;

  return (
    <>
      <MainContainer>
        <SelectContainer>
          <Select options={options} onChange={handleOption} />
        </SelectContainer>
        {showForm && (
          <FormContainer>
            <>
              {renderCompound(formSelected)}
              <SubmitButton>
                <div onClick={() => handleSubmit()}>Create Transaction</div>
              </SubmitButton>
            </>
          </FormContainer>
        )}
        {loading && !txHash && <LoadingContainer>Loading...</LoadingContainer>}
        {txHash && (
          <a
            href={`https://kleverscan.org/transaction/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            https://kleverscan.org/transaction/{txHash}
          </a>
        )}
      </MainContainer>
    </>
  );
};

export default ContractSpecific;
