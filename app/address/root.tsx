"use client";
import "./style.scss";
import * as Form from "@radix-ui/react-form";
import React, { useEffect } from "react";
import Modal, { modalStore } from "~components/CherryUI/Modal";
import CreateButton from "./createButton";
import { sanityClient } from "~base/sanity/client";
import { createAddress } from "~app/api/sanityRest/address";
import CherryTable from "~components/CherryUI/Table";
import useColumns from "./columns";

const Root = ({ addressList }: any) => {
  const [_addressList, setAddressList] = React.useState(addressList);
  const [column] = useColumns();

  const { setOpen } = modalStore();

  const objectResetter = (data: any) => {
    Object.entries(data).forEach(([key, value]) => {
      if (key.includes("-")) {
        const _word = /-(\S)/gim.exec(key)![1];

        const _key = key.replace(/-./g, _word.toLocaleUpperCase());
        data[_key] = value;
        delete data[key];
      }
    });

    return data;
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const data = Object.fromEntries(new FormData(event.currentTarget));

    const results = (await createAddress(data)).results.map(
      (item: any) => item.document
    );

    setOpen(false);
    if (data._id) {
      const newAddressList = [..._addressList].map((x) => {
        if (x._id === data._id) {
          x = data;
          return x;
        }
        return x;
      });
      setCacheToRedis(newAddressList);
      setAddressList([...newAddressList]);
      return;
    }

    setAddressList([..._addressList, ...results]);
  };

  const setCacheToRedis = (newAddressList: any) => {
    fetch(
      `https://apn1-stable-mako-33189.upstash.io/set/addressList/${JSON.stringify(
        newAddressList
      )}`,
      {
        headers: {
          Authorization:
            "Bearer AYGlACQgZTE0ZDY2MTYtNDBjZS00NTVkLTk5MjMtNjM0NmM5ZGU1YjcyYjRjYjJmNzgzNTMxNDUxNmE5NzJjOWIzYWNkNGM5OTA=",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => console.log(data));
  };

  return (
    <div className="address-container">
      <CreateButton title="添加地址" />
      <Modal>
        <FormDemo onSubmit={onSubmit} />
      </Modal>
      <section>
        <CherryTable<any>
          datasource={_addressList}
          columns={column}
          keyIndex={"_id"}
          status={"complete"}
        ></CherryTable>
      </section>
    </div>
  );
};

const FormDemo = ({
  onSubmit,
}: {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) => {
  const { record, setRecord, open } = modalStore();
  const formRef = React.useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!open) {
      formRef.current?.reset();
      setRecord({});
    }
  }, [open]);

  return (
    <Form.Root
      className="FormRoot"
      // defaultValue={record}
      ref={formRef}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(event);
      }}
    >
      <Form.Field className="FormField hidden" name="_id">
        <div className="mb-2">
          <Form.Label className="block text-sm font-medium text-gray-900">
            id
          </Form.Label>
        </div>
        <Form.Control asChild>
          <input type="text" id="_id" name="_id" defaultValue={record?._id} />
        </Form.Control>
      </Form.Field>
      <Form.Field className="FormField" name="name">
        <div className="mb-2">
          <Form.Label className="block text-sm font-medium text-gray-900">
            名字
          </Form.Label>
        </div>
        <Form.Control asChild>
          <input
            type="text"
            autoComplete="name"
            id="name"
            name="name"
            defaultValue={record?.name}
          />
        </Form.Control>
      </Form.Field>
      <div className="flex flex-row justify-between">
        <Form.Field className="FormField w-2/5" name="familyName">
          <div className="mb-2">
            <Form.Label className="block text-sm font-medium text-gray-900">
              姓氏
            </Form.Label>
          </div>
          <Form.Control asChild>
            <input
              type="text"
              autoComplete="family-name"
              id="familyName"
              name="familyName"
              defaultValue={record?.familyName}
            />
          </Form.Control>
        </Form.Field>

        <Form.Field className="FormField w-2/5" name="givenName">
          <div className="mb-2">
            <Form.Label className="block text-sm font-medium text-gray-900">
              姓名
            </Form.Label>
          </div>
          <Form.Control asChild>
            <input
              type="text"
              autoComplete="given-name"
              id="givenName"
              name="givenName"
              defaultValue={record?.givenName}
            />
          </Form.Control>
        </Form.Field>
      </div>

      <Form.Field className="FormField" name="email">
        <div className="mb-2">
          <Form.Label className="block text-sm font-medium text-gray-900">
            邮箱
          </Form.Label>
        </div>
        <Form.Control asChild>
          <input
            type="text"
            autoComplete="email"
            id="email"
            name="email"
            defaultValue={record?.email}
          />
        </Form.Control>
      </Form.Field>
      <Form.Field className="FormField" name="country">
        <div className="mb-2">
          <Form.Label className="block text-sm font-medium text-gray-900">
            国家
          </Form.Label>
        </div>
        <Form.Control asChild>
          <input
            type="text"
            autoComplete="country"
            id="country"
            name="country"
            defaultValue={record?.country}
          />
        </Form.Control>
      </Form.Field>
      <Form.Field className="FormField" name="addressLine1">
        <div>
          <Form.Label className="block text-sm font-medium text-gray-900">
            第一行地址
          </Form.Label>
        </div>
        <Form.Control asChild>
          <input
            className="Input"
            type="text"
            autoComplete="shipping address-line1"
            id="addressLine1"
            name="addressLine1"
            defaultValue={record?.addressLine1}
          />
        </Form.Control>
      </Form.Field>
      <Form.Field className="FormField" name="addressLine2">
        <div>
          <Form.Label className="block text-sm font-medium text-gray-900">
            第二行地址
          </Form.Label>
        </div>
        <Form.Control asChild>
          <input
            className="Input"
            type="text"
            autoComplete="shipping address-line2"
            id="addressLine2"
            name="addressLine2"
            defaultValue={record?.addressLine2}
          />
        </Form.Control>
      </Form.Field>
      <Form.Field className="FormField" name="addressLevel1">
        <div>
          <Form.Label className="block text-sm font-medium text-gray-900">
            州
          </Form.Label>
        </div>
        <Form.Control asChild>
          <input
            className="Input"
            type="text"
            autoComplete="address-level1"
            id="addressLevel1"
            name="addressLevel1"
            defaultValue={record?.addressLevel1}
          />
        </Form.Control>
      </Form.Field>
      <Form.Field className="FormField" name="addressLevel2">
        <div>
          <Form.Label className="block text-sm font-medium text-gray-900">
            地区
          </Form.Label>
        </div>
        <Form.Control asChild>
          <input
            className="Input"
            type="text"
            autoComplete="address-level2"
            id="addressLevel2"
            name="addressLevel2"
            defaultValue={record?.addressLevel2}
          />
        </Form.Control>
      </Form.Field>
      <Form.Field className="FormField" name="postalCode">
        <div>
          <Form.Label className="block text-sm font-medium text-gray-900">
            邮编
          </Form.Label>
        </div>
        <Form.Control asChild>
          <input
            className="Input"
            type="text"
            autoComplete="postal-code"
            id="postalCode"
            name="postalCode"
            defaultValue={record?.postalCode}
          />
        </Form.Control>
      </Form.Field>
      <Form.Field className="FormField" name="tel">
        <div>
          <Form.Label className="block text-sm font-medium text-gray-900">
            手机号
          </Form.Label>
        </div>
        <Form.Control asChild>
          <input
            className="Input"
            type="text"
            autoComplete="shipping tel"
            id="tel"
            name="tel"
            defaultValue={record?.tel}
          />
        </Form.Control>
      </Form.Field>

      {/* <Form.Field className="FormField" name="question">
      <div
       
      >
        <Form.Label className="block text-sm font-medium text-gray-900">Question</Form.Label>
        <Form.Message className="FormMessage" match="valueMissing">
          Please enter a question
        </Form.Message>
      </div>
      <Form.Control asChild>
        <textarea className="Textarea"  />
      </Form.Control>
    </Form.Field> */}
      <Form.Submit asChild>
        <button className="Button" style={{ marginTop: 10 }}>
          提交
        </button>
      </Form.Submit>
    </Form.Root>
  );
};

export default Root;
