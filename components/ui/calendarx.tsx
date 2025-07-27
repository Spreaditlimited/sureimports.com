import { useState } from 'react';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import CustomDatePicker from '@/components/CustomDatePicker.module.css';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

function Calendarx({ ...props }) {
  //const [value, onChange] = useState<Value>(new Date());

  return (
    <div>
      <DatePicker
        //className={'text-fuchsia-500 border: none !important;' + CustomDatePicker }
        // onChange={onChange}
        // value={value}
        {...props}
      />
    </div>
  );
}

export { Calendarx };
