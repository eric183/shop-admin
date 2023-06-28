import { sanityMutationClient } from "~base/sanity/client";
import { v4 as uuidv4 } from "uuid";
import { IProduct } from "~types/product";

export const createProductSampler = async (_formData_: any) => {
  const { name, category, brand, link, skus, images, inventory, _id } =
    _formData_;
  debugger;
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

        mutations.push({
          createOrReplace: {
            _type: "inventory",
            _id: uuidv4(),
            spu: {
              _type: "reference",
              _ref: skuId,
            },
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

  // const foundInventory = inventory.find((_i_) => _i_.spu._ref === spuId);
  // if (foundInventory || (skus && skus.length > 0)) {
  //   mutations.push({
  //     patch: {
  //       id: foundInventory?._id || uuidv4(),
  //       set: {
  //         spu: { _type: "spu", _ref: spuId },
  //         ...(foundInventory?.skus
  //           ? { skus: [...foundInventory.skus, ...skus] }
  //           : { skus }),
  //       },
  //     },
  //   });
  // }
  debugger;
  const { results } = await sanityMutationClient({ mutations });
  return results;
};

// create spu
export const createSpu = async (
  formData: Partial<IProduct>
): Promise<any[]> => {
  const { name, category, brand, link, skus } = formData;

  const { results } = await sanityMutationClient({
    mutations: [
      {
        create: {
          _type: "spu",
          _id: uuidv4(),
          name,
          category,
          brand,
          link,

          // images: imagesCreations,
        },
      },
    ],
  });

  return results;
};

export const createSkus = async (
  matchSPUId: string,
  formData: Partial<IProduct>
) => {
  const { skus } = formData;

  if (skus!.length === 0) return [];
  const { results } = await sanityMutationClient({
    mutations: skus?.map(({ attribute, price }) => {
      return {
        create: {
          _type: "sku",
          spu: {
            _type: "spu",
            _ref: matchSPUId,
            // weak: true,
          },
          price,
          attribute: {
            color: attribute?.color,
            size: attribute?.size,
          },
        },
      };
    }),
  });

  return results.map(({ document }: any) => ({ ...document }))!;
};

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

// create invertory
export const createInventory = async (
  matchSPUId: string,
  skus: IProduct["skus"],
  inventory: IProduct["inventory"]
) => {
  inventory = inventory ? inventory : [];
  const injectSkus =
    skus && skus.length > 0
      ? {
          skus: skus.map((sku) => ({
            _key: uuidv4(),
            id: sku._id,
            preQuantity: 0,
            actualQuantity: 0,
            remainQuantity: 0,
          })),
        }
      : {};

  const foundInventory = inventory.find((i) => i.spu._ref === matchSPUId);

  const { results } = await sanityMutationClient({
    mutations: [
      foundInventory
        ? {
            patch: {
              id: foundInventory._id,
              set: {
                skus: [
                  ...(foundInventory.skus ? foundInventory.skus : []),
                  ...injectSkus.skus!,
                ],
              },
            },
          }
        : {
            create: {
              _type: "inventory",
              _id: uuidv4(),
              spu: {
                _type: "reference",
                _ref: matchSPUId,
              },
              ...injectSkus,
            },
          },
    ],
  });

  return results;
};

// update spu
export const updateSpu = async (
  matchSPUId: string,
  formData: Partial<IProduct> & { images: any }
) => {
  const { skus, category, brand, link, images, name } = formData;

  await sanityMutationClient({
    mutations: [
      {
        patch: {
          id: matchSPUId,
          set: {
            name,
            category,
            brand,
            link,
            images,
            // ...data,
          },
        },
      },
    ],
  });
};

// update skus
export const updateSkus = async (
  matchSPUId: string,
  formData: Partial<IProduct>,
  spu: IProduct
) => {
  const { skus, inventory } = formData;

  let currentSkus;
  if (skus) {
    if (spu.skus.length > skus.length) {
      // delete
      const skuIds = skus.map((sku) => sku._id!);

      const noSkuToDelete = spu.skus.filter((sku) => skuIds.includes(sku._id!));
      const skuToDelete = spu.skus.filter((sku) => !skuIds.includes(sku._id!));

      // const invertoryToDelete = inventory?.skus.filter((sku) => !skuIds.includes(sku.sku._ref))
      // debugger;
      const deleteResults = await deleteInventory(
        matchSPUId,
        noSkuToDelete.map((x) => x._id!),
        spu.inventory
      );

      // debugger;
      currentSkus = await sanityMutationClient({
        mutations: skuToDelete.map((sku) => ({
          delete: {
            id: sku._id,
          },
        })),
      });
    } else {
      // create
      const skuIds = spu.skus.map((sku) => sku._id);
      // const skuToCreate = skus.filter((sku) => !skuIds.includes(sku._id));

      currentSkus = await sanityMutationClient({
        // mutations: skuToCreate.map((sku) => ({
        mutations: skus.map((sku) => ({
          createOrReplace: {
            _type: "sku",
            _id: sku._id ? sku._id : uuidv4(),
            spu: {
              _type: "spu",
              _ref: matchSPUId,
            },

            price: sku.price,
            attribute: {
              color: sku.attribute?.color,
              size: sku.attribute?.size,
            },
          },
        })),
      });
    }

    return currentSkus;
  }
};

export const deleteInventory = async (
  matchSPUId: string,
  skuIds: string[],
  inventory: IProduct["inventory"]
) => {
  // const deleteSkuIds = noDeleteSkus.map((sku) => sku._id);
  const foundInventory = inventory.find((i) => i.spu._ref === matchSPUId)!;

  const skuToDelete = foundInventory.skus.filter((sku) =>
    skuIds.includes(sku.id!)
  );

  // inventory

  const results = await sanityMutationClient({
    mutations: [
      {
        patch: {
          id: foundInventory?._id,
          set: {
            skus: skuToDelete,
          },
        },
      },
    ],
  });

  return results;
};
