"use client";

import { DatePicker } from "antd";
import { DatePickerType } from "antd/es/date-picker";
import locale from "antd/es/date-picker/locale/zh_CN";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

export const YearPicker = ({
  year,
  month,
  className = "",
}: {
  year: string;
  month: string;
  className?: string;
}) => {
  const router = useRouter();
  return (
    <div className={className}>
      {!month && (
        <DatePicker
          locale={locale}
          defaultValue={dayjs(year)}
          placeholder="请选择年份"
          picker="year"
          value={dayjs(year)}
          onChange={(d: dayjs.Dayjs | null, v: string) => {
            const _year = d?.year();
            if (_year) {
              router.push(`/brandOrder?year=${d?.year()}`);
              return;
            }

            router.push(`/brandOrder`);
          }}
        />
      )}
    </div>
  );
};

export const MonthPicker = ({
  year,
  month,
  className = "",
}: {
  year?: string;
  month: string;
  className?: string;
}) => {
  const router = useRouter();
  return (
    <div className={className}>
      <DatePicker
        locale={locale}
        placeholder="请选择月份"
        picker="month"
        onChange={(d: dayjs.Dayjs | null, v: string) => {
          const _year = d?.year();
          if (_year) {
            router.push(`/order?year=${d?.year()}`);
            return;
          }

          router.push(`/order`);
        }}
      />
    </div>
  );
};

export const DateRangePicker = ({
  className = "",
  onChange,
}: {
  className?: string;
  onChange: (evt: any) => void;
}) => {
  const router = useRouter();
  return (
    <div className={className}>
      <DatePicker.RangePicker
        size="small"
        locale={locale}
        onChange={onChange}
      />
      {/* {!month && (
        <DatePicker
          locale={locale}
          defaultValue={dayjs(year)}
          placeholder="请选择年份"
          picker="year"
          value={dayjs(year)}
          onChange={(d: dayjs.Dayjs | null, v: string) => {
            const _year = d?.year();
            if (_year) {
              router.push(`/brandOrder?year=${d?.year()}`);
              return;
            }

            router.push(`/brandOrder`);
          }}
        />
      )} */}
    </div>
  );
};
