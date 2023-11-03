import api from '@/services/api';
import { parseValidators } from '@/utils/parseValues';

export const validatorsCall = async (
  pageParam = 1,
  partialName = '',
): Promise<any> => {
  try {
    const validatorsResponse = await api.get({
      route: 'validator/list',
      query: { sort: 'elected', page: pageParam, name: partialName },
    });

    if (!validatorsResponse.error) {
      validatorsResponse.data.validators =
        validatorsResponse.data.validators.filter(
          (e: any) => e.list !== 'jailed',
        );
      const parsedValidators = parseValidators(validatorsResponse);

      return { ...validatorsResponse, data: { validators: parsedValidators } };
    } else {
      return validatorsResponse;
    }
  } catch (error) {
    console.error(error);
  }
};
