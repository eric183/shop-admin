import { sanityMutationClient } from "~base/sanity/client";
import { v4 as uuidv4 } from "uuid";
import { IProduct } from "~types/product";

// create images
export const createSpuImages = async (
  matchSPUId: string,
  imagesCreations: any[]
) => {
  await sanityMutationClient({
    mutations: [
      {
        patch: {
          id: matchSPUId,
          set: {
            images: imagesCreations,
            // ...data,
          },
        },
      },
    ],
  });
};

export const createProduct = async (_formData_: any) => {
  const { name, category, brand, link, skus, images, inventory, _id } =
    _formData_;

  const spuId = _id ? _id : uuidv4();

  const mutations: any = [
    {
      createOrReplace: {
        _type: "spu",
        _id: spuId,
        name,
        category,
        brand,
        link,
        images,
      },
    },
  ];

  if (skus && skus.length > 0) {
    mutations.push(
      ...skus.map(({ _id, attribute, price }: any) => {
        const skuId = _id ? _id : uuidv4();
        const foundInventory = inventory.find((i: any) =>
          i.skus.find((x: any) => x?.id === skuId)
        );

        const inventoryId = foundInventory ? foundInventory._id : uuidv4();

        mutations.push({
          createOrReplace: {
            _type: "inventory",
            _id: inventoryId,
            spu: {
              _type: "reference",
              _ref: spuId,
            },
            skus: [
              {
                // _type: "reference",
                _key: uuidv4(),
                id: skuId,
              },
            ],
          },
        });
        return {
          createOrReplace: {
            _type: "sku",
            _id: skuId,
            spu: { _type: "spu", _ref: spuId },
            price,
            attribute: {
              color: attribute?.color,
              size: attribute?.size,
            },
          },
        };
      })
    );
  }

  const { results } = await sanityMutationClient({ mutations });
  return results;
};

export const updateProduct = async (spuId: string, formData: any, spu: any) => {
  const { skus, category, brand, link, images, name, inventory } = formData;
  const mutations: any = [
    {
      patch: {
        id: spu._id,
        set: {
          name,
          category,
          brand,
          link,
          images,
        },
      },
    },
  ];

  if (skus) {
    if (spu.skus.length > skus.length) {
      // delete
      const skuIds = skus.map((sku: { _id: any }) => sku._id!);

      const noSkuToDelete = spu.skus.filter((sku: { _id: any }) =>
        skuIds.includes(sku._id!)
      );
      const skuToDelete = spu.skus.filter(
        (sku: { _id: any }) => !skuIds.includes(sku._id!)
      );

      mutations.push(
        ...skuToDelete.map((sku: { _id: any }) => {
          const foundInventory = inventory?.find((i: any) =>
            i.skus.find((x: any) => x?.id === sku._id)
          );

          const inventoryId = foundInventory!._id;
          mutations.push({
            delete: {
              id: inventoryId,
            },
          });

          return {
            delete: {
              id: sku._id,
            },
          };
        })
      );
    } else {
      // create
      const skuIds = spu.skus.map((sku: { _id: any }) => sku._id);
      // const skuToCreate = skus.filter((sku) => !skuIds.includes(sku._id));
      mutations.push(
        ...skus.map(
          (sku: {
            _id: any;
            price: any;
            attribute: { color: any; size: any };
          }) => {
            const skuId = sku._id ? sku._id : uuidv4();
            const foundInventory = inventory?.find((i: any) =>
              i.skus.find((x: any) => x?.id === sku._id)
            );

            const inventoryId = foundInventory ? foundInventory._id : uuidv4();

            mutations.push({
              createOrReplace: {
                _type: "inventory",
                _id: inventoryId,
                spu: {
                  _type: "reference",
                  _ref: spuId,
                },
                skus: [
                  {
                    _key: uuidv4(),
                    id: skuId,
                  },
                ],
              },
            });
            return {
              createOrReplace: {
                _type: "sku",
                _id: skuId,
                spu: {
                  _type: "spu",
                  _ref: spu._id,
                },

                price: sku.price,
                attribute: {
                  color: sku.attribute?.color,
                  size: sku.attribute?.size,
                },
              },
            };
          }
        )
      );
    }
  }

  await sanityMutationClient({
    mutations,
  });
};
