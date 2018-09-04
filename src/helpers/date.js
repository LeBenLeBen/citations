import formatDate from 'date-fns/format';
import fr from 'date-fns/locale/fr';

export function format(date, format = 'D MMMM YYYY') {
  return formatDate(date, format, { locale: fr });
}
