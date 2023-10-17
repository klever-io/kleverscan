import api from '@/services/api';
import { parseValidators } from '@/utils/parseValues';

export const validatorsCall = async (pageParam = 1): Promise<any> => {
  try {
    const validatorsResponse = await api.get({
      route: 'validator/list',
      query: { sort: 'elected', page: pageParam },
    });

    if (!validatorsResponse.error) {
      validatorsResponse.data.validators =
        validatorsResponse.data.validators.filter(
          (e: any) => e.list !== 'jailed' || e.list !== 'inactive',
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
