import { Drawer, Image } from "antd";
import { create } from "zustand";
import { useState } from "react";
import { IOrder } from "~types/order";

export const drawStore = create<{
  drawOpen: boolean;
  drawInfo: IOrder["orderItems"];
  setDrawOpen: (value: boolean) => void;
  setDrawInfo: (value: IOrder["orderItems"]) => void;
}>()((set) => ({
  drawOpen: false,
  drawInfo: [],
  setDrawOpen: (value: boolean) => set({ drawOpen: value }),
  setDrawInfo: (value: IOrder["orderItems"]) => set({ drawInfo: value }),
}));

const OrderProductionDrawer = () => {
  const [visible, setVisible] = useState(false);
  const { drawInfo, setDrawInfo, drawOpen, setDrawOpen } = drawStore();
  console.log(drawInfo, "!!!!");

  return (
    <>
      <Drawer
        title="商品预览"
        placement="right"
        onClose={() => setDrawOpen(false)}
        width="70%"
        open={drawOpen}
        forceRender
      >
        <h2 className="text-2xl font-bold text-gray-700">商品列表</h2>
        <div className="flex flex-col">
          {drawOpen &&
            drawInfo?.map((item, index) => {
              const { sku, quantity } = item;

              return (
                <section key={item._id}>
                  <h3 className="text-lg font-bold text-green-700 my-4">{`${sku.spu.name} - [${sku.color}] - [${sku.size}] × ${quantity}`}</h3>
                  <article className="flex flex-row">
                    {sku.spu.imageURLs?.map((image, index) => (
                      <div
                        className="mr-2 flex flex-row rounded-md overflow-hidden"
                        key={image.asset._id}
                      >
                        <Image
                          rootClassName="object-cover"
                          width={120}
                          height={120}
                          alt="Preview Image"
                          src={image?.asset?.url}
                        />
                      </div>
                    ))}
                  </article>
                </section>
              );
            })}
        </div>
      </Drawer>
    </>
  );
};

export default OrderProductionDrawer;
