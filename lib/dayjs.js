import * as _dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';

const dayjs = _dayjs;
dayjs.extend(customParseFormat)

export { dayjs };
