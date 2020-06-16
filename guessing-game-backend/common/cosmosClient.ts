import { CosmosClient } from "@azure/cosmos"

const client = new CosmosClient({ 
    endpoint: process.env["Database_Endpoint"],
    key: process.env["Database_Key"]
})

export const dbItems = client.database(process.env["Database_Name"]).container(process.env["ContainerId"]).items;

export const getTop10Closest = async function (item: string) {
  const querySpec = {
      query: 'SELECT VALUE r.estimate FROM root r WHERE r.itemName = @itemName',
      parameters: [
          {
            name: '@itemName',
            value: item
          }
        ]
  };
  let results = await dbItems.query(querySpec).fetchAll();
  return results.resources;
}