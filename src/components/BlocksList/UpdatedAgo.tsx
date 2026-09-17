import { getAge } from '@/utils/timeFunctions';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';
import { UpdatedNote } from './styles';

/**
 * How old the figures above are. In its own module rather than inside the
 * card, which is the mistake this page used to make: a component built in a
 * render body is a new type on every render, so React remounts it and the
 * interval restarts from zero.
 *
 * `at` is when the data arrived, not when the page opened, so the line counts
 * the age of the figures rather than the time spent looking at them.
 */
const UpdatedAgo: React.FC<{ at: number }> = ({ at }) => {
  const { t } = useTranslation(['common']);
  const [age, setAge] = useState(() => (at ? getAge(new Date(at)) : ''));

  useEffect(() => {
    // Recomputed on every `at`, so fresh data resets the count instead of
    // letting the previous fetch keep ageing.
    setAge(at ? getAge(new Date(at)) : '');
    if (!at) return;
    const id = setInterval(() => setAge(getAge(new Date(at))), 1000);
    return () => clearInterval(id);
  }, [at]);

  if (!age) return null;
  return (
    <UpdatedNote data-testid="blocks-updated-ago">
      {t('common:Cards.UpdatedAgo', {
        defaultValue: 'Updated {{age}} ago',
        age,
      })}
    </UpdatedNote>
  );
};

export default UpdatedAgo;
