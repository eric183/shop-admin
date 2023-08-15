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
  const { name, category, brand, images, _id, spu } = _formData_;

  const brandID = brand._id ? brand._id : uuidv4();
  const spuId = spu._id ? spu._id : uuidv4();
  const skus = spu.skus;
  const link = spu.link;
  const mutations: any = [
    {
      createOrReplace: {
        _id: spuId,
        _type: "spu",
        name: spu.name,
        category,
        brand: {
          _type: "reference",
          _ref: brandID,
        },
        link,
        images,
      },
    },
  ];

  if (skus && skus.length > 0) {
    mutations.push(
      ...skus.map(({ _id, attribute, price }: any) => {
        const skuId = _id ? _id : uuidv4();

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

  mutations.push({
    createOrReplace: {
      _type: "brand",
      _id: brandID,
      name: brand.name,
    },
  });

  const { results } = await sanityMutationClient({ mutations });
  return results;
};

export const updateProduct = async (
  spuId: string,
  formData: any,
  productInfo: any
) => {
  const { spu, _id, category, images, name, brand } = formData;
  const { skus } = spu;

  const brandID = brand._id;
  const link = formData.spu.link;
  const mutations: any = [
    {
      patch: {
        id: spu._id,
        set: {
          name,
          category,
          brand: {
            _type: "reference",
            _ref: brandID,
          },
          link,
          images,
        },
      },
    },
  ];

  if (skus) {
    if (productInfo.skus.length > skus.length) {
      // delete
      const skuIds = skus.map((sku: { _id: string }) => sku._id!);

      const noSkuToDelete = productInfo.skus.filter((sku: { _id: string }) =>
        skuIds.includes(sku._id!)
      );

      const skuToDelete = productInfo.skus.filter(
        (sku: { _id: string }) => !skuIds.includes(sku._id!)
      );

      mutations.push(
        ...skuToDelete.map((sku: { _id: string }) => {
          // const foundInventory = inventory?.find((i: any) =>
          //   i.skus.find((x: any) => x?.id === sku._id)
          // );
          // const inventoryId = foundInventory!._id;
          // mutations.push({
          //   delete: {
          //     id: inventoryId,
          //   },
          // });

          return {
            delete: {
              id: sku._id,
            },
          };
        })
      );
    } else {
      // create
      const skuIds = productInfo.skus.map((sku: { _id: string }) => sku._id);
      // const skuToCreate = skus.filter((sku) => !skuIds.includes(sku._id));
      mutations.push(
        ...skus.map(
          (sku: {
            _id: string;
            price: string;
            attribute: { color: string; size: string };
          }) => {
            const skuId = sku._id ? sku._id : uuidv4();
            // const foundInventory = inventory?.find((i: any) =>
            //   i.skus.find((x: any) => x?.id === sku._id)
            // );

            // const inventoryId = foundInventory ? foundInventory._id : uuidv4();

            // mutations.push({
            //   createOrReplace: {
            //     _type: "inventory",
            //     _id: inventoryId,
            //     spu: {
            //       _type: "reference",
            //       _ref: spuId,
            //     },
            //     skus: [
            //       {
            //         _key: uuidv4(),
            //         id: skuId,
            //       },
            //     ],
            //   },
            // });
            return {
              createOrReplace: {
                _type: "sku",
                _id: skuId,
                spu: {
                  _type: "spu",
                  _ref: productInfo._id,
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

  mutations.push({
    createOrReplace: {
      _type: "brand",
      _id: brandID,
      name: brand.name,
      // ...brand,
    },
  });

  await sanityMutationClient({
    mutations,
  });
};

export const deleteProduct = async (spu: any) => {
  const mutations: any = [
    {
      delete: {
        id: spu._id,
      },
    },
  ];

  const skuIds = spu.skus.map((sku: { _id: any }) => sku._id);
  mutations.push(
    ...skuIds.map((skuId: any) => {
      return {
        delete: {
          id: skuId,
        },
      };
    })
  );

  await sanityMutationClient({
    mutations,
  });
};
